package vn.edu.crs.authservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.crs.authservice.dto.ApiKeyCreateRequestDTO;
import vn.edu.crs.authservice.dto.ApiKeyResponseDTO;
import vn.edu.crs.authservice.entity.ApiKey;
import vn.edu.crs.authservice.repository.ApiKeyRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApiKeyService {
    private static final String ACTIVE = "ACTIVE";
    private static final String REVOKED = "REVOKED";
    private final ApiKeyRepository repository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public ApiKeyResponseDTO create(ApiKeyCreateRequestDTO request) {
        if (request.validDays() < 0) throw new IllegalArgumentException("validDays must not be negative");
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        ApiKey key = new ApiKey();
        key.setKeyValue("crs_" + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes));
        key.setOwnerName(request.ownerName().trim());
        key.setScopes(request.scopes().trim());
        key.setStatus(ACTIVE);
        key.setCreatedAt(LocalDateTime.now());
        key.setExpiresAt(request.validDays() == 0 ? null : LocalDateTime.now().plusDays(request.validDays()));
        return ApiKeyResponseDTO.from(repository.save(key));
    }

    public List<ApiKeyResponseDTO> getAll() {
        return repository.findAll().stream().map(ApiKeyResponseDTO::from).toList();
    }

    @Transactional
    public void revoke(Long id) {
        ApiKey key = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("API key not found"));
        key.setStatus(REVOKED);
        repository.save(key);
    }

    @Transactional(readOnly = true)
    public boolean isValidForScope(String keyValue, String requiredScope) {
        return repository.findByKeyValue(keyValue).filter(key -> ACTIVE.equals(key.getStatus()))
                .filter(key -> key.getExpiresAt() == null || key.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(key -> List.of(key.getScopes().split(",")).stream().map(String::trim).anyMatch(requiredScope::equals))
                .orElse(false);
    }
}
