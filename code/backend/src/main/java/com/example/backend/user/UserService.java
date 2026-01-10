package com.example.backend.user;

import com.example.backend.user.enums.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public void saveUser(User user) {
        // Check if user already exists
        Optional<User> existingUser = repository.findByUsername(user.getUsername());

        if (existingUser.isPresent()) {
            // Update existing user (e.g., update status to ONLINE)
            User existing = existingUser.get();
            existing.setStatus(user.getStatus());
            existing.setFullName(user.getFullName());
            repository.save(existing);
            return;
        }

        // Insert new user
        repository.save(user);
    }

    public void disconnect(User user) {
        var storedUser = repository.findById(user.getId()).orElse(null);
        if (storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            repository.save(storedUser);
        }
    }

    public List<User> findConnectedUsers() {
        return repository.findAllByStatus(Status.ONLINE);
    }
}
