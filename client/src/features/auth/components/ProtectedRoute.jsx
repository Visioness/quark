import { Navigate, Outlet } from 'react-router';
// import { useAuth } from '../hooks/useAuth'; // TODO: Implement Auth Hook later

export const ProtectedRoute = () => {
  // Mock Auth for testing UI
  const user = { name: 'Test User' };
  // const user = null; // Toggle this to test redirect

  if (!user) {
    return <Navigate to='/auth/log-in' replace />;
  }

  return <Outlet />;
};
