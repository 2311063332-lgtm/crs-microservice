import { useCallback, useState } from 'react';
import axios from 'axios';
import './index.css';
import { useCourses } from './api/useCourses';
import { createCourse, deleteCourse, updateCourse } from './api/courseApi';
import CourseForm from './components/CourseForm';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import SearchBox from './components/SearchBox';
import type { ApiErrorResponse } from './types/apiError';
import type { Course, CourseFormValues } from './types/course';

const getServerError = (error: unknown): string => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return 'Đã xảy ra lỗi không xác định.';
  const data = error.response?.data;
  if (!data) return 'Không kết nối được tới hệ thống.';
  return data.message ?? Object.values(data).filter(Boolean).join(' ') ?? 'Thao tác thất bại.';
};

function App() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notice, setNotice] = useState('');
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

  const handleSearch = useCallback((newKeyword: string) => { setKeyword(newKeyword); setPage(0); }, []);
  const refresh = async () => { await refetch(); };

  const handleSubmit = async (values: CourseFormValues) => {
    setSubmitting(true); setFormError(''); setNotice('');
    try {
      if (editingCourse) { await updateCourse(editingCourse.id, values); setNotice('Đã cập nhật môn học.'); }
      else { await createCourse(values); setNotice('Đã thêm môn học.'); }
      setEditingCourse(null);
      await refresh();
    } catch (error: unknown) { setFormError(getServerError(error)); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Bạn có chắc muốn xoá môn học "${course.tenMonHoc}" không?`)) return;
    setDeletingId(course.id); setNotice('');
    try {
      await deleteCourse(course.id);
      setNotice('Đã xoá môn học.');
      await refresh();
    } catch (error: unknown) { setNotice(getServerError(error)); }
    finally { setDeletingId(null); }
  };

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>Danh sách môn học</h1>
      <CourseForm course={editingCourse} submitting={submitting} serverError={formError} onSubmit={handleSubmit} onCancel={() => { setEditingCourse(null); setFormError(''); }} />
      <SearchBox onSearch={handleSearch} />
      {notice && <p>{notice}</p>}
      <CourseList courses={courses} state={state} errorMessage={errorMessage} onRetry={refetch} onEdit={(course) => { setEditingCourse(course); setFormError(''); }} onDelete={handleDelete} deletingId={deletingId} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </main>
  );
}

export default App;
