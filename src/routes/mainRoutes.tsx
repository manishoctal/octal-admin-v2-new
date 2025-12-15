import { ForgotPassword } from '@/components/ForgotPassword';
import { Login } from '../components/Login';
import { HomeRedirect } from './HomeRedirect';
import { PasswordReset } from '@/components/PasswordReset';
import { useParams } from 'react-router-dom';

function PasswordResetWrapper() {
  const params = useParams();
  const token = params?.token ?? '';
  return <PasswordReset token={token} />;
}

const MainRoutes = {
  // All common routes
  path: '/',
  children: [
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/login',
      element: <Login />,
    },

    {
      path: '/forgot-password',
      element: <ForgotPassword />,
    },
    {
      path: '/reset-password/:token',
      element: <PasswordResetWrapper />,
    },

    {
      path: '*',
      element: <HomeRedirect to='/' />,
    },
  ],
};

export default MainRoutes;