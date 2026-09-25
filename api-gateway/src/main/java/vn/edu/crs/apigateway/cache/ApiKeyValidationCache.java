package vn.edu.crs.apigateway.cache;

import org.springframework.stereotype.Component;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ApiKeyValidationCache {
    private record Entry(boolean valid, Instant expiresAt) {}
    private final ConcurrentHashMap<String, Entry> values = new ConcurrentHashMap<>();
    private final Duration ttl = Duration.ofSeconds(30);
    public Boolean get(String cacheKey) { Entry entry = values.get(cacheKey); if (entry == null || entry.expiresAt().isBefore(Instant.now())) { values.remove(cacheKey); return null; } return entry.valid(); }
    public void put(String cacheKey, boolean valid) { values.put(cacheKey, new Entry(valid, Instant.now().plus(ttl))); }
    public void invalidate(String cacheKey) { values.remove(cacheKey); }
}
