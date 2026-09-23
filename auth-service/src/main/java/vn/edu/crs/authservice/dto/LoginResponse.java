package vn.edu.crs.authservice.dto;

public record LoginResponse(String token, String username, String role) {
}
