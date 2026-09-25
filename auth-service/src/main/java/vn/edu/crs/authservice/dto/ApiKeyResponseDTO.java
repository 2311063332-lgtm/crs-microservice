package vn.edu.crs.authservice.dto;

import vn.edu.crs.authservice.entity.ApiKey;

import java.time.LocalDateTime;

public record ApiKeyResponseDTO(
        Long id,
        String keyValue,
        String ownerName,
        String scopes,
        String status,
        LocalDateTime expiresAt,
        LocalDateTime createdAt
) {
    public static ApiKeyResponseDTO from(ApiKey key) {
        return new ApiKeyResponseDTO(key.getId(), key.getKeyValue(), key.getOwnerName(), key.getScopes(), key.getStatus(), key.getExpiresAt(), key.getCreatedAt());
    }
}
