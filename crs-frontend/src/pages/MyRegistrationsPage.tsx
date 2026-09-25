import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getCourseById } from '../api/courseApi';
import { cancelRegistration, getMyRegistrations } from '../api/registrationApi';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import type { Registration } from '../types/registration';

interface RegistrationView extends Registration { courseName: string; }
interface ApiError { message?: string; }

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationView[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyRegistrations();
      const active = response.data.filter((registration) => registration.trangThai === 'DA_DANG_KY');
      const result = await Promise.all(active.map(async (registration) => {
        try {
          const course = await getCourseById(registration.courseId);
          return { ...registration, courseName: course.data.tenMonHoc };
        } catch {
          return { ...registration, courseName: `Môn học #${registration.courseId} (không tìm thấy thông tin)` };
        }
      }));
      setRegistrations(result);
    } catch (error: unknown) {
      const message = axios.isAxiosError<ApiError>(error) ? error.response?.data?.message : undefined;
      showToast(message ?? 'Không tải được danh sách đăng ký', 'error');
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { void loadData(); }, [loadData]);

  const handleCancel = async (registration: RegistrationView) => {
    if (!window.confirm(`Bạn có chắc muốn huỷ môn "${registration.courseName}" không?`)) return;
    setCancellingId(registration.id);
    try {
      await cancelRegistration(registration.id);
      showToast('Huỷ đăng ký thành công', 'success');
      await loadData();
    } catch (error: unknown) {
      const message = axios.isAxiosError<ApiError>(error) ? error.response?.data?.message : undefined;
      showToast(message ?? 'Huỷ đăng ký thất bại', 'error');
    } finally { setCancellingId(null); }
  };

  return <main className="page-shell"><section className="card"><h1>Môn học đã đăng ký</h1>{loading && <p>Đang tải dữ liệu...</p>}{!loading && registrations.length === 0 && <p>Bạn chưa đăng ký môn học nào.</p>}{!loading && registrations.length > 0 && <table className="course-table"><thead><tr><th>Môn học</th><th>Mã đăng ký</th><th>Ngày đăng ký</th><th>Thao tác</th></tr></thead><tbody>{registrations.map((registration) => <tr key={registration.id}><td>{registration.courseName}</td><td>{registration.id}</td><td>{registration.ngayDangKy}</td><td><button type="button" disabled={cancellingId === registration.id} onClick={() => void handleCancel(registration)}>{cancellingId === registration.id ? 'Đang huỷ...' : 'Huỷ đăng ký'}</button></td></tr>)}</tbody></table>}</section>{toast && <Toast {...toast} onClose={clearToast} />}</main>;
}
