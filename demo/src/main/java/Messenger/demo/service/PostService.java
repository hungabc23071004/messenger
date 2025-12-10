package Messenger.demo.service;

import Messenger.demo.constant.MinIOPrefixUrl;
import Messenger.demo.constant.MinioPrefixConstant;
import Messenger.demo.dto.request.CommentRequest;
import Messenger.demo.dto.request.PostRequest;
import Messenger.demo.dto.response.CommentResponse;
import Messenger.demo.dto.response.LikeResponse;
import Messenger.demo.dto.response.PostResponse;
import Messenger.demo.dto.response.UserResponse;
import Messenger.demo.exception.AppException;
import Messenger.demo.exception.ErrorCode;
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
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

    // ============= CREATE POST =============
    public PostResponse createPost(PostRequest req) {

        User current = userService.getCurrentUser();
        List<String > images = new ArrayList<>();

        for (MultipartFile file : req.getImages()) {
            images.add(fileService.upload(file, MinioPrefixConstant.POSTS));
        }

        Post post = Post.builder()
                .userId(current.getId())
                .content(req.getContent())
                .images(images)
                .likeCount(0)
                .commentCount(0)
                .build();

        postRepo.save(post);
        PostResponse postResponse = toPostResponse(post);
        refreshFeed(postResponse, current.getId());
        return postResponse;
    }

    // ============= LIKE / UNLIKE =============
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

        refreshFeed(likeResponse, userId);
        return likeResponse;
    }

    // ============= COMMENT =============
    public CommentResponse addComment(CommentRequest request) {
        User user = userService.getCurrentUser();

        Comment comment = Comment.builder()
                .postId(request.getPostId())
                .userId(user.getId())
                .content(request.getContent())

                .build();

        commentRepo.save(comment);

        // Tăng comment count
        Post post = postRepo.findById(request.getPostId()).orElseThrow();
        post.setCommentCount(post.getCommentCount() + 1);
        postRepo.save(post);

        CommentResponse commentResponse = CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .authorName(user.getFullName())
                .authorAvatar(MinIOPrefixUrl.MINIO_URL + user.getAvatarUrl())
                .build();

        refreshFeed(commentResponse, user.getId());

        return commentResponse;
    }


    // ============= Convert Entity → Response =============
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

    private void refreshFeed (Object a, String currentUserId) {
        List<String> friends = friendService
                .getFriends()
                .stream()
                .map(UserResponse::getId)
                .toList();

        // Gửi cho tất cả bạn bè qua user queue
        friends.forEach(friendId -> {
            messaging.convertAndSendToUser(
                    friendId,
                    "/queue/feed",
                    a);
        });

        // Gửi cho chính người đăng
        messaging.convertAndSendToUser(
                currentUserId,
                "/queue/feed",
                a
        );
    }
}
