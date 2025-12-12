package Messenger.demo.controller;

import Messenger.demo.dto.request.UserAvatarRequest;
import Messenger.demo.dto.request.UserUpdateRequest;
import Messenger.demo.dto.response.ApiResponse;
import Messenger.demo.dto.response.UserResponse;
import Messenger.demo.model.User;
import Messenger.demo.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class UserController {

    UserService userService;

    @GetMapping("/information")
    public ApiResponse<UserResponse> getMyInfor() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfor())
                .message("Get user information successfully")
                .build();
    }

    @PutMapping()
    public ApiResponse<UserResponse> updateMyInfor(@RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateMyInfor(request))
                .message("Update user information successfully")
                .build();
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<String> uploadAvatar(@ModelAttribute UserAvatarRequest request) {
        return ApiResponse.<String>builder()
                .result(userService.uploadAvatar(request))
                .message("Upload avatar successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserInfor(@PathVariable("id") String id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(id))
                .message("Get user information successfully")
                .build();
    }

    @PostMapping(value = "/banner", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<String> uploadBanner(@ModelAttribute UserAvatarRequest request) {
        return ApiResponse.<String>builder()
                .result(userService.uploadBanner(request))
                .message("Upload banner successfully")
                .build();   }

}
