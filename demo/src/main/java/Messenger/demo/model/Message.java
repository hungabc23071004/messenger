package Messenger.demo.model;

import Messenger.demo.Enum.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document
public class Message {
    @Id
    String id;

    String conversationId;

    String senderId;

    MessageType type; // TEXT, IMAGE, VIDEO, AUDIO, FILE, CALL

    String content;

    String mediaUrl;

    List<String> seenBy;

    @CreatedDate
    LocalDateTime createdAt;
}
