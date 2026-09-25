import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterCoursePage from './pages/RegisterCoursePage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import ApiKeysPage from './pages/ApiKeysPage';
import './index.css';
export default function App() { return <AuthProvider><BrowserRouter><Navbar /><Routes><Route path="/login" element={<LoginPage />} /><Route element={<ProtectedRoute requiredRole="STUDENT" />}><Route path="/register-course" element={<RegisterCoursePage />} /><Route path="/my-registrations" element={<MyRegistrationsPage />} /></Route><Route element={<ProtectedRoute requiredRole="ADMIN" />}><Route path="/admin/api-keys" element={<ApiKeysPage />} /></Route><Route path="/" element={<Navigate to="/register-course" replace />} /></Routes></BrowserRouter></AuthProvider>; }
