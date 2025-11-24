package Messenger.demo.dto.response;

import Messenger.demo.Enum.FriendShipStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendShipResponse {
    String id;
    String inviterId; // Người gửi lời mời
    String receiverId; // Người nhận lời mời
    FriendShipStatus status;
}
