package Messenger.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String email;
    String gender; // male, female, other
    LocalDate dateOfBirth;
    String fullName;
    String avatarUrl;
    String bio;
    String status;
    String bannerUrl;
    String phoneNumber;
    String currentAddress;
    String homeTown;
    String education;
    String work;

}
