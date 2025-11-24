package Messenger.demo.service;

import Messenger.demo.Enum.FriendShipStatus;
import Messenger.demo.dto.request.FriendShipRequest;
import Messenger.demo.dto.response.FriendShipResponse;
import Messenger.demo.dto.response.UserResponse;
import Messenger.demo.exception.AppException;
import Messenger.demo.exception.ErrorCode;
import Messenger.demo.mapper.FriendShipMapper;
import Messenger.demo.mapper.UserMapper;
import Messenger.demo.model.Friendship;
import Messenger.demo.model.User;
import Messenger.demo.repository.FriendshipRepository;
import Messenger.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class FriendshipService {
    FriendshipRepository friendshipRepository;
    UserRepository userRepository;
    UserService userService;
    FriendShipMapper friendShipMapper;
    UserMapper userMapper;

    public FriendShipResponse sendFriendRequest(FriendShipRequest request) {
        User user = userService.getCurrentUser();
        if (user.getId().equals(request.getFriendId())) throw new IllegalArgumentException("Không thể kết bạn với chính mình");
        Optional<Friendship> existing = friendshipRepository.findByInviterIdAndReceiverId(
                user.getId(), request.getFriendId()
        );
        if (existing.isPresent()) throw new IllegalStateException("Đã gửi lời mời hoặc đã là bạn bè");
        Friendship friendship = Friendship.builder()
                .inviterId(user.getId())
                .receiverId(request.getFriendId())
                .status(FriendShipStatus.PENDING)
                .build();
        return friendShipMapper.toFriendShipResponse(friendshipRepository.save(friendship));
    }

    public FriendShipResponse acceptFriendRequest(FriendShipRequest request) {
        Friendship friendship = friendshipRepository.findById(request.getFriendShipId())
                .orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOT_FOUND));
        friendship.setStatus(FriendShipStatus.ACCEPTED);
        return friendShipMapper.toFriendShipResponse(friendshipRepository.save(friendship)) ;
    }

    public void declineOrCancelRequest(FriendShipRequest request) {
        friendshipRepository.deleteById(request.getFriendShipId());
    }

    public FriendShipResponse blockFriend(FriendShipRequest request) {
        Friendship friendship = friendshipRepository.findById(request.getFriendShipId())
                .orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOT_FOUND));
        friendship.setStatus(FriendShipStatus.BLOCKED);
        return friendShipMapper.toFriendShipResponse(friendshipRepository.save(friendship)) ;
    }


    public List<UserResponse> getFriends() {
        User user = userService.getCurrentUser();
        String userId = user.getId();
        List<Friendship> friendships = friendshipRepository.findByInviterIdOrReceiverIdAndStatus(userId, userId, FriendShipStatus.ACCEPTED);
        List<String> friendIds = friendships.stream()
                .map(f -> f.getInviterId().equals(userId) ? f.getReceiverId() : f.getInviterId())
                .collect(Collectors.toList());
        return userMapper.toUserResponseList(userRepository.findAllById(friendIds));
    }

    public List<FriendShipResponse> getAllFriendRequests() {
        User user = userService.getCurrentUser();
        String userId = user.getId();
        List<Friendship> friendships = friendshipRepository.findByReceiverIdAndStatus(userId, FriendShipStatus.PENDING);
        return friendShipMapper.toFriendShipResponseList(friendships);
    }
}
