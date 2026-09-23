package vn.edu.crs.courseservice.course;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "courses", uniqueConstraints = @UniqueConstraint(name = "uk_course_code", columnNames = "code"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(nullable = false, length = 30)
    private String code;

    @NotBlank @Column(nullable = false, length = 200)
    private String name;

    @NotNull @Min(1) @Column(nullable = false)
    private Integer credits;

    @NotNull @Min(1) @Column(nullable = false)
    private Integer capacity;

    @NotNull @Min(0) @Column(nullable = false)
    private Integer availableSeats;

    @Builder.Default
    @Column(nullable = false)
    private Boolean open = true;
}
