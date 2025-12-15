package Messenger.demo.repository;

import Messenger.demo.model.Friendship;
import Messenger.demo.Enum.FriendShipStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends MongoRepository<Friendship, String> {
    @Query("{ $and: [ { $or: [ { 'inviterId': ?0 }, { 'receiverId': ?0 } ] }, { 'status': ?1 } ] }")
    List<Friendship> findByInviterOrReceiverAndStatus(String userId, FriendShipStatus status);
    Optional<Friendship> findByInviterIdAndReceiverId(String inviterId, String receiverId);
    List<Friendship> findByInviterIdAndStatus(String inviterId, FriendShipStatus status);
    Page<Friendship> findByReceiverIdAndStatus(String receiverId, FriendShipStatus status, Pageable pageable);
}
