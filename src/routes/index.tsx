import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { Editor } from '../pages/Editor';
import { SharedImage } from '../pages/SharedImage';
import { ProfilePage } from '../pages/ProfilePage';
import { AuthCallback } from '../pages/AuthCallback';
import { ProtectedRoute } from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/editor',
    element: <Editor />
  },
  {
    path: '/share/:id',
    element: <SharedImage />
  },
  {
    path: '/profile',
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}