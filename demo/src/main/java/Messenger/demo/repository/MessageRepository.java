package Messenger.demo.repository;

import Messenger.demo.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message > findByConversationIdAndSeenByNotContaining(String conversationId, String userId);

    Page<Message> findByConversationId(String conversationId, Pageable pageable);
}
