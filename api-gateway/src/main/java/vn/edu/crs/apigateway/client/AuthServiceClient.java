package vn.edu.crs.apigateway.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AuthServiceClient {
    private final WebClient.Builder webClientBuilder;
    @Value("${auth-service.base-url:http://localhost:8081}") private String authServiceBaseUrl;
    public Mono<Boolean> isValidForScope(String key, String scope) {
        return webClientBuilder.build().get().uri(authServiceBaseUrl + "/internal/api-keys/validate?key={key}&scope={scope}", key, scope)
                .retrieve().bodyToMono(ValidationResponse.class).map(ValidationResponse::valid).onErrorReturn(false);
    }
    private record ValidationResponse(boolean valid) {}
}
