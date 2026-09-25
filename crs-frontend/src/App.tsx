import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterCoursePage from './pages/RegisterCoursePage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import './index.css';

function App() {
  return <AuthProvider><BrowserRouter><Navbar /><Routes><Route path="/login" element={<LoginPage />} /><Route element={<ProtectedRoute requiredRole="STUDENT" />}><Route path="/register-course" element={<RegisterCoursePage />} /><Route path="/my-registrations" element={<MyRegistrationsPage />} /></Route><Route path="/" element={<Navigate to="/register-course" replace />} /></Routes></BrowserRouter></AuthProvider>;
}
export default App;
