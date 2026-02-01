package com.example.backend.auth;

import com.example.backend.auth.dto.LoginRequest;
import com.example.backend.auth.dto.RefreshTokenRequest;
import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.auth.dto.TokenPair;
import com.example.backend.shared.exceptions.UserExistsException;
import com.example.backend.shared.exceptions.UserNotFoundException;
import com.example.backend.shared.jwt.JwtService;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import com.example.backend.user.enums.Role;
import com.example.backend.user.enums.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;

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

        user = User.builder()
                .id("user123")
                .fullName("John Doe")
                .username("johndoe")
                .email("john@example.com")
                .password("encodedPassword")
                .role(Role.ROLE_USER)
                .status(Status.OFFLINE)
                .build();
    }

    @Test
    void registerUser_ShouldSaveUser_WhenUsernameDoesNotExist() {
        // Arrange
        when(userRepository.existsByUsername("johndoe")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        // Act
        authService.registerUser(registerRequest);

        // Assert
        verify(userRepository, times(1)).existsByUsername("johndoe");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("John Doe", savedUser.getFullName());
        assertEquals("johndoe", savedUser.getUsername());
        assertEquals("john@example.com", savedUser.getEmail());
        assertEquals("encodedPassword", savedUser.getPassword());
        assertEquals(Role.ROLE_USER, savedUser.getRole());
        assertEquals(Status.OFFLINE, savedUser.getStatus());
    }

    @Test
    void registerUser_ShouldThrowException_WhenUsernameExists() {
        // Arrange
        when(userRepository.existsByUsername("johndoe")).thenReturn(true);

        // Act & Assert
        assertThrows(UserExistsException.class, () -> authService.registerUser(registerRequest));

        verify(userRepository, times(1)).existsByUsername("johndoe");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_ShouldReturnTokenPair_WhenCredentialsAreValid() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        TokenPair expectedTokenPair = new TokenPair("accessToken", "refreshToken");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtService.generateTokenPair(authentication)).thenReturn(expectedTokenPair);

        // Act
        TokenPair result = authService.login(loginRequest);

        // Assert
        assertNotNull(result);
        assertEquals("accessToken", result.getAccessToken());
        assertEquals("refreshToken", result.getRefreshToken());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(1)).generateTokenPair(authentication);
    }

    @Test
    void refreshToken_ShouldReturnNewTokenPair_WhenRefreshTokenIsValid() {
        // Arrange
        String refreshToken = "validRefreshToken";
        RefreshTokenRequest request = new RefreshTokenRequest(refreshToken);
        Authentication authentication = mock(Authentication.class);

        when(jwtService.isRefreshToken(refreshToken)).thenReturn(true);
        when(jwtService.extractUsernameFromToken(refreshToken)).thenReturn("johndoe");
        when(userDetailsService.loadUserByUsername("johndoe")).thenReturn(user);
        when(jwtService.generateAccessToken(any(Authentication.class))).thenReturn("newAccessToken");

        // Act
        TokenPair result = authService.refreshToken(request);

        // Assert
        assertNotNull(result);
        assertEquals("newAccessToken", result.getAccessToken());
        assertEquals(refreshToken, result.getRefreshToken());

        verify(jwtService, times(1)).isRefreshToken(refreshToken);
        verify(jwtService, times(1)).extractUsernameFromToken(refreshToken);
        verify(userDetailsService, times(1)).loadUserByUsername("johndoe");
        verify(jwtService, times(1)).generateAccessToken(any(Authentication.class));
    }

    @Test
    void refreshToken_ShouldThrowException_WhenTokenIsNotRefreshToken() {
        // Arrange
        String accessToken = "notARefreshToken";
        RefreshTokenRequest request = new RefreshTokenRequest(accessToken);

        when(jwtService.isRefreshToken(accessToken)).thenReturn(false);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> authService.refreshToken(request));

        verify(jwtService, times(1)).isRefreshToken(accessToken);
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void refreshToken_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        String refreshToken = "validRefreshToken";
        RefreshTokenRequest request = new RefreshTokenRequest(refreshToken);

        when(jwtService.isRefreshToken(refreshToken)).thenReturn(true);
        when(jwtService.extractUsernameFromToken(refreshToken)).thenReturn("johndoe");
        when(userDetailsService.loadUserByUsername("johndoe")).thenReturn(null);

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> authService.refreshToken(request));

        verify(jwtService, times(1)).isRefreshToken(refreshToken);
        verify(jwtService, times(1)).extractUsernameFromToken(refreshToken);
        verify(userDetailsService, times(1)).loadUserByUsername("johndoe");
    }
}