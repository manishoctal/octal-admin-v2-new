import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Component,
  Target,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Monitor,
  Lock,
  CircleQuestionMark,
  NotepadText,
  Mails,
  UserRoundCog,
  BellDot,
  FlagOff,
  TableOfContents,
  Waves,
  FileSliders,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import startCase from "lodash.startcase";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from './ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { TooltipProvider } from './ui/tooltip';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import { useTranslation } from './TranslationContext';
import { usePermissions, MODULES } from './PermissionContext';
import ConfirmDialog from './common/ConfirmStatusChange';
import helpers from '@/utils/helpers';
import { Accordion, AccordionItem } from './ui/accordion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const currentRoute = location?.pathname;
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { settings, updateSettings,adminSetting } = useSettings();
  const { t } = useTranslation();
  const { hasModuleAccess, getUserRole } = usePermissions();
  const [StatusSubadminId, setStatusSubadminId] = useState<string | null>(null);
  const userRole = getUserRole();

  // Define all menu items with permission requirements
  const allMenuItems = [
    {
      icon: LayoutDashboard,
      label: t('O_DASHBOARD'),
      path: 'dashboard',
      module: MODULES.DASHBOARD
    },
    {
      icon: Users,
      label: t('O_USERS'),
      path: 'users',
      module: MODULES.USERS
    },
    {
      icon: UserRoundCog,
      label: t('O_SUBADMIN'),
      path: 'subadmins',
      module: MODULES.SUBADMINS
    },

    {
      icon: Target,
      label: t('O_ERROR_LOGS'),
      path: 'error-logs',
      module: MODULES.ERROR_LOGS
    },

    {
      icon: FlagOff,
      label: t('REPORTS'),
      path: 'reports',
      module: MODULES.REPORTS
    },

    {
      icon: BellDot,
      label: t('NOTIFICARIONS'),
      path: 'notification-manager',
      module: MODULES.NOTIFICATIONS
    },
    {
      icon: Mails,
      label: t('EMAIL_TEMPLATE'),
      path: 'email-template',
      module: MODULES.EMAIL_TEMPLATE
    },
    {
      icon: NotepadText,
      label: t('STATIC_CONTENT'),
      path: 'static-content',
      module: MODULES.STATIC_CONTENT
    },

    {
      icon: CircleQuestionMark,
      label: t('FAQ'),
      path: 'faqs',
      module: MODULES.FAQ
    },
    {
      icon: Settings,
      label: t('O_SETTINGS'),
      path: 'settings',
      module: MODULES.SETTINGS
    },
     {
      icon: Component,
      label: t('UI_COMPONENTS_PREVIEW'),
      path: 'ui-components-preview',
      module: MODULES.UI_COMPONENTS_PREVIEW
    },
  ];

  // Filter menu items based on user permissions
  const sidebarActions = ["view", "edit", "Add", "delete"];

  const menuConfig = [
    {
      type: "item",
      path: "dashboard",
    },
    {
      icon: Users,
      type: "group",
      groupLabel: "User Manager",
      children: ["users", "subadmins","reports"],
    },
    {
      icon: Waves,
      type: "group",
      groupLabel: "Engagement",
      children: ["circles", "events", "intentions", "secret-crush"],
    },

    {
      icon: TableOfContents,
      type: "group",
      groupLabel: "CMS",
      children: ["static-content", "email-template", "faqs"],
    },
    {
      icon: FileSliders,
      type: "group",
      groupLabel: "System",
      children: ["notification-manager","error-logs", "settings"],
    },
     {
      type: "item",
      path: "ui-components-preview",
    },

  ];



  const menuMap = Object.fromEntries(allMenuItems.map(item => [item.path, item]));

  const filterByPermission = (item) => {
    if (user?.role === "admin") return true;
    if (user?.role === "subAdmin") {
      if (item.module === "SUBADMINS") return false;
      return sidebarActions.some(action =>
        user?.permission?.includes(`${item.module}:${action}`)
      );
    }
    return false;
  };

  const preparedMenu = menuConfig.map(config => {
    if (config.type === "item") {
      const item = menuMap[config.path];
      return item && filterByPermission(item) ? { ...config, item } : null;
    }
    if (config.type === "group") {
      const items = config.children
        .map(path => menuMap[path])
        .filter(Boolean)
        .filter(filterByPermission);
      return items.length > 0 ? { ...config, items } : null;
    }
    return null;
  }).filter(Boolean);

  const handleLogout = () => {
    setStatusSubadminId({ isOpen: true })
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  // Safe check for current route to prevent undefined errors
  const isActiveRoute = (itemPath: string) => {
    if (!currentRoute) return false;
    return currentRoute?.includes(itemPath)
  };

  // Updated navigation to use proper URLs
  const handleNavigate = (path: string) => {
    navigate(`/${path}`);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getRoleBadge = () => {
    if (!userRole) return null;

    const roleColors: Record<string, string> = {
      'Super Admin': 'bg-purple-500',
      'Admin': 'bg-blue-500',
      'Subadmin': 'bg-green-500',
      'Moderator': 'bg-orange-500',
      'Viewer': 'bg-gray-500'
    };

    return (
      <Badge
        variant="secondary"
        className={`${roleColors[userRole?.name] || 'bg-gray-500'} text-white text-xs`}
      >
        {startCase(userRole?.name)}
      </Badge>
    );
  };

  const [loading, setLoading] = useState(false)
  const handleToggleStatus = async () => {
    setLoading(true)
    logout();
  };




  return (

    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {helpers.ternaryCondition(user?.isPasswordSet, <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border p-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm cursor-pointer" onClick={()=>{navigate('/dashboard')}}>
                  <AvatarImage src={adminSetting?.logo} alt={'logo'} />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{settings?.siteName}</span>
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs text-sidebar-foreground/70   text-muted-foreground truncate max-w-[70px]">
                      {helpers.capitalizeFirstWord(user?.fullName)}
                    </span>
                    {getRoleBadge()}
                  </div>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-2">
              {preparedMenu?.map((config) =>
                config?.type === "item" ? (
                  <SidebarMenu key={config?.item?.path} >
                    <SidebarMenuItem >
                      <SidebarMenuButton
                        onClick={() => handleNavigate(config?.item?.path)}
                        isActive={isActiveRoute(config?.item?.path)}
                        className="w-full py-4"
                      >
                        <config.item.icon className="size-4" />
                        <span>{config?.item?.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                ) : (
                  <Accordion key={config?.groupLabel}>
                    <AccordionItem label={<div className="flex gap-2 items-center"><config.icon className="size-4" /> <span className='font-normal'>{config?.groupLabel}</span></div>}>
                      <SidebarMenu className='mt-1'>
                         {config?.items.map((item) => (
                            <SidebarMenuItem key={item?.path} >
                              <SidebarMenuButton
                                onClick={() => handleNavigate(item?.path)}
                                isActive={isActiveRoute(item?.path)}
                                className="w-full">
                                <ArrowRight className="size-4" />
                                <span>{item?.label}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                    </AccordionItem>
                  </Accordion>
                )
              )}
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePic} alt={user?.fullName || 'User'} />
                      <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                        {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-xs leading-tight">
                      <span className="truncate font-medium">{user?.fullName || 'Administrator'}</span>
                      <div className="flex items-center gap-1">
                        <span className="truncate text-sidebar-foreground/70">
                          {user?.email || 'admin@example.com'}
                        </span>
                      </div>
                    </div>
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>, '')}

          <div className="flex flex-1 flex-col">
            {helpers.ternaryCondition(user?.isPasswordSet, <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center gap-4 px-4">
                <SidebarTrigger />

                <div className="flex flex-1 items-center gap-4">
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profilePic} alt={user?.fullName || 'User'} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {helpers.capitalizeFirstWord(user?.fullName) || 'Administrator'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || 'admin@example.com'}
                          </p>
                          <div className="pt-1">
                            {getRoleBadge()}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => navigate('/change-password')}>
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Change Password</span>
                      </DropdownMenuItem>

                      {hasModuleAccess(MODULES.SETTINGS) && (
                        <DropdownMenuItem onClick={() => handleNavigate('settings')}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t('SETTINGS')}</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Monitor className="mr-2 h-4 w-4" />
                          <span>{t('THEME')}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>{t('LIGHT_MODE')}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>{t('DARK_MODE')}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                            <Monitor className="mr-2 h-4 w-4" />
                            <span>{t('SYSTEM_THEME')}</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>, '')}

            <main className="flex-1 overflow-auto bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/20">
             

              <Outlet />
            </main>
          </div>
        </div>

        <ConfirmDialog
          open={!!StatusSubadminId}
          onCancel={() => setStatusSubadminId(null)}
          onConfirm={() => StatusSubadminId && handleToggleStatus(StatusSubadminId)}
          confirmText="Yes"
          title={t('ARE_YOU_SURE_YOU_WANT_TO_LOG_OUT')}
          description={'Logging out will immediately terminate active session and restrict access to the system until they log in again.'}
          loading={loading}
        />
      </SidebarProvider>
    </TooltipProvider>
  );
}





