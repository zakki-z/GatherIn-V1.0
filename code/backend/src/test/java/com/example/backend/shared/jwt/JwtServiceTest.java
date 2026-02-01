package com.example.backend.shared.jwt;

import com.example.backend.auth.dto.TokenPair;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails userDetails;
    private Authentication authentication;

    // Test secret key (base64 encoded 256-bit key)
    private final String testSecret = "dGVzdFNlY3JldEtleUZvckpXVFRlc3RpbmdQdXJwb3Nlc09ubHlNdXN0QmUyNTZCaXRz";
    private final long accessTokenExpiration = 900000L; // 15 minutes
    private final long refreshTokenExpiration = 604800000L; // 7 days

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();

        // Set private fields using ReflectionTestUtils
        ReflectionTestUtils.setField(jwtService, "jwtSecret", testSecret);
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", accessTokenExpiration);
        ReflectionTestUtils.setField(jwtService, "refreshExpirationMs", refreshTokenExpiration);

        // Create test user details
        userDetails = User.builder()
                .username("testuser")
                .password("password")
                .authorities(new ArrayList<>())
                .build();

        // Mock Authentication
        authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
    }

    @Test
    void generateTokenPair_ShouldReturnBothTokens() {
        // Act
        TokenPair tokenPair = jwtService.generateTokenPair(authentication);

        // Assert
        assertNotNull(tokenPair);
        assertNotNull(tokenPair.getAccessToken());
        assertNotNull(tokenPair.getRefreshToken());
        assertNotEquals(tokenPair.getAccessToken(), tokenPair.getRefreshToken());
    }

    @Test
    void generateAccessToken_ShouldCreateValidToken() {
        // Act
        String token = jwtService.generateAccessToken(authentication);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());

        // Verify it's a valid JWT
        String username = jwtService.extractUsernameFromToken(token);
        assertEquals("testuser", username);
    }

    @Test
    void generateRefreshToken_ShouldCreateValidTokenWithRefreshType() {
        // Act
        String token = jwtService.generateRefreshToken(authentication);

        // Assert
        assertNotNull(token);
        assertTrue(jwtService.isRefreshToken(token));
    }

    @Test
    void extractUsernameFromToken_ShouldReturnCorrectUsername() {
        // Arrange
        String token = jwtService.generateAccessToken(authentication);

        // Act
        String username = jwtService.extractUsernameFromToken(token);

        // Assert
        assertEquals("testuser", username);
    }

    @Test
    void validateTokenForUser_ShouldReturnTrue_WhenTokenMatchesUser() {
        // Arrange
        String token = jwtService.generateAccessToken(authentication);

        // Act
        boolean isValid = jwtService.validateTokenForUser(token, userDetails);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void validateTokenForUser_ShouldReturnFalse_WhenTokenDoesNotMatchUser() {
        // Arrange
        String token = jwtService.generateAccessToken(authentication);

        UserDetails differentUser = User.builder()
                .username("differentuser")
                .password("password")
                .authorities(new ArrayList<>())
                .build();

        // Act
        boolean isValid = jwtService.validateTokenForUser(token, differentUser);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void isValidToken_ShouldReturnTrue_WhenTokenIsValid() {
        // Arrange
        String token = jwtService.generateAccessToken(authentication);

        // Act
        boolean isValid = jwtService.isValidToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void isValidToken_ShouldReturnFalse_WhenTokenIsInvalid() {
        // Arrange
        String invalidToken = "invalid.token.here";

        // Act & Assert
        assertThrows(RuntimeException.class, () -> jwtService.isValidToken(invalidToken));
    }

    @Test
    void isRefreshToken_ShouldReturnTrue_ForRefreshToken() {
        // Arrange
        String refreshToken = jwtService.generateRefreshToken(authentication);

        // Act
        boolean isRefresh = jwtService.isRefreshToken(refreshToken);

        // Assert
        assertTrue(isRefresh);
    }

    @Test
    void isRefreshToken_ShouldReturnFalse_ForAccessToken() {
        // Arrange
        String accessToken = jwtService.generateAccessToken(authentication);

        // Act
        boolean isRefresh = jwtService.isRefreshToken(accessToken);

        // Assert
        assertFalse(isRefresh);
    }

    @Test
    void extractUsernameFromToken_ShouldReturnNull_WhenTokenIsInvalid() {
        // Arrange
        String invalidToken = "invalid.token.here";

        // Act & Assert
        assertThrows(RuntimeException.class, () -> jwtService.extractUsernameFromToken(invalidToken));
    }
}