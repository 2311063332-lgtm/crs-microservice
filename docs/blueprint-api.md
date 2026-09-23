# Blueprint API CRS Microservices

Quy ước chung: JSON, UTF-8; ID kiểu `Long`; lỗi trả về gồm tối thiểu `timestamp`, `status`, `message`, `path`.

## 1. auth-service (`8081`)

| Method | Endpoint | Mục đích |
|---|---|---|
| `POST` | `/api/auth/register` | Tạo tài khoản |
| `POST` | `/api/auth/login` | Đăng nhập và nhận access token |
| `GET` | `/api/auth/me` | Lấy thông tin người dùng hiện tại |
| `GET` | `/api/users/{id}` | Lấy thông tin user nội bộ |

## 2. course-service (`8082`)

### Public API

| Method | Endpoint | Mục đích |
|---|---|---|
| `GET` | `/api/courses` | Danh sách học phần, hỗ trợ `keyword`, `page`, `size` |
| `GET` | `/api/courses/{id}` | Chi tiết học phần |
| `POST` | `/api/courses` | Tạo học phần (admin) |
| `PUT` | `/api/courses/{id}` | Cập nhật học phần (admin) |
| `DELETE` | `/api/courses/{id}` | Xóa học phần (admin) |

Ví dụ tạo/cập nhật:

```json
{
  "code": "INT3306",
  "name": "Công nghệ phần mềm",
  "credits": 3,
  "capacity": 60,
  "availableSeats": 60
}
```

### Internal API

Các API này dành cho `registration-service`, không mở trực tiếp cho frontend:

| Method | Endpoint | Mục đích |
|---|---|---|
| `PATCH` | `/internal/courses/{id}/reserve-seat` | Trừ một chỗ còn lại khi đăng ký |
| `PATCH` | `/internal/courses/{id}/release-seat` | Hoàn trả một chỗ khi hủy đăng ký |

`reserve-seat` phải thất bại nếu course không tồn tại, không mở đăng ký hoặc `availableSeats = 0`. Thao tác phải nguyên tử để tránh overbooking khi có nhiều request đồng thời.

## 3. registration-service (`8083`)

| Method | Endpoint | Mục đích |
|---|---|---|
| `POST` | `/api/registrations` | Đăng ký học phần; body chỉ tham chiếu `courseId` |
| `GET` | `/api/registrations/me` | Danh sách đăng ký của sinh viên hiện tại |
| `GET` | `/api/registrations/{id}` | Chi tiết đăng ký |
| `DELETE` | `/api/registrations/{id}` | Hủy đăng ký và gọi release-seat |
| `GET` | `/api/registrations/check?courseId={id}` | Kiểm tra đã đăng ký chưa |

Ví dụ body đăng ký:

```json
{
  "courseId": 1
}
```

Không tạo foreign key hoặc entity `Course` trong database của registration service.

## 4. api-gateway (`8080`)

| Method | Route | Forward tới |
|---|---|---|
| `ANY` | `/api/auth/**` | `auth-service:8081` |
| `ANY` | `/api/courses/**` | `course-service:8082` |
| `ANY` | `/api/registrations/**` | `registration-service:8083` |

Gateway không forward các route `/internal/**` từ client bên ngoài.
