# Thiết kế biên giới Service và Data Ownership

## 1. Danh sách service

| Service | Trách nhiệm | Port | Database sở hữu |
|---|---|---:|---|
| `api-gateway` | Điểm vào duy nhất từ frontend, định tuyến và áp dụng cross-cutting concerns | 8080 | Không sở hữu nghiệp vụ |
| `auth-service` | Người dùng, xác thực, phân quyền và phát hành token | 8081 | `auth_db` |
| `course-service` | Quản lý học phần, sĩ số và trạng thái mở/đóng học phần | 8082 | `course_db` |
| `registration-service` | Đăng ký/hủy đăng ký và lịch sử đăng ký của sinh viên | 8083 | `registration_db` |

## 2. Nguyên tắc Data Ownership

1. Mỗi service sở hữu một database riêng.
2. Chỉ service sở hữu được phép tạo, sửa, xóa và truy vấn các bảng trong database đó.
3. Không truy cập trực tiếp database của service khác.
4. Giao tiếp liên service chỉ thông qua REST API (sau này có thể bổ sung message broker).
5. `registration-service` chỉ lưu `courseId` kiểu `Long`; không tạo bảng `Course` và không tạo foreign key vật lý sang `course_db`.
6. Việc kiểm tra học phần, giữ chỗ và hoàn trả chỗ được thực hiện qua API của `course-service`.
7. ID giữa các service là dữ liệu tham chiếu, không phải quan hệ JPA liên service.

## 3. Biên giới dữ liệu chính

| Dữ liệu | Service sở hữu | Service khác được phép làm gì? |
|---|---|---|
| Người dùng, role, mật khẩu đã mã hóa | `auth-service` | Xác thực qua API |
| Course, capacity, availableSeats | `course-service` | Đọc/giữ chỗ/hoàn chỗ qua API |
| Registration, studentId, courseId | `registration-service` | Gọi API course để kiểm tra và cập nhật sĩ số |

## 4. Định tuyến Gateway dự kiến

| Method | Public path | Service đích |
|---|---|---|
| `POST` | `/api/auth/**` | `auth-service:8081` |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/courses/**` | `course-service:8082` |
| `GET`, `POST`, `DELETE` | `/api/registrations/**` | `registration-service:8083` |

Các endpoint bắt đầu bằng `/internal/**` chỉ dành cho giao tiếp service-to-service, không công khai trực tiếp cho frontend qua Gateway. Ở các buổi sau cần bổ sung cơ chế xác thực service-to-service.

## 5. Luồng đăng ký dự kiến

1. Client gọi `registration-service` để đăng ký.
2. `registration-service` gọi `PATCH /internal/courses/{id}/reserve-seat` của `course-service`.
3. Chỉ khi giữ chỗ thành công, registration mới được tạo.
4. Khi hủy đăng ký, `registration-service` gọi `PATCH /internal/courses/{id}/release-seat`.
5. Nếu bước sau thất bại, cần thiết kế retry/compensation hoặc Saga ở các buổi tiếp theo.
