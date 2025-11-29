package Messenger.demo.config.websocket;

import Messenger.demo.Enum.FriendShipStatus;
import Messenger.demo.constant.RedisPrefixKeyConstant;
import Messenger.demo.dto.even.PresenceEvent;
import Messenger.demo.repository.FriendshipRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.AbstractSubProtocolEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE,makeFinal = true)
public class WebSocketPresenceListener {

    RedisTemplate<String, Object> redisTemplate;
    SimpMessagingTemplate simpMessagingTemplate;
    FriendshipRepository friendshipRepository; // Hoặc conversationRepository

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        String userId = getUserIdFromEvent(event);
        if (userId == null) return;

        redisTemplate.opsForValue().set(RedisPrefixKeyConstant.ONLINE + userId, true);
        List<String> peers = getAllPeers(userId);
        peers.forEach(peerId -> {
            simpMessagingTemplate.convertAndSend(
                    "/topic/presence." + peerId,
                    new PresenceEvent(userId, true, null)
            );
        });
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        String userId = getUserIdFromEvent(event);
        if (userId == null) return;

        redisTemplate.opsForValue().set(RedisPrefixKeyConstant.ONLINE + userId, false);
        LocalDateTime lastSeen = LocalDateTime.now();
        redisTemplate.opsForValue().set(RedisPrefixKeyConstant.LAST_SEEN + userId, lastSeen);

        List<String> peers = getAllPeers(userId);
        peers.forEach(peerId -> {
            simpMessagingTemplate.convertAndSend(
                    "/topic/presence." + peerId,
                    new PresenceEvent(userId, false, lastSeen)
            );
        });
    }

    private List<String> getAllPeers(String userId) {
        return friendshipRepository.findByInviterIdOrReceiverIdAndStatus(userId, userId, FriendShipStatus.ACCEPTED)
                .stream()
                .map(f -> f.getInviterId().equals(userId) ? f.getReceiverId() : f.getInviterId())
                .toList();
    }

    private String getUserIdFromEvent(AbstractSubProtocolEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        return accessor.getUser() != null ? accessor.getUser().getName() : null;
    }
}
