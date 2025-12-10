package Messenger.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    String  id;

    // thông tin người đăng
    String userId;
    String authorName;
    String authorAvatar;

    // nội dung post
    String content;
    List<String> images;  // danh sách URL ảnh

    LocalDateTime createdAt;

    // các thống kê
    int likeCount;
    int commentCount;

    // trạng thái cho người dùng đang xem
    boolean likedByCurrentUser;
}
