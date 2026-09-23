package vn.edu.crs.courseservice.course;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository repository;

    public List<Course> findAll() { return repository.findAll(); }
    public Course findById(Long id) { return repository.findById(id).orElseThrow(() -> notFound(id)); }

    public Course create(CourseRequest request) {
        Course course = toEntity(request);
        return repository.save(course);
    }

    public Course update(Long id, CourseRequest request) {
        Course course = findById(id);
        course.setCode(request.code());
        course.setName(request.name());
        course.setCredits(request.credits());
        course.setCapacity(request.capacity());
        course.setAvailableSeats(Math.min(request.availableSeats(), request.capacity()));
        course.setOpen(request.open() == null || request.open());
        return repository.save(course);
    }

    public void delete(Long id) { repository.delete(findById(id)); }

    @Transactional
    public void reserveSeat(Long id) {
        if (repository.reserveSeat(id) == 0) {
            throw new IllegalStateException("Course does not exist, is closed, or has no available seats");
        }
    }

    @Transactional
    public void releaseSeat(Long id) {
        if (repository.releaseSeat(id) == 0) throw notFound(id);
    }

    private Course toEntity(CourseRequest r) {
        return Course.builder().code(r.code()).name(r.name()).credits(r.credits())
                .capacity(r.capacity()).availableSeats(Math.min(r.availableSeats(), r.capacity()))
                .open(r.open() == null || r.open()).build();
    }

    private EntityNotFoundException notFound(Long id) { return new EntityNotFoundException("Course not found: " + id); }
}
