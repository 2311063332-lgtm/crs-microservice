package vn.edu.crs.authservice.dto;

public record LoginResponse(
        String token,
        Long userId,
        String username,
        String role
) {
}
