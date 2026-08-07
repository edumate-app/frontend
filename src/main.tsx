import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/api/interceptors';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/AppRouter.tsx';
import { Toaster } from '@/components/ui/sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
);
