package Messenger.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationResponse {
    String id;
    String name;                     // group name hoặc null
    boolean isGroup;
    List<UserShortInfoResponse> participants;
    UserShortInfoResponse partner;           // nếu 1-1
    int unreadCount;
}
