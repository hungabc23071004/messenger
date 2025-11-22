package Messenger.demo.model;

import Messenger.demo.Enum.CallStatus;
import Messenger.demo.Enum.CallType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;


@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document
public class CallSession {
    @Id
    String id;

    String conversationId;
    List<String> participants;

    CallType type; // AUDIO, VIDEO
    CallStatus status; // RINGING, ACCEPTED, MISSED, ENDED

    @CreatedDate
    LocalDateTime startedAt;

    @LastModifiedDate
    LocalDateTime endedAt;
}
