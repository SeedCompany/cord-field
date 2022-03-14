import React, { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSession } from '../../components/Session';
import { AuthLayout } from './AuthLayout';
import { AuthWaiting } from './AuthWaiting';
import { ForgotPassword } from './ForgotPassword';
import { Login } from './Login/Login';
import { Logout } from './Logout';
import { Register } from './Register/Register';
import { ResetPassword } from './ResetPassword';

export const Authentication: FC = ({ children }) => {
  const { session } = useSession();

  const matched = useRoutes([
    { path: '/register', element: <Register /> },
    { path: '/login', element: <Login /> },
    { path: '/logout', element: <Logout /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password/:token', element: <ResetPassword /> },
  ]);

  // render anonymous auth scene, or spinner while waiting
  // for session or redirect to login when not logged in
  if (matched || !session) {
    return <AuthLayout>{matched ?? <AuthWaiting />}</AuthLayout>;
  }

  // logged in, show app
  return <>{children}</>;
};
