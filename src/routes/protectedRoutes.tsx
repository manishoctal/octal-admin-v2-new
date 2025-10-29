
import { useEffect } from 'react';
import { usePermissions } from '../components/PermissionContext';
import { subadminAPI } from '@/components/AuthContext';
import { useLocation } from 'react-router-dom';

const ProtectedModuleRoute = ({ children, route }: { children: React.ReactNode; route: string; }) => {
    const { canAccessRoute } = usePermissions();
     const location=useLocation()
    useEffect(() => {
        if(location?.pathname=='/change-password'||location?.pathname=='/'||location?.pathname=='/dashboard')loadSubadmins();
      }, [location]);
    
      const loadSubadmins = async () => {
        try {
          const paylaod = {}
          await subadminAPI.getSubadmins(paylaod);
        } catch (error) {
          console.error('Error loading subadmins:', error);
        } 
      };



    
    if (!canAccessRoute(route)) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center p-4 lg:p-6">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                <p className="text-muted-foreground text-center">
                    You don't have permission to access this module.
                </p>
            </div>
        );
    }
    return <>{children}</>;
};

export default ProtectedModuleRoute