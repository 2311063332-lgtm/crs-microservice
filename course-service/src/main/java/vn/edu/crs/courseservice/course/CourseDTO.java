package vn.edu.crs.courseservice.course;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CourseDTO(
        Long id,
        @NotBlank(message = "Course code is required") String code,
        @NotBlank(message = "Course name is required") String name,
        @NotNull(message = "Credits is required") @Min(value = 1, message = "Credits must be greater than 0") Integer credits,
        @NotNull(message = "Capacity is required") @Min(value = 1, message = "Capacity must be greater than 0") Integer capacity,
        Integer availableSeats,
        Boolean open
) {
}
