import React from 'react';
import { useSettings } from '../components/contexts/settings';
import { useTranslation } from '../components/TranslationContext';
import { useAuth } from '../components/AuthContext';
import MainRoutes from './mainRoutes';
import { Navigate, useRoutes } from 'react-router-dom';
import AdminRoutes from './adminRoutes';
import NotFoundPage from '@/components/common/404NotFound';

export default function AppContent() {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { user } = useAuth();
  React.useEffect(() => {
    document.title = `${settings.siteName}`;
  }, [settings.siteName, t]);

  const isLoggedIn = Boolean(user);

  const routes = [
    ...(isLoggedIn
      ? [
        AdminRoutes,
        ...(MainRoutes?.children ?? [])
          .filter(route => route?.path !== "*")
          .map(route => ({
            path: route.path,
            element: <Navigate to="/" replace />,
          })),
      ]
      : [MainRoutes]
    ),
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ];

  return useRoutes(routes);

}





