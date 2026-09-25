# CRS deployment and verification

## Run with Docker Compose

Create a `.env` file at the repository root:

```dotenv
MYSQL_ROOT_PASSWORD=change-me
JWT_SECRET=CRS-Microservices-Secret-Key-Nam-3-Hoc-Ky-2026-Doi-Trong-Thuc-Te
INTERNAL_API_KEY=change-internal-key
```

Start the stack:

```bash
docker compose up --build
```

The frontend is available at `http://localhost:3000` and the gateway at `http://localhost:8080`.
Containers communicate with DNS service names (`mysql-course`, `course-service`, etc.), never with `localhost`.

## E2E smoke test

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"student1","password":"student123"}' | jq -r .token)

curl -s 'http://localhost:8080/api/courses?page=0&size=10'

curl -s -X POST http://localhost:8080/api/registrations \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"courseId":1}'

curl -s http://localhost:8080/api/registrations/my \
  -H "Authorization: Bearer $TOKEN"

curl -i -X DELETE http://localhost:8080/api/registrations/1 \
  -H "Authorization: Bearer $TOKEN"
```

After registration, query the course again and verify `soChoConLai` decreased by one. After cancellation it must increase by one.

## Resilience test

Stop only course-service:

```bash
docker compose stop course-service
curl -i -X POST http://localhost:8080/api/registrations \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"courseId":1}'
```

`CourseClient` converts `ResourceAccessException` into `IllegalStateException`; the registration exception handler returns HTTP 409 with the connection message. The frontend reads `response.data.message` and displays an error Toast.

## Security matrix

| Case | Expected |
|---|---:|
| No token `POST /api/registrations` | 401 |
| STUDENT `POST /api/courses` | 403 |
| ADMIN `POST /api/courses` | 201 |
| Modified JWT signature | 401 |
| Internal endpoint without `X-Internal-API-Key` | 401/403 |
| Internal endpoint with valid key | allowed only from service integration |
| Gateway route `/api/internal/**` | not exposed |

The gateway exposes only auth, public course reads, and registrations. It does not proxy `/api/internal/**`; internal calls use the Docker network directly and require the API key.

## Important limitation

A dedicated partner route with `X-API-KEY` is not present in the current repository. Add a separate controller/filter and gateway route before claiming the partner API-key cases as passing; do not treat the public student course endpoint as a partner endpoint.
