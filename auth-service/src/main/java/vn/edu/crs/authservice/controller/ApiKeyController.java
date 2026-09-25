package vn.edu.crs.authservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.authservice.dto.ApiKeyCreateRequestDTO;
import vn.edu.crs.authservice.dto.ApiKeyResponseDTO;
import vn.edu.crs.authservice.service.ApiKeyService;

import java.util.List;

@RestController
@RequestMapping("/api-keys")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ApiKeyController {
    private final ApiKeyService apiKeyService;

    @GetMapping
    public List<ApiKeyResponseDTO> getAll() { return apiKeyService.getAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiKeyResponseDTO create(@Valid @RequestBody ApiKeyCreateRequestDTO request) { return apiKeyService.create(request); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revoke(@PathVariable Long id) { apiKeyService.revoke(id); }
}
