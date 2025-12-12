package Messenger.demo.repository;

import Messenger.demo.model.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface PostRepository  extends MongoRepository<Post, String> {

    List<Post> findByUserIdInOrderByCreatedAtDesc(List<String> friendIds, Pageable pageable);

    List<Post> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
}
