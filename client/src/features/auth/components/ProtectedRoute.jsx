import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LoadingPage } from '@/pages';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingPage />;

  return isAuthenticated ? <Outlet /> : <Navigate to='/welcome' replace />;
};
