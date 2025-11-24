package Messenger.demo.model;



import Messenger.demo.Enum.FriendShipStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.checkerframework.common.value.qual.EnumVal;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document
@Builder
public class Friendship {
    @Id
    String id;


    @Indexed
    String inviterId; // Người gửi lời mời
    @Indexed
    String receiverId; // Người nhận lời mời

    @Indexed
    FriendShipStatus status; // PENDING, ACCEPTED, BLOCKED

    @CreatedDate
    LocalDateTime createdAt;

    @LastModifiedDate
    LocalDateTime updatedAt;
}
