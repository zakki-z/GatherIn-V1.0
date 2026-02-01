package com.example.backend.shared.RateLimiting;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenBucketRateLimiterTest {

    private TokenBucketRateLimiter rateLimiter;

    @BeforeEach
    void setUp() {
        rateLimiter = new TokenBucketRateLimiter();
    }

    @Test
    void allowRequest_ShouldReturnTrue_WhenTokensAvailable() {
        // Act
        boolean allowed = rateLimiter.allowRequest();

        // Assert
        assertTrue(allowed, "First request should be allowed");
    }

    @Test
    void allowRequest_ShouldConsumeTokens_WithinLimit() {
        // Act - consume 5 tokens (limit is 10)
        for (int i = 0; i < 5; i++) {
            assertTrue(rateLimiter.allowRequest(), "Request " + (i + 1) + " should be allowed");
        }
    }

    @Test
    void allowRequest_ShouldReturnFalse_WhenLimitExceeded() {
        // Act - consume all 10 tokens
        for (int i = 0; i < 10; i++) {
            rateLimiter.allowRequest();
        }

        // Assert - 11th request should be denied
        boolean eleventhRequest = rateLimiter.allowRequest();
        assertFalse(eleventhRequest, "Request beyond limit should be denied");
    }

    @Test
    void allowRequest_ShouldAllowExactlyTenRequests() {
        // Act & Assert
        int allowedCount = 0;
        for (int i = 0; i < 15; i++) {
            if (rateLimiter.allowRequest()) {
                allowedCount++;
            }
        }

        // Assert - exactly 10 requests should be allowed
        assertEquals(10, allowedCount, "Exactly 10 requests should be allowed");
    }
}