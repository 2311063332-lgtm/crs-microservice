package vn.edu.crs.courseservice.course;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CourseRequest(
        @NotBlank String code,
        @NotBlank String name,
        @NotNull @Min(1) Integer credits,
        @NotNull @Min(1) Integer capacity,
        @NotNull @Min(0) Integer availableSeats,
        Boolean open) {
}
