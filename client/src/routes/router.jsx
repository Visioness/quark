import { createBrowserRouter, Navigate } from 'react-router';
import { LandingPage, LogInPage, SignUpPage } from '@/pages';
import { ProtectedRoute } from '@/features/auth/components';
import { AppLayout, FriendsLayout } from '@/components/layout';
import { Profile } from '@/features/profile/components';
import { Friends, Requests } from '@/features/friends/components';
import { Chat } from '@/features/chat/components';
import { SocketProvider } from '@/features/chat/context/SocketContext';

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
        element: (
          <SocketProvider>
            <AppLayout />
          </SocketProvider>
        ),
        children: [
          {
            index: true,
            element: <Navigate to='/friends' replace />,
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
          {
            path: 'chat/:conversationId',
            element: <Chat />,
          },
        ],
      },
    ],
  },
]);
