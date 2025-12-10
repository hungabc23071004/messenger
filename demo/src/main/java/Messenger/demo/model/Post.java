package Messenger.demo.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document
@Builder
public class Post {
    @Id
    String id;

    String userId;
    String content;
    List<String> images;
    @CreatedDate
    LocalDateTime createdAt;
    int likeCount;
    int commentCount;
}
