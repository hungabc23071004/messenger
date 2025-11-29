package Messenger.demo.mapper;

import Messenger.demo.dto.response.ConversationResponse;
import Messenger.demo.model.Conversation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")

public interface ConversationMapper {
    @Mapping(target = "partner", ignore = true)
    @Mapping(target = "unreadCount", ignore = true)
    @Mapping(target = "participants",ignore = true)
    ConversationResponse toConversationResponse(Conversation conversation);
}
