package vn.edu.crs.courseservice.common;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    ResponseEntity<?> notFound(EntityNotFoundException ex) { return response(HttpStatus.NOT_FOUND, ex.getMessage()); }

    @ExceptionHandler(IllegalStateException.class)
    ResponseEntity<?> conflict(IllegalStateException ex) { return response(HttpStatus.CONFLICT, ex.getMessage()); }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> invalid(MethodArgumentNotValidException ex) {
        return response(HttpStatus.BAD_REQUEST, "Request validation failed");
    }

    private ResponseEntity<?> response(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("timestamp", Instant.now(), "status", status.value(), "message", message));
    }
}
