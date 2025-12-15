package Messenger.demo.service;

import Messenger.demo.Enum.FriendShipStatus;
import Messenger.demo.constant.RedisPrefixKeyConstant;
import Messenger.demo.dto.even.WebSocketEvent;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FriendshipService {

    FriendshipRepository friendshipRepository;
    UserRepository userRepository;
    UserService userService;
    FriendShipMapper friendShipMapper;
    UserMapper userMapper;
    RedisTemplate<String, Object> redisTemplate;
    SimpMessagingTemplate simpMessagingTemplate;


    @Transactional
    public void sendFriendRequest(FriendShipRequest request) {
        User me = userService.getCurrentUser();

        if (me.getId().equals(request.getFriendId())) {
            throw new AppException(ErrorCode.CANNOT_ADD_YOURSELF_AS_FRIEND);
        }

        Friendship friendship = friendshipRepository.save(
                Friendship.builder()
                        .inviterId(me.getId())
                        .receiverId(request.getFriendId())
                        .status(FriendShipStatus.PENDING)
                        .build()
        );

        // Socket chỉ báo hiệu có request mới
        simpMessagingTemplate.convertAndSendToUser(
                request.getFriendId(),
                "/queue/friendship",
                WebSocketEvent.builder()
                        .type("FRIEND_REQUEST_NEW")
                        .data(friendship.getId())
                        .timestamp(LocalDateTime.now().toString())
                        .build()
        );
    }


    public List<FriendShipResponse> getFriendRequests(Pageable pageable) {
        String me = userService.getCurrentUser().getId();

        Page<Friendship> page = (Page<Friendship>) friendshipRepository.findByReceiverIdAndStatus(me, FriendShipStatus.PENDING, pageable);

        return page.stream()
                .map(friendship -> {
                    User inviter = userRepository.findById(friendship.getInviterId()).orElse(null);
                    return friendShipMapper.toFriendShipResponse(friendship, inviter);
                })
                .collect(Collectors.toList());
    }



    @Transactional
    public void acceptFriendRequest(FriendShipRequest request) {
        Friendship friendship = friendshipRepository.findById(request.getFriendShipId())
                .orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOT_FOUND));

        if (friendship.getStatus() != FriendShipStatus.PENDING) {
            throw new IllegalStateException("Friend request không hợp lệ");
        }

        friendship.setStatus(FriendShipStatus.ACCEPTED);
        friendshipRepository.save(friendship);

        redisTemplate.opsForSet().add(
                RedisPrefixKeyConstant.FRIENDS + friendship.getInviterId(),
                friendship.getReceiverId()
        );

        redisTemplate.opsForSet().add(
                RedisPrefixKeyConstant.FRIENDS + friendship.getReceiverId(),
                friendship.getInviterId()
        );

        WebSocketEvent<String> event = WebSocketEvent.<String>builder()
                .type("FRIEND_REQUEST_ACCEPTED")
                .data(friendship.getId())
                .timestamp(LocalDateTime.now().toString())
                .build();

        simpMessagingTemplate.convertAndSendToUser(
                friendship.getInviterId(),
                "/queue/friendship",
                event
        );

        simpMessagingTemplate.convertAndSendToUser(
                friendship.getReceiverId(),
                "/queue/friendship",
                event
        );
    }

    @Transactional
    public void declineFriendRequest(FriendShipRequest request) {
        friendshipRepository.deleteById(request.getFriendShipId());
    }

    @Transactional
    public void unfriend(String friendId) {
        String currentUserId = userService.getCurrentUser().getId();

        Friendship friendship = friendshipRepository.findByInviterIdAndReceiverId(currentUserId, friendId)
                .orElseGet(() -> friendshipRepository.findByInviterIdAndReceiverId(friendId, currentUserId)
                        .orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOT_FOUND)));

        friendshipRepository.deleteById(friendship.getId());


            redisTemplate.opsForSet().remove(
                    RedisPrefixKeyConstant.FRIENDS + currentUserId,
                    friendId
            );
            redisTemplate.opsForSet().remove(
                    RedisPrefixKeyConstant.FRIENDS + friendId,
                    currentUserId
            );


        WebSocketEvent event = WebSocketEvent.builder()
                .type("FRIEND_REMOVED")
                .data(currentUserId)
                .timestamp(LocalDateTime.now().toString())
                .build();

        simpMessagingTemplate.convertAndSendToUser(
                friendId,
                "/queue/friendship",
                event
        );
    }


    @Transactional
    public void blockFriend(FriendShipRequest request) {
        Friendship friendship = friendshipRepository.findById(request.getFriendShipId())
                .orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOT_FOUND));

        friendship.setStatus(FriendShipStatus.BLOCKED);
        friendshipRepository.save(friendship);

        redisTemplate.opsForSet().remove(
                RedisPrefixKeyConstant.FRIENDS + friendship.getInviterId(),
                friendship.getReceiverId()
        );
        redisTemplate.opsForSet().remove(
                RedisPrefixKeyConstant.FRIENDS + friendship.getReceiverId(),
                friendship.getInviterId()
        );
    }


    public List<UserResponse> getFriends() {
        String me = userService.getCurrentUser().getId();

        Set<String> friendIds = getFriendIdsFromCache(me);
        if (friendIds == null) {
            friendIds = loadFriendIdsFromDB(me);
            cacheFriendIds(me, friendIds);
        }

        return userMapper.toUserResponseList(
                userRepository.findAllById(friendIds)
        );
    }


    public List<UserResponse> getOnlineFriends() {
        String me = userService.getCurrentUser().getId();
        Set<String> friendIds = getFriendIdsFromCache(me);

        if (friendIds == null) {
            friendIds = loadFriendIdsFromDB(me);
        }

        List<String> onlineIds = friendIds.stream()
                .filter(id -> Boolean.TRUE.equals(
                        redisTemplate.opsForValue().get(RedisPrefixKeyConstant.ONLINE + id)
                ))
                .toList();

        return userMapper.toUserResponseList(
                userRepository.findAllById(onlineIds)
        );
    }


    private Set<String> getFriendIdsFromCache(String userId) {
        Set<Object> cached = redisTemplate.opsForSet()
                .members(RedisPrefixKeyConstant.FRIENDS + userId);

        if (cached == null || cached.isEmpty()) return null;

        return cached.stream()
                .map(String::valueOf)
                .collect(Collectors.toSet());
    }

    private Set<String> loadFriendIdsFromDB(String userId) {
        return friendshipRepository
                .findByInviterOrReceiverAndStatus(userId, FriendShipStatus.ACCEPTED)
                .stream()
                .map(f -> f.getInviterId().equals(userId)
                        ? f.getReceiverId()
                        : f.getInviterId())
                .collect(Collectors.toSet());
    }

    private void cacheFriendIds(String userId, Set<String> friendIds) {
        if (friendIds == null || friendIds.isEmpty()) return;

        redisTemplate.opsForSet().add(
                RedisPrefixKeyConstant.FRIENDS + userId,
                friendIds.toArray()
        );
    }

    public List<UserResponse> getFriendsWithBirthdayToday() {
        String me = userService.getCurrentUser().getId();
        LocalDate today = LocalDate.now();

        Set<String> friendIds = getFriendIdsFromCache(me);
        if (friendIds == null) {
            friendIds = loadFriendIdsFromDB(me);
            cacheFriendIds(me, friendIds);
        }
        List<User> friends = userRepository.findAllById(friendIds);
        List<User> birthdayFriends = friends.stream()
                .filter(user -> user.getDateOfBirth() != null)
                .filter(user ->
                        user.getDateOfBirth().getMonthValue() == today.getMonthValue() &&
                                user.getDateOfBirth().getDayOfMonth() == today.getDayOfMonth()
                )
                .toList();

        return userMapper.toUserResponseList(birthdayFriends);
    }


}
