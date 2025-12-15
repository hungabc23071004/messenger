package Messenger.demo.mapper;

import Messenger.demo.dto.response.FriendShipResponse;
import Messenger.demo.model.Friendship;
import Messenger.demo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FriendShipMapper {

    @Mapping( target = "inviterName",
            expression = "java(user.getFullName())")
    @Mapping( target = "inviterAvatar",
            expression = "java(user.getAvatarUrl() != null ? Messenger.demo.constant.MinIOPrefixUrl.MINIO_URL + user.getAvatarUrl() : null)")
    @Mapping( target = "id", source = "friendShip.id")
    @Mapping(target = "status", source = "friendShip.status")
    FriendShipResponse toFriendShipResponse(Friendship friendShip, User user);
    List<FriendShipResponse> toFriendShipResponseList(List<Friendship> friendShips);
}
