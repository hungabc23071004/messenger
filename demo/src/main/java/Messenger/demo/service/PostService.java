package Messenger.demo.service;

import Messenger.demo.constant.MinIOPrefixUrl;
import Messenger.demo.constant.MinioPrefixConstant;
import Messenger.demo.dto.request.CommentRequest;
import Messenger.demo.dto.request.PostRequest;
import Messenger.demo.dto.response.CommentResponse;
import Messenger.demo.dto.response.LikeResponse;
import Messenger.demo.dto.response.PostResponse;
import Messenger.demo.dto.response.UserResponse;
import Messenger.demo.dto.even.WebSocketEvent;
import Messenger.demo.exception.AppException;
import Messenger.demo.exception.ErrorCode;
import Messenger.demo.mapper.PostMapper;
import Messenger.demo.model.Comment;
import Messenger.demo.model.Like;
import Messenger.demo.model.Post;
import Messenger.demo.model.User;
import Messenger.demo.repository.CommentRepository;
import Messenger.demo.repository.LikeRepository;
import Messenger.demo.repository.PostRepository;
import Messenger.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {

    PostRepository postRepo;
    CommentRepository commentRepo;
    LikeRepository likeRepo;
    SimpMessagingTemplate messaging;
    UserService userService;
    FileService fileService;
    FriendshipService friendService;
    UserRepository userRepo;
    PostMapper postMapper;

    public PostResponse createPost(PostRequest req) {

        User current = userService.getCurrentUser();
        List<String> images = req.getImages()
                .parallelStream()
                .map(file -> fileService.upload(file, MinioPrefixConstant.POSTS))
                .toList();

        Post post = Post.builder()
                .userId(current.getId())
                .content(req.getContent())
                .images(images)
                .build();

        postRepo.save(post);
        PostResponse postResponse = toPostResponse(post);
        
        // Push event qua WebSocket với wrapper
        WebSocketEvent<PostResponse> event = WebSocketEvent.<PostResponse>builder()
                .type("POST_CREATED")
                .data(postResponse)
                .timestamp(Instant.now().toString())
                .build();
        pushFeedToUsers(event, current.getId());
        
        return postResponse;
    }


    public LikeResponse toggleLike(String postId) {
        User user = userService.getCurrentUser();
        String userId = user.getId();

        Post post = postRepo.findById(postId).orElseThrow(()-> new AppException(ErrorCode.POST_NOT_FOUND));

        boolean liked;

        if (likeRepo.existsByPostIdAndUserId(postId, userId)) {
            likeRepo.deleteByPostIdAndUserId(postId, userId);
            post.setLikeCount(post.getLikeCount() - 1);
            liked = false;
        } else {
            likeRepo.save(new Like(null, postId, userId));

            post.setLikeCount(post.getLikeCount() + 1);
            liked = true;
        }
        postRepo.save(post);

        LikeResponse likeResponse = LikeResponse.builder()
                .postId(postId)
                .userId(userId)
                .liked(liked)
                .likeCount(post.getLikeCount())
                .build();

        // Push event qua WebSocket với wrapper
        WebSocketEvent<LikeResponse> event = WebSocketEvent.<LikeResponse>builder()
                .type("POST_LIKED")
                .data(likeResponse)
                .timestamp(Instant.now().toString())
                .build();
        pushFeedToUsers(event, userId);
        
        return likeResponse;
    }

    public PostResponse toPostResponse(Post post) {
        User author = userRepo.findById(post.getUserId()).orElseThrow();

        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .content(post.getContent())
                .images(
                        post.getImages().stream()
                                .map(img -> MinIOPrefixUrl.MINIO_URL + img)
                                .toList()
                )                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .authorAvatar(MinIOPrefixUrl.MINIO_URL + author.getAvatarUrl())
                .authorName(author.getFullName())
                .createdAt(post.getCreatedAt())
                .build();
    }

    public PostResponse getPostById(String id) {
        Post post = postRepo.findById(id).orElseThrow();
        return toPostResponse(post);
    }


    public List<PostResponse> getNewsFeed(int page, int size) {
        User current = userService.getCurrentUser();
        List<String> friendIds = new ArrayList<>(
                friendService.getFriends()
                        .stream()
                        .map(UserResponse::getId)
                        .toList()
        );
        friendIds.add(current.getId());

        Pageable pageable = PageRequest.of(page, size);
        List<Post> posts = postRepo.findByUserIdInOrderByCreatedAtDesc(friendIds, pageable);

        return posts.stream()
                .map(this::toPostResponse)
                .toList();
    }


    public CommentResponse addComment(CommentRequest request) {
        User user = userService.getCurrentUser();

        Comment comment = Comment.builder()
                .postId(request.getPostId())
                .userId(user.getId())
                .content(request.getContent())
                .build();
        if(request.getParentCommentId() != null) {
            comment.setParentCommentId(request.getParentCommentId());
        }

        commentRepo.save(comment);
        Post post = postRepo.findById(request.getPostId()).orElseThrow();
        post.setCommentCount(post.getCommentCount() + 1);
        postRepo.save(post);

        CommentResponse commentResponse= postMapper.toCommentResponse(comment, user);

        // Push event qua WebSocket
        WebSocketEvent<CommentResponse> event = WebSocketEvent.<CommentResponse>builder()
                .type("COMMENT_ADDED")
                .data(commentResponse)
                .timestamp(Instant.now().toString())
                .build();
        messaging.convertAndSend("/topic/post." + request.getPostId() + ".comment", event);

        return commentResponse;
    }


    public List<CommentResponse> getComments(String postId) {
        List<Comment> comments = commentRepo.findByPostId(postId);

        // Sort theo thời gian tạo
        comments.sort(Comparator.comparing(Comment::getCreatedAt));

        List<String> userIds = comments.stream()
                .map(Comment::getUserId)
                .distinct()
                .toList();

        Map<String, User> userMap = userRepo.findByIdIn(userIds)
                .stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        return comments.stream()
                .map(c -> postMapper.toCommentResponse(c, userMap.get(c.getUserId())))
                .toList();
    }


    @Transactional
    public void deleteComment(String commentId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        User current = userService.getCurrentUser();
        if (!comment.getUserId().equals(current.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        String postId = comment.getPostId();


        List<Comment> replies = commentRepo.findByParentCommentId(commentId);

        commentRepo.deleteAll(replies);
        commentRepo.delete(comment);

        int totalDeleted = replies.size() + 1;

        Post post = postRepo.findById(postId).orElseThrow();
        post.setCommentCount(Math.max(0, post.getCommentCount() - totalDeleted));
        postRepo.save(post);

        // Push WS event
        messaging.convertAndSend(
                "/topic/post." + postId + ".comment",
                WebSocketEvent.builder()
                        .type("COMMENT_DELETED")
                        .data(Map.of("commentId", commentId, "postId", postId))
                        .timestamp(Instant.now().toString())
                        .build()
        );

        for (Comment reply : replies) {
            messaging.convertAndSend(
                    "/topic/post." + postId + ".comment",
                    WebSocketEvent.builder()
                            .type("COMMENT_DELETED")
                            .data(Map.of("commentId", reply.getId(), "postId", postId))
                            .timestamp(Instant.now().toString())
                            .build()
            );
        }
    }

    public CommentResponse updateComment(String commentId, CommentRequest request) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        
        User currentUser = userService.getCurrentUser();
        if (!comment.getUserId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        comment.setContent(request.getContent());
        commentRepo.save(comment);

        CommentResponse commentResponse = postMapper.toCommentResponse(comment, currentUser);
        
        WebSocketEvent<CommentResponse> event = WebSocketEvent.<CommentResponse>builder()
                .type("COMMENT_UPDATED")
                .data(commentResponse)
                .timestamp(Instant.now().toString())
                .build();
        messaging.convertAndSend("/topic/post." + comment.getPostId() + ".comment", event);

        return commentResponse;
    }

    private void pushFeedToUsers(WebSocketEvent<?> event, String currentUserId) {

        List<String> friends = friendService.getFriends()
                .stream()
                .map(UserResponse::getId)
                .toList();

        // Push cho bạn bè qua topic cá nhân
        for (String friendId : friends) {
            messaging.convertAndSend(
                    "/topic/feed.user." + friendId,
                    event
            );
        }

        // Push cho chính người đăng
        messaging.convertAndSend(
                "/topic/feed.user." + currentUserId,
                event
        );
    }
}
