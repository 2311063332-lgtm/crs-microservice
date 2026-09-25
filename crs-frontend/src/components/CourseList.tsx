import type { Course } from '../types/course';

interface CourseListProps { courses: Course[]; onRegister?: (course: Course) => void; registeringId?: number | null; }

export default function CourseList({ courses, onRegister, registeringId = null }: CourseListProps) {
  return <table className="course-table"><thead><tr><th>Môn học</th><th>Tín chỉ</th><th>Số chỗ</th><th>Thao tác</th></tr></thead><tbody>{courses.map((course) => { const registering = registeringId === course.id; const full = course.soChoConLai === 0; return <tr key={course.id}><td>{course.tenMonHoc}</td><td>{course.soTinChi}</td><td>{course.soChoConLai}/{course.soChoToiDa}</td><td><button type="button" disabled={full || registering || !onRegister} onClick={() => onRegister?.(course)}>{registering ? 'Đang đăng ký...' : full ? 'Hết chỗ' : 'Đăng ký'}</button></td></tr>; })}</tbody></table>;
}
