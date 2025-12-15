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
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friendships")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class FriendshipController {
    FriendshipService friendshipService;

    @PostMapping("/invite")
    public ApiResponse<Void> sendFriendRequest(@RequestBody FriendShipRequest request) {
        friendshipService.sendFriendRequest(request);
        return ApiResponse.<Void>builder()
                .message("Friend request sent successfully")
                .build();
    }

    @PostMapping("/accept")
    public ApiResponse<?> acceptFriendRequest(@RequestBody FriendShipRequest request) {
        friendshipService.acceptFriendRequest(request);
       return ApiResponse.<Void>builder()
                .message("Friend request accepted successfully")
                .build();
    }

    @DeleteMapping("/decline")
    public ApiResponse<Void> declineOrCancelRequest(@RequestBody FriendShipRequest request) {
        friendshipService.declineFriendRequest(request);
        return ApiResponse.<Void>builder()
                .message("Friend request declined/canceled successfully")
                .build();
    }

    @PostMapping("/block")
    public ApiResponse<Void> blockFriend(@RequestBody FriendShipRequest request) {
        friendshipService.blockFriend(request);
        return ApiResponse.<Void>builder()
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



    @GetMapping("/online_friends")
    public ApiResponse<List<UserResponse>> getOnlineFriends() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(friendshipService.getOnlineFriends())
                .message("Online friends retrieved successfully")
                .build();
    }


    @GetMapping("/requests")
    public ApiResponse<List<FriendShipResponse>> getFriendRequests(@RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return ApiResponse.<List<FriendShipResponse>>builder()
                .result(friendshipService.getFriendRequests(pageable))
                .message("Friend requests retrieved successfully")
                .build();
    }

    @DeleteMapping("/unfriend/{friendId}")
    public ApiResponse<Void> unfriend(@PathVariable String friendId) {
        friendshipService.unfriend(friendId);
        return ApiResponse.<Void>builder()
                .message("Unfriend successfully")
                .build();
    }

    @GetMapping("/birthdays")
    public ApiResponse<List<UserResponse>> getFriendsWithBirthdayToday() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(friendshipService.getFriendsWithBirthdayToday())
                .message("Friends with birthday today retrieved successfully")
                .build();
    }

}
