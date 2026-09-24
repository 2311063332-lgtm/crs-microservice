import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
  courses: Course[];
  state: LoadState;
  errorMessage: string;
  onRetry: () => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  deletingId: number | null;
}

function CourseList({ courses, state, errorMessage, onRetry, onEdit, onDelete, deletingId }: CourseListProps) {
  if (state === 'loading') return <p>Đang tải danh sách môn học...</p>;
  if (state === 'error') return <div><p style={{ color: 'red' }}>{errorMessage}</p><button type="button" onClick={onRetry}>Thử lại</button></div>;
  if (state === 'empty') return <p>Không tìm thấy môn học nào phù hợp.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
      <thead><tr><th>Tên môn học</th><th>Số tín chỉ</th><th>Số chỗ còn lại</th><th>Thao tác</th></tr></thead>
      <tbody>{courses.map((course) => (
        <tr key={course.id}>
          <td>{course.tenMonHoc}</td><td>{course.soTinChi}</td>
          <td style={{ color: course.soChoConLai === 0 ? 'red' : undefined }}>{course.soChoConLai}/{course.soChoToiDa}</td>
          <td>
            <button type="button" onClick={() => onEdit(course)}>Sửa</button>{' '}
            <button type="button" onClick={() => onDelete(course)} disabled={deletingId === course.id}>
              {deletingId === course.id ? 'Đang xoá...' : 'Xoá'}
            </button>
          </td>
        </tr>
      ))}</tbody>
    </table>
  );
}

export default CourseList;
