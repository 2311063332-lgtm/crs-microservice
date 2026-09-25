import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() { const { user, logout } = useAuth(); return <nav className="navbar"><Link to="/">CRS</Link>{user?.role === 'STUDENT' && <><Link to="/register-course">Đăng ký học phần</Link><Link to="/my-registrations">Môn học đã đăng ký</Link></>}{user?.role === 'ADMIN' && <Link to="/admin/api-keys">Quản lý API Key</Link>}{user && <button type="button" onClick={logout}>Đăng xuất</button>}</nav>; }
