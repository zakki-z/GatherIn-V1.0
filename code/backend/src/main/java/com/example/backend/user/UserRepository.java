package com.example.backend.user;

import com.example.backend.user.enums.Status;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    List<User> findAllByStatus(Status status);
    Boolean existsByUsername(String username);
}
