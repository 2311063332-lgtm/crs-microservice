# CRS Microservices

Hệ thống đăng ký học phần theo kiến trúc microservices.

## Buổi 1: Course Service

- Port: `8082`
- Database: `course_db` (MySQL 8)
- Package: `vn.edu.crs.courseservice`

### Khởi động

1. Tạo database:

```sql
CREATE DATABASE course_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Cập nhật thông tin MySQL trong `course-service/src/main/resources/application.properties` nếu cần.
3. Chạy service:

```bash
cd course-service
./mvnw spring-boot:run
```

Hoặc chạy class `CourseServiceApplication` từ IDE.
