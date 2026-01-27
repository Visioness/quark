import { createBrowserRouter } from 'react-router';
import { LandingPage, LogInPage, SignUpPage } from '@/pages';
import { ProtectedRoute } from '@/features/auth/components';
import { AppLayout } from '@/components/layout';
import { RecentChats } from '@/features/chat/components';

export const router = createBrowserRouter([
  {
    path: '/welcome',
    element: <LandingPage />,
  },
  {
    path: '/auth/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/auth/log-in',
    element: <LogInPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <RecentChats />,
          },
        ],
      },
    ],
  },
]);
