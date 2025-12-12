package Messenger.demo.dto.request;

import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String gender; // male, female, other
    LocalDate dateOfBirth;
    String fullName;
    String bio;
    String phoneNumber;
    String currentAddress;
    String homeTown;
    String education;
    String work;
}
