package vn.edu.crs.courseservice.course;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CourseController {
    private final CourseService service;

    @GetMapping("/api/courses")
    public List<Course> findAll() { return service.findAll(); }

    @GetMapping("/api/courses/{id}")
    public Course findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping("/api/courses")
    @ResponseStatus(HttpStatus.CREATED)
    public Course create(@Valid @RequestBody CourseRequest request) { return service.create(request); }

    @PutMapping("/api/courses/{id}")
    public Course update(@PathVariable Long id, @Valid @RequestBody CourseRequest request) { return service.update(id, request); }

    @DeleteMapping("/api/courses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @PatchMapping("/internal/courses/{id}/reserve-seat")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reserveSeat(@PathVariable Long id) { service.reserveSeat(id); }

    @PatchMapping("/internal/courses/{id}/release-seat")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void releaseSeat(@PathVariable Long id) { service.releaseSeat(id); }
}
