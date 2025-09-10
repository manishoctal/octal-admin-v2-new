import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Settings {
  // General Settings
  siteName: string;
  language: string;
  email: string;
  theme: 'light' | 'dark' | 'system';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  currencySymbol: string;
  timezone: string;
  companyName: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily: 'system' | 'sans-serif' | 'serif' | 'monospace';
  // Appearance
  compactMode: boolean;
  enableAnimations: boolean;

  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;

  // User Management
  allowRegistration: boolean;
  autoApproveUsers: boolean;

  // Contact Information
  supportEmail: string;
  phoneNumber: string;

  // Social Media
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
}

const defaultSettings: Settings = {
  siteName: 'Chordz Admin',
  language: 'en',
  theme: 'light',
  dateFormat: 'MM/DD/YYYY',
  currencySymbol: '$',
  timezone: 'UTC',
  fontSize: 'medium',
  fontFamily: 'system',
  compactMode: false,
  enableAnimations: true,
  maintenanceMode: false,
  maintenanceMessage: 'We are currently under maintenance. Please check back later.',
  allowRegistration: true,
  autoApproveUsers: false,
  email: 'chordz@support.com',
  phoneNumber: '+1 (555) 123-4567',
  companyName: 'Chordz Ind Ltd',
  facebookUrl: '',
  twitterUrl: '',
  linkedinUrl: '',
  instagramUrl: ''
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  formatDate: (date: string | Date) => string;
  formatCurrency: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminPanelSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Apply theme and other settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply compact mode
    if (settings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }






    // Apply font size
    const fontSizeMap = {
      'small': '12px',
      'medium': '14px',
      'large': '16px',
      'extra-large': '18px'
    };
    root.style.setProperty('--font-size', fontSizeMap[settings.fontSize]);

    // Apply font family
    const fontFamilyMap = {
      'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      'sans-serif': '"Inter", "Helvetica Neue", Arial, sans-serif',
      'serif': '"Georgia", "Times New Roman", Times, serif',
      'monospace': '"JetBrains Mono", "Fira Code", "Monaco", Consolas, monospace'
    };
    root.style.setProperty('--font-family', fontFamilyMap[settings.fontFamily]);

    // Apply animation settings
    root.style.setProperty(
      '--transition-duration',
      settings.enableAnimations ? '150ms' : '0ms'
    );
    root.style.setProperty(
      '--animation-duration',
      settings.enableAnimations ? '150ms' : '0ms'
    );

    // Update document title
    document.title = `${settings.siteName}`;
  }, [settings]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('adminPanelSettings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('adminPanelSettings');
  };

  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    switch (settings.dateFormat) {
      case 'DD/MM/YYYY':
        return dateObj.toLocaleDateString('en-GB');
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0];
      default:
        return dateObj.toLocaleDateString('en-US');
    }
  };

  const formatCurrency = (amount: number): string => {
    return `${settings.currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      formatDate,
      formatCurrency
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}