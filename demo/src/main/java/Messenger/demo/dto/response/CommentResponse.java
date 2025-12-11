package Messenger.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    String id;
    String postId;
    String userId;
    String content;
    LocalDateTime createdAt;
    String authorName;
    String authorAvatar;
    String parentCommentId;
}
