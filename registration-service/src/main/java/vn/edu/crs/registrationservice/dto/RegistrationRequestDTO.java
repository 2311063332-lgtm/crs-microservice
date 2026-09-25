package vn.edu.crs.registrationservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationRequestDTO {
    @NotNull(message = "courseId khong duoc de trong")
    private Long courseId;

    private Long studentId;
}
