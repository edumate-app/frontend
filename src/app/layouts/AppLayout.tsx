import { Outlet } from 'react-router-dom';
import { useAuthStatus } from '../../features/auth/hooks/useAuthStatus';
import { Toaster } from '@/components/ui/sonner';

export const AppLayout = () => {
  useAuthStatus();
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};
