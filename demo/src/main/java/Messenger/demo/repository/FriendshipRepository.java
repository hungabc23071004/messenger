package Messenger.demo.repository;

import Messenger.demo.model.Friendship;
import Messenger.demo.Enum.FriendShipStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends MongoRepository<Friendship, String> {
    List<Friendship> findByInviterIdOrReceiverIdAndStatus(String inviterId, String receiverId, FriendShipStatus status);
    Optional<Friendship> findByInviterIdAndReceiverId(String inviterId, String receiverId);
    List<Friendship> findByInviterIdAndStatus(String inviterId, FriendShipStatus status);
    List<Friendship> findByReceiverIdAndStatus(String receiverId, FriendShipStatus status);
}
