package Messenger.demo.dto.response;

import Messenger.demo.Enum.MessageType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse {
    String id;
    String conversationId;
    String senderId;
    MessageType type;
    String content;
    String mediaUrl;
    List<String> seenBy;
    LocalDateTime createdAt;

}
