import { ReactNode } from 'react';

export interface Settings {
  siteName: string;
  language: string;
  email: string;
  theme: 'light' | 'dark' | 'system';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  currencySymbol: string;
  timezone: string;
  companyName: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily:
    | 'system'
    | 'sans-serif'
    | 'serif'
    | 'monospace'
    | 'arial'
    | 'verdana'
    | 'tahoma'
    | 'trebuchet'
    | 'comic'
    | 'georgia'
    | 'garamond'
    | 'courier-new'
    | 'lucida-console';

  compactMode: boolean;
  enableAnimations: boolean;

  maintenanceMode: boolean;
  maintenanceMessage: string;

  allowRegistration: boolean;
  autoApproveUsers: boolean;

  supportEmail: string;
  phoneNumber: string;

  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
}

export interface AdminSetting {
  [key: string]: unknown;
}

export interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  formatDate: (date: string | Date) => string;
  formatCurrency: (amount: number) => string;
  adminSetting: AdminSetting;
  getAdminSettingDta: () => Promise<void>;
}

export interface SettingsProviderProps {
  children: ReactNode;
}
