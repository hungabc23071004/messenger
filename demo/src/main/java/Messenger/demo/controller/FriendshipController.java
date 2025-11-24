package Messenger.demo.controller;

import Messenger.demo.dto.request.FriendShipRequest;
import Messenger.demo.dto.response.ApiResponse;
import Messenger.demo.dto.response.FriendShipResponse;
import Messenger.demo.dto.response.UserResponse;
import Messenger.demo.model.Friendship;
import Messenger.demo.model.User;
import Messenger.demo.service.AuthenticationService;
import Messenger.demo.service.FriendshipService;
import Messenger.demo.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friendships")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class FriendshipController {
    FriendshipService friendshipService;

    @PostMapping("/invite")
    public ApiResponse<FriendShipResponse> sendFriendRequest(@RequestBody FriendShipRequest request) {
        return ApiResponse.<FriendShipResponse>builder()
                .result(friendshipService.sendFriendRequest(request))
                .message("Friend request sent successfully")
                .build();
    }

    @PostMapping("/accept")
    public ApiResponse<FriendShipResponse> acceptFriendRequest(@RequestBody FriendShipRequest request) {
        return ApiResponse.<FriendShipResponse>builder()
                .result(friendshipService.acceptFriendRequest(request))
                .message("Friend request accepted successfully")
                .build();
    }

    @DeleteMapping("/decline")
    public ApiResponse<Void> declineOrCancelRequest(@RequestBody FriendShipRequest request) {
        friendshipService.declineOrCancelRequest(request);
        return ApiResponse.<Void>builder()
                .message("Friend request declined/canceled successfully")
                .build();
    }

    @PostMapping("/block")
    public ApiResponse<FriendShipResponse> blockFriend(@RequestBody FriendShipRequest request) {
        return ApiResponse.<FriendShipResponse>builder()
                .result(friendshipService.blockFriend(request))
                .message("User blocked successfully")
                .build();
    }

    @GetMapping("/friends")
    public ApiResponse<List<UserResponse>> getFriends() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(friendshipService.getFriends())
                .message("Friends retrieved successfully")
                .build();
    }

    @GetMapping("/requests")
    public ApiResponse<List<FriendShipResponse>> getFriendRequests() {
        return ApiResponse.<List<FriendShipResponse>>builder()
                .result(friendshipService.getAllFriendRequests())
                .message("Friend requests retrieved successfully")
                .build();

    }
}
