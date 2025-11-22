package Messenger.demo.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document
public class Notification {
    @Id
    String id;

    String receiverId;
    String type; // MESSAGE, CALL, STORY, FRIEND_REQUEST
    String referenceId; // messageId hoặc conversationId

    boolean read;

    @CreatedDate
    LocalDateTime createdAt;
}
