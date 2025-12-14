package com.example.backend.user;

import com.example.backend.user.enums.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setNickName("tester");
        testUser.setFullName("Test User");
    }

    // ------------------------------------------
    // WebSocket / MessageMapping Tests
    // ------------------------------------------

    @Test
    void addUser_ShouldCallUserServiceSaveUserAndReturnUser() {
        // Act
        User returnedUser = userController.addUser(testUser);

        // Assert
        // Verify that userService.saveUser was called
        verify(userService, times(1)).saveUser(testUser);

        // Verify the method returns the passed user
        assertEquals(testUser, returnedUser);
    }

    @Test
    void disconnectUser_ShouldCallUserServiceDisconnectAndReturnUser() {
        // Act
        User returnedUser = userController.disconnectUser(testUser);

        // Assert
        // Verify that userService.disconnect was called
        verify(userService, times(1)).disconnect(testUser);

        // Verify the method returns the passed user
        assertEquals(testUser, returnedUser);
    }

    // ------------------------------------------
    // REST / GetMapping Tests
    // ------------------------------------------

    @Test
    void findConnectedUsers_ShouldCallUserServiceAndReturnOkResponse() {
        // Arrange
        List<User> onlineUsers = List.of(
                new User() {{ setNickName("user1"); setStatus(Status.ONLINE); }}
        );
        // Mock the service call
        when(userService.findConnectedUsers()).thenReturn(onlineUsers);

        // Act
        ResponseEntity<List<User>> responseEntity = userController.findConnectedUsers();

        // Assert
        // Verify that userService.findConnectedUsers was called
        verify(userService, times(1)).findConnectedUsers();

        // Verify the HTTP status code is OK (200)
        assertEquals(200, responseEntity.getStatusCodeValue());

        // Verify the body contains the list of users
        assertEquals(onlineUsers, responseEntity.getBody());
    }
}