package Messenger.demo.repository;

import Messenger.demo.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByParticipantsContaining(String userId);

    @Query("{ 'participants': { $all: [?0, ?1] }, 'group': false }")
    Optional<Conversation> findOneToOneConversation(String s, String s1);
}
