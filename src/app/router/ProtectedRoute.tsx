import { useAuthStore } from '@/features/auth/store/auth.store';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasCheckedAuth = useAuthStore((s) => s.hasCheckedAuth);

  if (!hasCheckedAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  console.log(
    'ProtectedRoute: User is authenticated, rendering protected content.',
  );

  return <Outlet />;
};
