import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getCourses } from '../api/courseApi';
import { registerCourse } from '../api/registrationApi';
import CourseList from '../components/CourseList';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import type { Course } from '../types/course';

interface ApiError { message?: string; }

export default function RegisterCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const refetch = useCallback(async () => {
    const response = await getCourses();
    setCourses(response.data.content);
  }, []);

  useEffect(() => {
    refetch().catch(() => showToast('Không tải được danh sách môn học', 'error')).finally(() => setLoading(false));
  }, [refetch, showToast]);

  const handleRegister = async (course: Course) => {
    setRegisteringId(course.id);
    try {
      await registerCourse({ courseId: course.id });
      showToast(`Đăng ký môn ${course.tenMonHoc} thành công`, 'success');
      await refetch();
    } catch (error: unknown) {
      const message = axios.isAxiosError<ApiError>(error) ? error.response?.data?.message : undefined;
      showToast(message ?? 'Đăng ký môn học thất bại', 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) return <main className="page-shell"><section className="card"><p>Đang tải danh sách môn học...</p></section></main>;

  return <main className="page-shell"><section className="card"><h1>Đăng ký học phần</h1><CourseList courses={courses} onRegister={handleRegister} registeringId={registeringId} /></section>{toast && <Toast {...toast} onClose={clearToast} />}</main>;
}
