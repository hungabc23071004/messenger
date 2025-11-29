package Messenger.demo.dto.even;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PresenceEvent {
    String userId;
    boolean online;
    LocalDateTime lastSeen;
}
