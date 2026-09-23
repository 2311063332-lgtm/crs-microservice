package vn.edu.crs.courseservice.course;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService service;

    @GetMapping("/courses")
    public List<CourseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/courses/{id}")
    public CourseDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping("/courses")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDTO create(@Valid @RequestBody CourseDTO request) {
        return service.create(request);
    }

    @PutMapping("/courses/{id}")
    public CourseDTO update(@PathVariable Long id, @Valid @RequestBody CourseDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/courses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PatchMapping("/internal/courses/{id}/reserve-seat")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reserveSeat(@PathVariable Long id) {
        service.reserveSeat(id);
    }

    @PatchMapping("/internal/courses/{id}/release-seat")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void releaseSeat(@PathVariable Long id) {
        service.releaseSeat(id);
    }
}
