package Messenger.demo.model;

import Messenger.demo.Enum.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document
@Builder
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    // Auth
    String email;
    String password; // BCrypt hash


    // Profile
    String fullName;
    String avatarUrl;
    String bannerUrl;
    String bio;
    String gender; // male, female, other
    LocalDate dateOfBirth;

    // Status / presence
    String status; // online, offline, busy
    LocalDateTime lastSeen;

    // Tối ưu load conversation list


    String phoneNumber;
    String currentAddress;
    String homeTown;
    String education;
    String work;

     Set<Role> roles;


     boolean verified;
}
