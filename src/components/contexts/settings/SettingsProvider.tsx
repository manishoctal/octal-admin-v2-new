import { useState, useEffect } from 'react';
import { SettingsContext } from './SettingsContext';
import {
  SettingsProviderProps,
  Settings,
  AdminSetting
} from './settings.types';
import { defaultSettings } from './settings.constants';
import { apiGet } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [adminSetting, setAdminSetting] = useState<AdminSetting>({});

  const getAdminSettingDta = async () => {
    try {
      const resp = await apiGet(apiPath.getSetting);
      if (resp?.data?.success) {
        setAdminSetting(resp.data.results);
      }
    } catch (err) {
      console.log('Error loading admin settings:', err);
    }
  };

  useEffect(() => {
    getAdminSettingDta();
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminPanelSettings');
    if (!savedSettings) return;

    try {
      const parsed = JSON.parse(savedSettings);
      setSettings({ ...defaultSettings, ...parsed });
    } catch (error) {
      console.error('Error parsing saved settings:', error);
    }
  }, []);

  // Apply theme/config to <html>
  useEffect(() => {
    const root = document.documentElement;

    // Theme Handling
    if (settings.theme === 'dark') root.classList.add('dark');
    else if (settings.theme === 'light') root.classList.remove('dark');
    else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }

    // Compact mode
    root.classList.toggle('compact-mode', settings.compactMode);

    // Font size
    const fontSizeMap = {
      small: '12px',
      medium: '14px',
      large: '16px',
      'extra-large': '18px'
    };
    root.style.setProperty('--font-size', fontSizeMap[settings.fontSize]);

    // Font family
    const fontFamilyMap = {
      system: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
      'sans-serif': `"Inter", Arial, sans-serif`,
      serif: `"Georgia", "Times New Roman", serif`,
      monospace: `"JetBrains Mono", Consolas, monospace`,
      arial: `Arial, sans-serif`,
      verdana: `Verdana, Geneva, sans-serif`,
      tahoma: `Tahoma, Geneva, sans-serif`,
      trebuchet: `"Trebuchet MS", sans-serif`,
      comic: `"Comic Sans MS", cursive`,
      georgia: `Georgia, serif`,
      garamond: `Garamond, serif`,
      'courier-new': `"Courier New", monospace`,
      'lucida-console': `"Lucida Console", monospace`
    };
    root.style.setProperty('--font-family', fontFamilyMap[settings.fontFamily]);

    // Animation settings
    const duration = settings.enableAnimations ? '150ms' : '0ms';
    root.style.setProperty('--transition-duration', duration);
    root.style.setProperty('--animation-duration', duration);

    // Document title
    document.title = settings.siteName;
  }, [settings]);

  // Listen for system theme change
  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('adminPanelSettings', JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('adminPanelSettings');
  };

  const formatDate = (date: string | Date): string => {
    const obj = typeof date === 'string' ? new Date(date) : date;

    switch (settings.dateFormat) {
      case 'DD/MM/YYYY':
        return obj.toLocaleDateString('en-GB');
      case 'YYYY-MM-DD':
        return obj.toISOString().split('T')[0];
      default:
        return obj.toLocaleDateString('en-US');
    }
  };

  const formatCurrency = (amount: number): string =>
    `${settings.currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        formatDate,
        formatCurrency,
        adminSetting,
        getAdminSettingDta
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
