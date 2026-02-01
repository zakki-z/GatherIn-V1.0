package com.example.backend.auth;

import com.example.backend.auth.dto.LoginRequest;
import com.example.backend.auth.dto.RefreshTokenRequest;
import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.auth.dto.TokenPair;
import com.example.backend.user.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private RefreshTokenRequest refreshTokenRequest;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .fullName("John Doe")
                .username("johndoe")
                .email("john@example.com")
                .password("password123")
                .role(Role.ROLE_USER)
                .build();

        loginRequest = new LoginRequest("johndoe", "password123");
        refreshTokenRequest = new RefreshTokenRequest("validRefreshToken");
    }

    @Test
    void registerUser_ShouldReturnOkResponse_WhenRegistrationSuccessful() {
        // Arrange
        doNothing().when(authService).registerUser(registerRequest);

        // Act
        ResponseEntity<?> response = authController.registerUser(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("User registered successfully", response.getBody());

        verify(authService, times(1)).registerUser(registerRequest);
    }

    @Test
    void login_ShouldReturnTokenPair_WhenLoginSuccessful() {
        // Arrange
        TokenPair expectedTokenPair = new TokenPair("accessToken", "refreshToken");
        when(authService.login(loginRequest)).thenReturn(expectedTokenPair);

        // Act
        ResponseEntity<?> response = authController.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof TokenPair);

        TokenPair tokenPair = (TokenPair) response.getBody();
        assertEquals("accessToken", tokenPair.getAccessToken());
        assertEquals("refreshToken", tokenPair.getRefreshToken());

        verify(authService, times(1)).login(loginRequest);
    }

    @Test
    void refreshToken_ShouldReturnNewTokenPair_WhenRefreshSuccessful() {
        // Arrange
        TokenPair expectedTokenPair = new TokenPair("newAccessToken", "validRefreshToken");
        when(authService.refreshToken(refreshTokenRequest)).thenReturn(expectedTokenPair);

        // Act
        ResponseEntity<?> response = authController.refreshToken(refreshTokenRequest);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof TokenPair);

        TokenPair tokenPair = (TokenPair) response.getBody();
        assertEquals("newAccessToken", tokenPair.getAccessToken());
        assertEquals("validRefreshToken", tokenPair.getRefreshToken());

        verify(authService, times(1)).refreshToken(refreshTokenRequest);
    }
}