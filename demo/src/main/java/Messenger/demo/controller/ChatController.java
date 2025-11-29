package Messenger.demo.controller;

import Messenger.demo.dto.even.TypingEvent;
import Messenger.demo.dto.request.MessageRequest;
import Messenger.demo.dto.response.ApiResponse;
import Messenger.demo.dto.response.MessageResponse;
import Messenger.demo.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

@MessageMapping("/conversation")
public class ChatController {

    MessageService messageService;
    SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/{conversationId}/send")
    public ApiResponse<MessageResponse> sendMessage(
            @DestinationVariable String conversationId,
            @Payload MessageRequest request
    ) {
        return ApiResponse.<MessageResponse>builder()
                .result(messageService.sendMessage(request))
                .message("Message sent successfully")
                .build();
    }


    @MessageMapping("/{conversationId}/seen")
    public void seenMessage(
            @DestinationVariable String conversationId,
            String userId
    ) {
        messageService.markSeen(conversationId, userId);

    }

    @MessageMapping("/{conversationId}/typing")
    public void typing(
            @DestinationVariable String conversationId,
            @Payload  TypingEvent event
    ) {
        messageService.typingStart(conversationId,event);


    }
}
