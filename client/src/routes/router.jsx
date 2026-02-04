import { createBrowserRouter } from 'react-router';
import { LandingPage, LogInPage, SignUpPage } from '@/pages';
import { ProtectedRoute } from '@/features/auth/components';
import { AppLayout, FriendsLayout } from '@/components/layout';
import { RecentChats } from '@/features/chat/components';
import { Profile } from '@/features/profile/components';
import { Friends, Requests } from '@/features/friends/components';

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
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'friends',
            element: <FriendsLayout />,
            children: [
              {
                index: true,
                element: <Friends />,
              },
              {
                path: 'requests',
                element: <Requests />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
