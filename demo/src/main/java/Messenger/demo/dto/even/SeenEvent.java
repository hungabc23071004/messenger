package Messenger.demo.dto.even;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeenEvent {
    String conversationId;
    String userId;
    LocalDateTime seenAt;
}
