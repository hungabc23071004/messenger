package Messenger.demo.dto.even;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WebSocketEvent<T> {
    private String type;        // Event type: "COMMENT_ADDED", "COMMENT_DELETED", "COMMENT_UPDATED", etc.
    private T data;             // Event payload: CommentResponse, LikeResponse, etc.
    private String timestamp;   // ISO timestamp
}
