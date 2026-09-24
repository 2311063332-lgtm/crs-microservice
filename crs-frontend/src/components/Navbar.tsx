import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav aria-label="Điều hướng chính" style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
      <Link to="/courses">Danh sách môn học</Link>
      {user?.role === 'ADMIN' && <Link to="/admin/courses">Quản trị môn học</Link>}
      {user?.role === 'STUDENT' && <Link to="/register-course">Đăng ký học phần</Link>}
      <span style={{ marginLeft: 'auto' }} />
      {user ? (
        <>
          <span>Xin chào, {user.username} ({user.role})</span>
          <button type="button" onClick={handleLogout}>Đăng xuất</button>
        </>
      ) : <Link to="/login">Đăng nhập</Link>}
    </nav>
  );
}

export default Navbar;
