import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardLayout } from '../layouts/dashboard/DashboardLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import AddVideo from '@/pages/dashboard/AddVideo';
import VideoLessonPage from '@/pages/dashboard/video-lesson';
import SettingsPage from '@/pages/dashboard/setting';
import SavedPage from '@/pages/dashboard/SavedPage';
import ImportVideoPage from '@/pages/dashboard/ImportVideoPage';
import MyVideosPage from '@/pages/dashboard/MyVideosPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: '/app/dashboard',
                element: <DashboardPage />,
              },
              {
                path: '/app/settings',
                element: <SettingsPage />,
              },
              {
                path: '/app/saved',
                element: <SavedPage />,
              },
              {
                path: '/app/videos',
                element: <MyVideosPage />,
              },
              {
                path: '/app/videos/new',
                element: <AddVideo />,
              },
              {
                path: '/app/videos/import/:jobId',
                element: <ImportVideoPage />,
              },
              {
                path: '/app/videos/:video_uuid',
                element: <VideoLessonPage />,
              },
            ],
          },
        ],
      },
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
