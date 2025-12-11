package Messenger.demo.controller;

import Messenger.demo.dto.request.CommentRequest;
import Messenger.demo.dto.request.PostRequest;
import Messenger.demo.dto.response.ApiResponse;
import Messenger.demo.dto.response.CommentResponse;
import Messenger.demo.dto.response.LikeResponse;
import Messenger.demo.dto.response.PostResponse;
import Messenger.demo.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class PostController {

    PostService postService;

    @PostMapping(value = "", consumes = "multipart/form-data")
    public ApiResponse<PostResponse>  createPost(@ModelAttribute PostRequest req) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.createPost(req))
                .build();
    }

    @PostMapping("/{id}/like")
    public ApiResponse<LikeResponse> toggleLike(@PathVariable String id
                                ) {
        return ApiResponse.<LikeResponse>builder()
                .result(postService.toggleLike( id))
                .build();
    }

    @PostMapping("/comment")
    public ApiResponse<CommentResponse> addComment(@RequestBody CommentRequest req) {
        return ApiResponse.<CommentResponse>builder()
                .result(postService.addComment( req))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getPostById(@PathVariable String id) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.getPostById(id))
                .build();
    }

    @GetMapping
        public ApiResponse<List<PostResponse>> getNewsFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
        ) {
        return ApiResponse.<List<PostResponse>>builder()
            .result(postService.getNewsFeed(page, size))
            .build();
        }

    @GetMapping("/{postId}/comments")
    public ApiResponse<List<CommentResponse>> getComments(@PathVariable String postId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(postService.getComments(postId))
                .build();
    }

    @DeleteMapping("/comment/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable String commentId) {
        postService.deleteComment(commentId);
        return ApiResponse.<Void>builder()
                .message("Comment deleted successfully")
                .build();
    }

    @PutMapping("/comment/{commentId}")
    public ApiResponse<CommentResponse> updateComment(
            @PathVariable String commentId,
            @RequestBody CommentRequest req
    ) {
        return ApiResponse.<CommentResponse>builder()
                .result(postService.updateComment(commentId, req))
                .build();
    }
}
