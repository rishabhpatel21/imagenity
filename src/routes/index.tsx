import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { Editor } from '../pages/Editor';
import { SharedImage } from '../pages/SharedImage';
import { ProfilePage } from '../pages/ProfilePage';
import { AuthCallback } from '../pages/AuthCallback';
import { ResetPassword } from '../pages/ResetPassword';
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
  },
  {
    // Update the reset password route to handle both paths
    path: '/reset-password',
    element: <ResetPassword />,
    // Add a loader to handle the hash parameters
    loader: ({ request }) => {
      const url = new URL(request.url);
      const hash = url.hash;
      if (hash) {
        // Parse the hash parameters
        const params = new URLSearchParams(hash.substring(1));
        return {
          accessToken: params.get('access_token'),
          refreshToken: params.get('refresh_token'),
          type: params.get('type')
        };
      }
      return null;
    }
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
