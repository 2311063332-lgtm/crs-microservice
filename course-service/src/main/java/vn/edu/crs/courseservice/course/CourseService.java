package vn.edu.crs.courseservice.course;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository repository;

    public List<CourseDTO> findAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public CourseDTO findById(Long id) {
        return toDto(repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Course not found: " + id)));
    }

    public Page<CourseDTO> search(String keyword, Pageable pageable) {
        Page<Course> page = (keyword == null || keyword.isBlank())
                ? repository.findAll(pageable)
                : repository.findByNameContainingIgnoreCase(keyword.trim(), pageable);

        return page.map(this::toDto);
    }

    public CourseDTO create(CourseDTO dto) {
        String code = normalizeCode(dto.code());
        if (code != null && repository.existsByCodeIgnoreCase(code)) {
            throw new IllegalArgumentException("Course code already exists: " + code);
        }

        Course course = toEntity(dto);
        course.setAvailableSeats(course.getCapacity());
        return toDto(repository.save(course));
    }

    public CourseDTO update(Long id, CourseDTO dto) {
        Course course = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Course not found: " + id));

        String newCode = normalizeCode(dto.code());
        if (newCode != null && !newCode.equalsIgnoreCase(course.getCode())
                && repository.existsByCodeIgnoreCase(newCode)) {
            throw new IllegalArgumentException("Course code already exists: " + newCode);
        }

        course.setCode(newCode);
        course.setName(normalizeName(dto.name()));
        course.setCredits(dto.credits());
        course.setCapacity(dto.capacity());

        if (course.getAvailableSeats() == null) {
            course.setAvailableSeats(dto.capacity());
        } else if (dto.capacity() != null && course.getAvailableSeats() > dto.capacity()) {
            course.setAvailableSeats(dto.capacity());
        }

        course.setOpen(dto.open() == null || dto.open());
        return toDto(repository.save(course));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Course not found: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public void reserveSeat(Long id) {
        if (repository.reserveSeat(id) == 0) {
            throw new IllegalStateException("Course does not exist, is closed, or has no available seats");
        }
    }

    @Transactional
    public void releaseSeat(Long id) {
        if (repository.releaseSeat(id) == 0) {
            throw new EntityNotFoundException("Course not found: " + id);
        }
    }

    private Course toEntity(CourseDTO dto) {
        return Course.builder()
                .id(dto.id())
                .code(normalizeCode(dto.code()))
                .name(normalizeName(dto.name()))
                .credits(dto.credits())
                .capacity(dto.capacity())
                .availableSeats(dto.availableSeats() == null ? dto.capacity() : Math.min(dto.availableSeats(), dto.capacity()))
                .open(dto.open() == null || dto.open())
                .build();
    }

    private CourseDTO toDto(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getCredits(),
                course.getCapacity(),
                course.getAvailableSeats(),
                course.getOpen()
        );
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeName(String value) {
        return value == null ? null : value.trim();
    }
}
