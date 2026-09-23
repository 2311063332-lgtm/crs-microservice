package vn.edu.crs.courseservice.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);

    boolean existsByCodeIgnoreCase(String code);

    Page<Course> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    @Modifying
    @Query("""
        update Course c
        set c.availableSeats = c.availableSeats - 1
        where c.id = :id
          and c.open = true
          and c.availableSeats > 0
        """)
    int reserveSeat(@Param("id") Long id);

    @Modifying
    @Query("""
        update Course c
        set c.availableSeats = case
            when c.availableSeats < c.capacity then c.availableSeats + 1
            else c.capacity
        end
        where c.id = :id
        """)
    int releaseSeat(@Param("id") Long id);
}
