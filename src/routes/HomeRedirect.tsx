
// HomeRedirect.tsx
import { Navigate } from 'react-router-dom';

interface HomeRedirectProps {
  to: string;
  replace?: boolean;
}

export const HomeRedirect = ({ to, replace = true }: HomeRedirectProps) => {
  return <Navigate to={to} replace={replace} />;
};