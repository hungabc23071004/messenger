package Messenger.demo.controller;

import Messenger.demo.dto.request.AccountRegisterRequest;
import Messenger.demo.dto.request.AuthenticationRequest;
import Messenger.demo.dto.response.ApiResponse;
import Messenger.demo.dto.response.AuthenticationResponse;
import Messenger.demo.dto.response.UserResponse;
import Messenger.demo.service.AuthenticationService;
import Messenger.demo.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;
    UserService userService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> registerAccount(@RequestBody AccountRegisterRequest request) throws Exception {
        return ApiResponse.<UserResponse>builder()
                .result(authenticationService.registerAccount(request))
                .message("Register account successfully")
                .build();
    }

    @GetMapping("/verification")
    public ApiResponse<String> verifyAccount(@RequestParam("token") String token) {
        authenticationService.verifyAccount(token);
        return ApiResponse.<String>builder()
                .message("Verify account successfully")
                .build();
    }

    @PostMapping("/authentication")
    public ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request){
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.authenticate(request))
                .message("Login successfully")
                .build();
    }

}
