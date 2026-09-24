import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminCoursesPage from './pages/AdminCoursesPage';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import RegisterCoursePage from './pages/RegisterCoursePage';

function App() {
  return <BrowserRouter><AuthProvider>
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/admin/courses" element={<ProtectedRoute requiredRole="ADMIN"><AdminCoursesPage /></ProtectedRoute>} />
        <Route path="/register-course" element={<ProtectedRoute requiredRole="STUDENT"><RegisterCoursePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/courses" replace />} />
      </Routes>
    </main>
  </AuthProvider></BrowserRouter>;
}

export default App;
