package Messenger.demo.repository;

import Messenger.demo.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsernameAndVerifiedIsTrue(String username);
}
