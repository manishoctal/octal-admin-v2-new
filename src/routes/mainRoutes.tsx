import { ForgotPassword } from '@/components/ForgotPasswprd'
import {Login} from '../components/Login'
import { HomeRedirect } from './HomeRedirect'
import { PasswordReset } from '@/components/PasswordReset'

const MainRoutes = {

  // All common routes
  path: '/',
  children: [
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/login',
      element: <Login />
    },


    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password/:token',
      element: <PasswordReset />
    },

    
    {
      path: '*',
      element: <HomeRedirect to='/' />
    }

  ]
}

export default MainRoutes
