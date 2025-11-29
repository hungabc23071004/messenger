package Messenger.demo.service;

import Messenger.demo.constant.RedisPrefixKeyConstant;
import Messenger.demo.dto.request.CreateConversationRequest;
import Messenger.demo.dto.response.ConversationResponse;
import Messenger.demo.dto.response.UserShortInfoResponse;
import Messenger.demo.exception.AppException;
import Messenger.demo.exception.ErrorCode;
import Messenger.demo.mapper.ConversationMapper;
import Messenger.demo.model.Conversation;
import Messenger.demo.model.User;
import Messenger.demo.repository.ConversationRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class ConversationService {
        ConversationRepository conversationRepository;
        UserService userService;
        ConversationMapper conversationMapper;
        RedisTemplate <String, Object> redisTemplate;
        SimpMessagingTemplate messagingTemplate;



    public List<ConversationResponse> getConversationsOfUser() {
        User user = userService.getCurrentUser();
        List<Conversation> conversations =
                conversationRepository.findByParticipantsContaining(user.getId());

        return conversations.stream()
                .map(conv -> buildConversationResponse(conv))
                .toList();
    }




    public ConversationResponse createConversation(CreateConversationRequest request) {

        if (!request.isGroup() && request.getParticipants().size() == 2) {

            Optional<Conversation> existing = conversationRepository
                    .findOneToOneConversation(
                            request.getParticipants().get(0),
                            request.getParticipants().get(1)
                    );

            if (existing.isPresent()) {
                return buildConversationResponse(existing.get());
            }
        }

        Conversation conversation = new Conversation();
        conversation.setGroup(request.isGroup());
        conversation.setName(request.getName());
        conversation.setParticipants(request.getParticipants());

        Conversation saved = conversationRepository.save(conversation);


        for (String userId : conversation.getParticipants()) {
            messagingTemplate.convertAndSend(
                    "/topic/conversations/" + userId,
                    conversation
            );
        }

        return buildConversationResponse(saved);
    }


    private ConversationResponse buildConversationResponse(Conversation conversation) {
        String currentUserId = userService.getCurrentUser().getId();
        boolean isGroup = conversation.isGroup();

        // ----------- Lấy danh sách participant info -----------
        List<UserShortInfoResponse> participants = userService
                .getUserShortInfoByIds(conversation.getParticipants());
        UserShortInfoResponse partner = null;
        if (!isGroup) {
            partner = participants.stream()
                    .filter(p -> !p.getId().equals(currentUserId))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.PARTNER_NOT_FOUND) );
        }



        ConversationResponse conversationResponse= conversationMapper.toConversationResponse(conversation);
        conversationResponse.setParticipants(participants);

        Object value = redisTemplate.opsForValue().get(
                RedisPrefixKeyConstant.UNREAD_MESSAGE_COUNT +
                        conversation.getId() + "_" + currentUserId
        );

        int unreadCount = value instanceof Number ? ((Number) value).intValue() : 0;
        conversationResponse.setUnreadCount(unreadCount);
        if(!isGroup){
            conversationResponse.setPartner(partner);
        }
        return conversationResponse;
    }


    public ConversationResponse getConversationById(String conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        return buildConversationResponse(conversation);
    }
}
