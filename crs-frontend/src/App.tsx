import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCourses } from './api/courseApi';
import type { Course } from './types/course';
import type { ApiErrorResponse } from './types/apiError';
import './index.css';

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? 'Không kết nối được tới hệ thống. Kiểm tra lại api-gateway đã chạy chưa.';
  }
  return 'Đã xảy ra lỗi không xác định.';
}

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res.data.content))
      .catch((err: unknown) => {
        console.error(err);
        setError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">Course Registration System</p>
        <h1>Kiểm tra kết nối CRS qua Gateway</h1>
        {loading && <p>Đang tải danh sách khóa học...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && courses.length === 0 && <p>Chưa có khóa học nào.</p>}
        {courses.length > 0 && (
          <div className="course-list" aria-label="Danh sách khóa học">
            {courses.map((course) => (
              <article className="course-item" key={course.id}>
                <div>
                  <strong>{course.tenMonHoc}</strong>
                  <span>{course.soTinChi} tín chỉ</span>
                </div>
                <span>{course.soChoConLai}/{course.soChoToiDa} chỗ</span>
              </article>
            ))}
          </div>
        )}
        <details>
          <summary>JSON response</summary>
          <pre>{JSON.stringify(courses, null, 2)}</pre>
        </details>
      </section>
    </main>
  );
}

export default App;
