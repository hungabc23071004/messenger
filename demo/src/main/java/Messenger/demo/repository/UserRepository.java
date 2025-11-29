package Messenger.demo.repository;

import Messenger.demo.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUsernameAndVerifiedIsTrue(String username);

    List<User> findByIdIn(List<String> ids);
}
