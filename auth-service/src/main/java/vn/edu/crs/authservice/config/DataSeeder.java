package vn.edu.crs.authservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.edu.crs.authservice.entity.Student;
import vn.edu.crs.authservice.entity.User;
import vn.edu.crs.authservice.repository.StudentRepository;
import vn.edu.crs.authservice.repository.UserRepository;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData() {
        return args -> {
            User admin = userRepository.findByUsername("admin").orElseGet(() -> {
                User user = new User();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("admin123"));
                user.setRole("ADMIN");
                return userRepository.save(user);
            });

            if (userRepository.findByUsername("student").isEmpty()) {
                User studentUser = new User();
                studentUser.setUsername("student");
                studentUser.setPassword(passwordEncoder.encode("student123"));
                studentUser.setRole("STUDENT");
                studentUser = userRepository.save(studentUser);

                Student student = new Student();
                student.setHoTen("Sinh vien mac dinh");
                student.setMssv("SV001");
                student.setUser(studentUser);
                studentRepository.save(student);
            }
        };
    }
}
