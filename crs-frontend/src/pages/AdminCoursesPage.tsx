import { useCallback, useState } from 'react';
import axios from 'axios';
import { useCourses } from '../api/useCourses';
import { createCourse, deleteCourse, updateCourse } from '../api/courseApi';
import CourseForm from '../components/CourseForm';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import SearchBox from '../components/SearchBox';
import type { ApiErrorResponse } from '../types/apiError';
import type { Course, CourseFormValues } from '../types/course';

const errorMessage = (error: unknown) => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return 'Đã xảy ra lỗi không xác định.';
  const data = error.response?.data;
  return data?.message ?? (data ? Object.values(data).filter(Boolean).join(' ') : 'Không kết nối được tới hệ thống.');
};

function AdminCoursesPage() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Course | null>(null);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { courses, totalPages, state, errorMessage: listError, refetch } = useCourses(keyword, page);
  const handleSearch = useCallback((value: string) => { setKeyword(value); setPage(0); }, []);

  const handleSubmit = async (values: CourseFormValues) => {
    setSubmitting(true); setFormError(''); setNotice('');
    try {
      if (editing) { await updateCourse(editing.id, values); setNotice('Đã cập nhật môn học.'); }
      else { await createCourse(values); setNotice('Đã thêm môn học.'); }
      setEditing(null); await refetch();
    } catch (error: unknown) { setFormError(errorMessage(error)); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Bạn có chắc muốn xoá môn học "${course.tenMonHoc}" không?`)) return;
    setDeletingId(course.id); setNotice('');
    try { await deleteCourse(course.id); setNotice('Đã xoá môn học.'); await refetch(); }
    catch (error: unknown) { setNotice(errorMessage(error)); }
    finally { setDeletingId(null); }
  };

  return <section>
    <h1>Quản trị môn học</h1>
    <CourseForm course={editing} submitting={submitting} serverError={formError} onSubmit={handleSubmit} onCancel={() => { setEditing(null); setFormError(''); }} />
    <SearchBox onSearch={handleSearch} />
    {notice && <p>{notice}</p>}
    <CourseList courses={courses} state={state} errorMessage={listError} onRetry={refetch} onEdit={(course) => { setEditing(course); setFormError(''); }} onDelete={handleDelete} deletingId={deletingId} />
    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
  </section>;
}

export default AdminCoursesPage;
