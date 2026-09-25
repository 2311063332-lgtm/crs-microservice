import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: saveLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try { const response = await login({ username, password }); saveLogin(response.data); navigate('/register-course'); } catch { setError('Sai tài khoản hoặc mật khẩu'); }
  };

  return <main className="page-shell"><form className="card login-form" onSubmit={handleSubmit}><h1>Đăng nhập</h1>{error && <p className="error">{error}</p>}<label>Tài khoản<input value={username} onChange={(event) => setUsername(event.target.value)} required /></label><label>Mật khẩu<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button type="submit">Đăng nhập</button></form></main>;
}
