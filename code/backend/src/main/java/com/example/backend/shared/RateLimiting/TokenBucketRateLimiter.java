package com.example.backend.shared.RateLimiting;

import java.time.Duration;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;

public class TokenBucketRateLimiter {
    private final Bucket bucket;

    public TokenBucketRateLimiter() {
        Bandwidth limit = Bandwidth.classic(10, Refill.intervally(1, Duration.ofSeconds(1)));
        this.bucket = Bucket4j.builder().addLimit(limit).build();
    }

    public boolean allowRequest() {
        return bucket.tryConsume(1);
    }
}
