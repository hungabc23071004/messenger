package Messenger.demo.controller;

import Messenger.demo.dto.request.CreateConversationRequest;
import Messenger.demo.dto.response.ApiResponse;
import Messenger.demo.dto.response.ConversationResponse;
import Messenger.demo.dto.response.MessageResponse;
import Messenger.demo.service.ConversationService;
import Messenger.demo.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversation")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationController {

    ConversationService conversationService;
    MessageService messageService;

    // 🔹 Lấy tất cả conversation mà user đang tham gia
    @GetMapping
    public ApiResponse<List<ConversationResponse>> getUserConversations() {
        return ApiResponse.<List<ConversationResponse>>builder()
                .result(conversationService.getConversationsOfUser())
                .message("User conversations retrieved successfully")
                .build();
    }

    // 🔹 Tạo conversation 1-1 hoặc group
    @PostMapping
    public ApiResponse<ConversationResponse> createConversation(
            @RequestBody CreateConversationRequest request
    ) {
        return ApiResponse.<ConversationResponse>builder()
                .result(conversationService.createConversation(request))
                .message("Conversation created successfully")
                .build();
    }

    @GetMapping("/{conversationId}")
    public ApiResponse<ConversationResponse> getConversationById(
            @PathVariable String conversationId
    ) {
        return ApiResponse.<ConversationResponse>builder()
                .result(conversationService.getConversationById(conversationId))
                .message("Conversation retrieved successfully")
                .build();
    }

    @GetMapping("/{conversationId}/messages")
    public ApiResponse<List<MessageResponse>> getMessages(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.<List<MessageResponse>>builder()
                .result(messageService.getMessages(conversationId, page, size))
                .message("Messages retrieved successfully")
                .build();
    }
}
