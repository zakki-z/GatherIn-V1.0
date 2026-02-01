package com.example.backend.user;

import com.example.backend.user.enums.Role;
import com.example.backend.user.enums.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id("user123")
                .username("johndoe")
                .fullName("John Doe")
                .status(Status.ONLINE)
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    void addUser_ShouldSaveUserAndReturnIt() {
        // Arrange
        doNothing().when(userService).saveUser(user);

        // Act
        User result = userController.addUser(user);

        // Assert
        assertNotNull(result);
        assertEquals("johndoe", result.getUsername());
        assertEquals("John Doe", result.getFullName());

        verify(userService, times(1)).saveUser(user);
    }

    @Test
    void disconnectUser_ShouldDisconnectUserAndReturnIt() {
        // Arrange
        doNothing().when(userService).disconnect(user);

        // Act
        User result = userController.disconnectUser(user);

        // Assert
        assertNotNull(result);
        assertEquals("johndoe", result.getUsername());

        verify(userService, times(1)).disconnect(user);
    }

    @Test
    void findConnectedUsers_ShouldReturnListOfOnlineUsers() {
        // Arrange
        List<User> onlineUsers = List.of(
                User.builder().username("user1").status(Status.ONLINE).build(),
                User.builder().username("user2").status(Status.ONLINE).build()
        );

        when(userService.findConnectedUsers()).thenReturn(onlineUsers);

        // Act
        ResponseEntity<List<User>> response = userController.findConnectedUsers();

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.hasBody());

        List<User> users = response.getBody();
        assertNotNull(users);
        assertEquals(2, users.size());
        assertEquals("user1", users.get(0).getUsername());
        assertEquals("user2", users.get(1).getUsername());

        verify(userService, times(1)).findConnectedUsers();
    }

    @Test
    void findConnectedUsers_ShouldReturnEmptyList_WhenNoUsersOnline() {
        // Arrange
        when(userService.findConnectedUsers()).thenReturn(List.of());

        // Act
        ResponseEntity<List<User>> response = userController.findConnectedUsers();

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.hasBody());

        List<User> users = response.getBody();
        assertNotNull(users);
        assertTrue(users.isEmpty());

        verify(userService, times(1)).findConnectedUsers();
    }
}