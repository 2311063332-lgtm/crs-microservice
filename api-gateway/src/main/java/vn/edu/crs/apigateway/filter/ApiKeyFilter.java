package vn.edu.crs.apigateway.filter;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import vn.edu.crs.apigateway.cache.ApiKeyValidationCache;
import vn.edu.crs.apigateway.client.AuthServiceClient;

@Component
@RequiredArgsConstructor
public class ApiKeyFilter implements GlobalFilter, Ordered {
    private final ApiKeyValidationCache cache;
    private final AuthServiceClient authServiceClient;
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (!exchange.getRequest().getPath().value().startsWith("/api/public/courses")) return chain.filter(exchange);
        String key = exchange.getRequest().getHeaders().getFirst("X-API-KEY");
        if (key == null || key.isBlank()) return forbidden(exchange);
        String cacheKey = key + ":courses:read";
        Boolean cached = cache.get(cacheKey);
        if (cached != null) return cached ? chain.filter(exchange) : forbidden(exchange);
        return authServiceClient.isValidForScope(key, "courses:read").flatMap(valid -> { cache.put(cacheKey, valid); return valid ? chain.filter(exchange) : forbidden(exchange); });
    }
    private Mono<Void> forbidden(ServerWebExchange exchange) { exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN); return exchange.getResponse().setComplete(); }
    public int getOrder() { return -100; }
}
