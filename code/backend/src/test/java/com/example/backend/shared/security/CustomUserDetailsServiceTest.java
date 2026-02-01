package com.example.backend.shared.security;

import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import com.example.backend.user.enums.Role;
import com.example.backend.user.enums.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id("user123")
                .username("johndoe")
                .fullName("John Doe")
                .email("john@example.com")
                .password("encodedPassword")
                .role(Role.ROLE_USER)
                .status(Status.OFFLINE)
                .build();
    }

    @Test
    void loadUserByUsername_ShouldReturnUserDetails_WhenUserExists() {
        // Arrange
        when(userRepository.findByUsername("johndoe")).thenReturn(Optional.of(user));

        // Act
        UserDetails userDetails = customUserDetailsService.loadUserByUsername("johndoe");

        // Assert
        assertNotNull(userDetails);
        assertEquals("johndoe", userDetails.getUsername());
        assertEquals("encodedPassword", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));

        verify(userRepository, times(1)).findByUsername("johndoe");
    }

    @Test
    void loadUserByUsername_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername("nonexistent")
        );

        assertTrue(exception.getMessage().contains("User not found with username"));
        assertTrue(exception.getMessage().contains("nonexistent"));

        verify(userRepository, times(1)).findByUsername("nonexistent");
    }

    @Test
    void loadUserByUsername_ShouldReturnUser_WithAdminRole() {
        // Arrange
        User adminUser = User.builder()
                .id("admin123")
                .username("admin")
                .password("adminPassword")
                .role(Role.ROLE_ADMIN)
                .build();

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));

        // Act
        UserDetails userDetails = customUserDetailsService.loadUserByUsername("admin");

        // Assert
        assertNotNull(userDetails);
        assertEquals("admin", userDetails.getUsername());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));

        verify(userRepository, times(1)).findByUsername("admin");
    }
}