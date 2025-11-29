package Messenger.demo.service;

import Messenger.demo.constant.RedisPrefixKeyConstant;
import Messenger.demo.dto.even.SeenEvent;
import Messenger.demo.dto.even.TypingEvent;
import Messenger.demo.dto.request.MessageRequest;
import Messenger.demo.dto.response.MessageResponse;
import Messenger.demo.exception.AppException;
import Messenger.demo.exception.ErrorCode;
import Messenger.demo.mapper.MessageMapper;
import Messenger.demo.model.Conversation;
import Messenger.demo.model.Message;
import Messenger.demo.repository.ConversationRepository;
import Messenger.demo.repository.MessageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class MessageService {

    MessageRepository messageRepository;
    RedisTemplate<String, Object> redisTemplate;
    MessageMapper messageMapper;
    ConversationRepository conversationRepository;
    SimpMessagingTemplate simpMessagingTemplate;

    public MessageResponse sendMessage(MessageRequest request) {
        Message message = messageMapper.toMessage(request);
        messageRepository.save(message);

        List<String> participants = getConversationParticipants(request.getConversationId());
        participants.stream()
                .filter(u -> !u.equals(request.getSenderId()))
                .forEach(u -> {
                    String key = RedisPrefixKeyConstant.UNREAD_MESSAGE_COUNT + request.getConversationId() + "_" + u;
                    redisTemplate.opsForValue().increment(key);
                });
        MessageResponse messageResponse = messageMapper.toMessageResponse(message);
        simpMessagingTemplate.convertAndSend(
                "/topic/conversation." + request.getConversationId() + "/message",
                messageResponse
        );

        return messageResponse;
    }

    public void markSeen(String conversationId, String userId) {
        List<Message> unreadMessages = messageRepository.findByConversationIdAndSeenByNotContaining(
                conversationId, userId);

        unreadMessages.forEach(msg -> {
            msg.getSeenBy().add(userId);
            messageRepository.save(msg);
        });

        redisTemplate.opsForValue().set("UNREAD:" + conversationId + ":" + userId, 0);
        simpMessagingTemplate.convertAndSend(
                "/topic/conversation." + conversationId + "/seen",
                new SeenEvent(conversationId, userId, LocalDateTime.now())
        );
    }

    public void typingStart(String conversationId, TypingEvent event) {
        String key = "TYPING:" + conversationId + ":" + event.getUserId();
        redisTemplate.opsForValue().set(key, true, 4, TimeUnit.SECONDS);
        simpMessagingTemplate.convertAndSend(
                "/topic/conversation." + conversationId + "/typing",
                event
        );
    }

    private List<String> getConversationParticipants(String conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(()-> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));
        return conversation.getParticipants();
    }


    public List<MessageResponse> getMessages(String conversationId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Message> messages = messageRepository.findByConversationId(conversationId, pageable);
        return messages.getContent().stream()
                .map(messageMapper::toMessageResponse)
                .collect(Collectors.toList());
    }
    }
