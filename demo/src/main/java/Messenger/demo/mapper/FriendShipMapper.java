package Messenger.demo.mapper;

import Messenger.demo.dto.response.FriendShipResponse;
import Messenger.demo.model.Friendship;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FriendShipMapper {
    FriendShipResponse toFriendShipResponse(Friendship friendShip);
    List<FriendShipResponse> toFriendShipResponseList(List<Friendship> friendShips);
}
