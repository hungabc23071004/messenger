package Messenger.demo.mapper;

import Messenger.demo.dto.request.MessageRequest;
import Messenger.demo.dto.response.MessageResponse;
import Messenger.demo.model.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")

public interface MessageMapper {

    Message toMessage(MessageRequest message);

    @Mapping(target = "mediaUrl",
            expression = "java(message.getMediaUrl() != null ? Messenger.demo.constant.MinIOPrefixUrl.MINIO_URL + message.getMediaUrl() : null)")
    MessageResponse toMessageResponse(Message message);
}
