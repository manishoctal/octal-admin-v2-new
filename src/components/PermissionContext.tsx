import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Permission {
  module: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
  level: number;
  permissions: Permission[];
}

// Define available modules and their actions
export const MODULES = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  // CIRCLES: 'circles',
  // EVENTS: 'events',
  // INTENTIONS: 'intentions',
  SUBADMINS: 'subadmins',

  // SECRET_CRUSH: "secret_crush",
  REPORTS: "reports",
  EMAIL_TEMPLATE: 'email_template',
  STATIC_CONTENT: "static_content",
  ERROR_LOGS:"error_logs",
  FAQ: 'faqs',
  NOTIFICATIONS: "notification",
  SETTINGS: 'settings',
  CHANGE_PASSWORD: "change_password",
  PROFILE: "profile"
} as const;

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'Add',
  EDIT: 'edit',
  DELETE: 'delete',
} as const;


export const MODULE_ACTIONS: Record<string, (keyof typeof ACTIONS)[]> = {
  dashboard: ['VIEW'],
  profile: ['VIEW', 'EDIT'],
  subadmins: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  users: ['VIEW', 'EDIT',],
  products: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  circles: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  events: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  intentions: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  notification: ['VIEW', 'CREATE'],
  reports: ['VIEW', 'EDIT'],
  secret_crush: ['VIEW', 'CREATE', 'DELETE'],
  virtual_gifts: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  error_logs: ['VIEW'],
  orders: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  analytics: ['VIEW'],
  email_template: ['VIEW', 'CREATE', 'EDIT'],
  static_content: ['VIEW', 'CREATE', 'EDIT'],
  faqs: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  settings: ['VIEW', 'EDIT'],
  change_password: ['EDIT'],
};


// Predefined roles
export const ROLES: Record<string, Role> = {
  ADMIN: {
    id: 'admin',
    name: 'Admin',
    level: 80,
    permissions: [
      { module: MODULES.DASHBOARD, actions: [ACTIONS.VIEW] },
      { module: MODULES.USERS, actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT] },
      { module: MODULES.SUBADMINS, actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT] },
      { module: MODULES.PRODUCTS, actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT] },
      { module: MODULES.VIRTUAL_GIFTS, actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT] },
      { module: MODULES.CIRCLES, actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE] },
      { module: MODULES.EVENTS, actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE] },
      { module: MODULES.INTENTIONS, actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE] },
      { module: MODULES.NOTIFICATIONS, actions: [ACTIONS.VIEW, ACTIONS.CREATE] },
      { module: MODULES.REPORTS, actions: [ACTIONS.VIEW, ACTIONS.EDIT] },
      { module: MODULES.SECRET_CRUSH, actions: [ACTIONS.VIEW,ACTIONS.EDIT, ACTIONS.CREATE, ACTIONS.DELETE] },
      { module: MODULES.ERROR_LOGS, actions: [ACTIONS.VIEW] },
      { module: MODULES.ORDERS, actions: [ACTIONS.VIEW, ACTIONS.EDIT] },
      { module: MODULES.ANALYTICS, actions: [ACTIONS.VIEW] },
      { module: MODULES.SETTINGS, actions: [ACTIONS.VIEW, ACTIONS.EDIT] },
      { module: MODULES.CHANGE_PASSWORD, actions: [ACTIONS.VIEW, ACTIONS.EDIT] },
      { module: MODULES.PROFILE, actions: [ACTIONS.VIEW, ACTIONS.EDIT] },
      { module: MODULES.EMAIL_TEMPLATE, actions: [ACTIONS.VIEW, ACTIONS.EDIT] },
      { module: MODULES.STATIC_CONTENT, actions: [ACTIONS.VIEW, ACTIONS.EDIT] },
      { module: MODULES.FAQ, actions: [ACTIONS.VIEW, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.CREATE] }
    ]
  },
  SUBADMIN: {
    id: 'subadmin',
    name: 'subAdmin',
    level: 50,
  },

};

export const MODULE_LABELS = {
  [MODULES.DASHBOARD]: 'Dashboard',
  [MODULES.USERS]: 'Users Management',
  [MODULES.CIRCLES]: 'Circles Management',
  [MODULES.EVENTS]: 'Events Management',
  [MODULES.INTENTIONS]: 'Intent Management',
  [MODULES.NOTIFICATIONS]: 'Notification Management',
  [MODULES.REPORTS]: 'Reports Management',
  [MODULES.SUBADMINS]: 'Subadmin Management',
  [MODULES.SETTINGS]: 'System Settings',
  [MODULES.PROFILE]: 'Profile',
  [MODULES.CHANGE_PASSWORD]: 'Change Password',
  [MODULES.ERROR_LOGS]: 'Error Logs',
  [MODULES.FAQ]: `FAQ's`,
  [MODULES.STATIC_CONTENT]: 'Static Content',
  [MODULES.EMAIL_TEMPLATE]: 'Email Template',
  [MODULES.SECRET_CRUSH]: 'Secret Crush Management',
  [MODULES.PRODUCTS]: 'Products Management',
  [MODULES.VIRTUAL_GIFTS]: 'Virtual Gifts',
  [MODULES.PAYMENTS]: 'Payments Tracking',
  [MODULES.ORDERS]: 'Orders Management',
  [MODULES.ANALYTICS]: 'Analytics & Reports',

};

export const ACTION_LABELS = {
  [ACTIONS.VIEW]: 'View',
  [ACTIONS.CREATE]: 'Add',
  [ACTIONS.EDIT]: 'Edit',
  [ACTIONS.DELETE]: 'Delete',
};

interface PermissionContextType {
  hasPermission: (module: string, action: string) => boolean;
  hasModuleAccess: (module: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  getUserRole: () => Role | null;
  getSubadminPermission: () => Role[];
  getAvailableModules: () => string[];
  getModulePermissions: (module: string) => string[];
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { user } = useAuth();

  const getSubadminPermission = (): Role | null => {
    if (!user) return null;

    const formatted = user?.permission?.reduce((acc, perm) => {
      const [module, action] = perm?.split(":");

      let moduleObj = acc?.find(item => item?.module === module);
      if (!moduleObj) {
        moduleObj = { module, actions: [] };
        acc?.push(moduleObj);
      }

      // Add action if not already there
      if (action && !moduleObj?.actions?.includes(action)) {
        moduleObj?.actions?.push(action);
      }

      return acc;
    }, []);

    return JSON.stringify(formatted, null, 2)

  }

  const getUserRole = (): Role | null => {
    if (!user) return null;
    if (user?.role === 'admin') {
      return ROLES.ADMIN;
    }
    const userPermission = getSubadminPermission() ? JSON.parse(getSubadminPermission()) : []
    const roleId = user?.role ;
    let definedRole = ROLES[roleId.toUpperCase()]
    return { ...definedRole, permissions: userPermission }
  };


  const hasPermission = (module: string, action: string): boolean => {
    const userRole = getUserRole();
    if (!userRole) return false;
    const modulePermission = userRole.permissions.find(p => p.module === module);
    return modulePermission ? modulePermission.actions.includes(action) : false;
  };

  const hasModuleAccess = (module: string): boolean => {
    const userRole = getUserRole();

    if (!userRole) return false;
    return userRole.permissions.some(p => p.module === module);
  };

  const canAccessRoute = (route: string): boolean => {
    const routeModuleMap: Record<string, string> = {
      'dashboard': MODULES.DASHBOARD,
      'users': MODULES.USERS,
      'profile': MODULES.PROFILE,
      'products': MODULES.PRODUCTS,
      'circles': MODULES.CIRCLES,
      'events': MODULES.EVENTS,
      'intentions': MODULES.INTENTIONS,
      'notification-manager': MODULES.NOTIFICATIONS,
      'reports': MODULES.REPORTS,
      'secret-crush': MODULES.SECRET_CRUSH,
      'payments': MODULES.PAYMENTS,
      'error-logs': MODULES.ERROR_LOGS,
      'orders': MODULES.ORDERS,
      'analytics': MODULES.ANALYTICS,
      'subadmins': MODULES.SUBADMINS,
      'faqs': MODULES.FAQ,
      'static-content': MODULES.STATIC_CONTENT,
      'email-template': MODULES.EMAIL_TEMPLATE,
      'settings': MODULES.SETTINGS,
      'change-password': MODULES.CHANGE_PASSWORD
    };

    const baseRoute = route.split('/')[0];
    const module = routeModuleMap[baseRoute];

    return module ? hasModuleAccess(module) : false;
  };

  const getAvailableModules = (): string[] => {
    const userRole = getUserRole();
    if (!userRole) return [];

    return userRole.permissions.map(p => p.module);
  };

  const getModulePermissions = (module: string): string[] => {
    const userRole = getUserRole();
    if (!userRole) return [];

    const modulePermission = userRole.permissions.find(p => p.module === module);
    return modulePermission ? modulePermission.actions : [];
  };

  return (
    <PermissionContext.Provider value={{
      hasPermission,
      hasModuleAccess,
      canAccessRoute,
      getUserRole,
      getAvailableModules,
      getModulePermissions,
      getSubadminPermission
    }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

// Permission-based component wrapper
interface PermissionGateProps {
  module: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ module, action, children, fallback = null }: PermissionGateProps) {
  const { hasPermission } = usePermissions();
  if (hasPermission(module, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

// Module access wrapper
interface ModuleGateProps {
  module: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function ModuleGate({ module, children, fallback = null }: ModuleGateProps) {
  const { hasModuleAccess } = usePermissions();

  if (hasModuleAccess(module)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}