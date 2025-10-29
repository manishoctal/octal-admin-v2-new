import  { useEffect } from 'react';
import { useAuth } from './AuthContext';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // useEffect(() => {
  //   if (!loading && !isAuthenticated) {
  //     navigate('/login', { replace: true, state: { from: currentRoute } });
  //   }
  // }, [isAuthenticated, loading, navigate, currentRoute]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return 
  }

  return <>{children}</>;
}