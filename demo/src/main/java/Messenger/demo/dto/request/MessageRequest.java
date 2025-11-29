package Messenger.demo.dto.request;

import Messenger.demo.Enum.MessageType;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageRequest {
    String conversationId;
    String senderId;
    String content;
    MessageType type;
    String  mediaUrl;
}
