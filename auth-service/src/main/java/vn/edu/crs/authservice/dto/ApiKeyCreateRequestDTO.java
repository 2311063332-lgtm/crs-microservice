package vn.edu.crs.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApiKeyCreateRequestDTO(
        @NotBlank String ownerName,
        @NotBlank String scopes,
        @NotNull Integer validDays
) {
}
