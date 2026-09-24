import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorResponse } from '../types/apiError';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: saveLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('');
    try {
      const response = await login({ username, password });
      saveLogin(response.data);
      const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/courses';
      navigate(destination, { replace: true });
    } catch (requestError: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(requestError)) setError(requestError.response?.data?.message ?? 'Tên đăng nhập hoặc mật khẩu không đúng.');
      else setError('Đăng nhập thất bại.');
    }
  };

  return <section><h1>Đăng nhập</h1><form onSubmit={handleSubmit}>
    <label>Tên đăng nhập<input value={username} onChange={(event) => setUsername(event.target.value)} required /></label>
    <label>Mật khẩu<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <button type="submit">Đăng nhập</button>
  </form></section>;
}

export default LoginPage;
