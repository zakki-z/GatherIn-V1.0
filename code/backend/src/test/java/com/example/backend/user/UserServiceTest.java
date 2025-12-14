package com.example.backend.user;

import com.example.backend.user.enums.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setNickName("tester");
        testUser.setFullName("Test User");
    }

    @Test
    void saveUser_ShouldSetStatusToOnlineAndSave() {
        // Arrange
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        // Act
        userService.saveUser(testUser);

        // Assert
        // 1. Verify that repository.save was called
        verify(repository, times(1)).save(userCaptor.capture());

        // 2. Verify that the captured user object has the status set to ONLINE
        User savedUser = userCaptor.getValue();
        assertEquals(Status.ONLINE, savedUser.getStatus());
    }

    @Test
    void disconnect_ShouldSetStatusToOfflineAndSave_WhenUserFound() {
        // Arrange
        User storedUser = new User();
        storedUser.setNickName("tester");
        storedUser.setStatus(Status.ONLINE); // User is currently online

        // Mock repository to return the stored user
        when(repository.findById("tester")).thenReturn(Optional.of(storedUser));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        // Act
        userService.disconnect(testUser);

        // Assert
        // 1. Verify that the user was looked up
        verify(repository, times(1)).findById("tester");

        // 2. Verify that repository.save was called with the updated user
        verify(repository, times(1)).save(userCaptor.capture());

        // 3. Verify that the captured user object's status is OFFLINE
        User savedUser = userCaptor.getValue();
        assertEquals(Status.OFFLINE, savedUser.getStatus());
    }

    @Test
    void disconnect_ShouldDoNothing_WhenUserNotFound() {
        // Arrange
        // Mock repository to return empty optional
        when(repository.findById("tester")).thenReturn(Optional.empty());

        // Act
        userService.disconnect(testUser);

        // Assert
        // 1. Verify that the user was looked up
        verify(repository, times(1)).findById("tester");

        // 2. Verify that repository.save was never called
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void findConnectedUsers_ShouldReturnListOfOnlineUsers() {
        // Arrange
        List<User> onlineUsers = List.of(
                new User() {{ setNickName("user1"); setStatus(Status.ONLINE); }},
                new User() {{ setNickName("user2"); setStatus(Status.ONLINE); }}
        );

        // Mock repository to return the list of online users
        when(repository.findAllByStatus(Status.ONLINE)).thenReturn(onlineUsers);

        // Act
        List<User> result = userService.findConnectedUsers();

        // Assert
        // 1. Verify that findAllByStatus with Status.ONLINE was called
        verify(repository, times(1)).findAllByStatus(Status.ONLINE);

        // 2. Verify the result matches the mocked list
        assertEquals(2, result.size());
        assertEquals(onlineUsers, result);
    }
}