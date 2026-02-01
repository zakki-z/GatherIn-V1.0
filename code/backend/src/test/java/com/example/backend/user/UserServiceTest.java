package com.example.backend.user;

import com.example.backend.user.enums.Role;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id("user123")
                .username("johndoe")
                .fullName("John Doe")
                .email("john@example.com")
                .password("password")
                .role(Role.ROLE_USER)
                .status(Status.ONLINE)
                .build();
    }

    @Test
    void saveUser_ShouldCreateNewUser_WhenUserDoesNotExist() {
        // Arrange
        when(repository.findByUsername("johndoe")).thenReturn(Optional.empty());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        // Act
        userService.saveUser(user);

        // Assert
        verify(repository, times(1)).findByUsername("johndoe");
        verify(repository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("johndoe", savedUser.getUsername());
        assertEquals("John Doe", savedUser.getFullName());
        assertEquals(Status.ONLINE, savedUser.getStatus());
    }

    @Test
    void saveUser_ShouldUpdateExistingUser_WhenUserExists() {
        // Arrange
        User existingUser = User.builder()
                .id("user123")
                .username("johndoe")
                .fullName("Old Name")
                .status(Status.OFFLINE)
                .build();

        when(repository.findByUsername("johndoe")).thenReturn(Optional.of(existingUser));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        // Act
        userService.saveUser(user);

        // Assert
        verify(repository, times(1)).findByUsername("johndoe");
        verify(repository, times(1)).save(userCaptor.capture());

        User updatedUser = userCaptor.getValue();
        assertEquals("user123", updatedUser.getId()); // Same ID
        assertEquals("John Doe", updatedUser.getFullName()); // Updated name
        assertEquals(Status.ONLINE, updatedUser.getStatus()); // Updated status
    }

    @Test
    void disconnect_ShouldSetUserStatusToOffline_WhenUserExists() {
        // Arrange
        User onlineUser = User.builder()
                .id("user123")
                .username("johndoe")
                .status(Status.ONLINE)
                .build();

        when(repository.findById("user123")).thenReturn(Optional.of(onlineUser));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        // Act
        userService.disconnect(user);

        // Assert
        verify(repository, times(1)).findById("user123");
        verify(repository, times(1)).save(userCaptor.capture());

        User disconnectedUser = userCaptor.getValue();
        assertEquals(Status.OFFLINE, disconnectedUser.getStatus());
    }

    @Test
    void disconnect_ShouldDoNothing_WhenUserNotFound() {
        // Arrange
        when(repository.findById("user123")).thenReturn(Optional.empty());

        // Act
        userService.disconnect(user);

        // Assert
        verify(repository, times(1)).findById("user123");
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void findConnectedUsers_ShouldReturnOnlineUsers() {
        // Arrange
        List<User> onlineUsers = List.of(
                User.builder().username("user1").status(Status.ONLINE).build(),
                User.builder().username("user2").status(Status.ONLINE).build()
        );

        when(repository.findAllByStatus(Status.ONLINE)).thenReturn(onlineUsers);

        // Act
        List<User> result = userService.findConnectedUsers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("user1", result.get(0).getUsername());
        assertEquals("user2", result.get(1).getUsername());

        verify(repository, times(1)).findAllByStatus(Status.ONLINE);
    }

    @Test
    void findConnectedUsers_ShouldReturnEmptyList_WhenNoUsersOnline() {
        // Arrange
        when(repository.findAllByStatus(Status.ONLINE)).thenReturn(List.of());

        // Act
        List<User> result = userService.findConnectedUsers();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(repository, times(1)).findAllByStatus(Status.ONLINE);
    }
}