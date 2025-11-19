import { createContext, useContext, ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import translations from "../translations";
import helpers from '@/utils/helpers';

// Available languages
export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  availableLanguages: typeof availableLanguages;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const { settings, updateSettings } = useSettings();
  
  const currentLanguage = settings.language || 'en';
  
  // const t = (key: string, params?: Record<string, string | number>): string => {
  //   try {
  //     const keys = key.split('.');
  //     let value: any = translations[currentLanguage];
      
  //     for (const k of keys) {
  //       if (helpers.andCondition(helpers.andCondition(value , typeof value === 'object') , k in value)) {
  //         value = value[k];
  //       } else {
  //         value = translations.en;
  //         for (const fallbackKey of keys) {
  //           if (helpers.andCondition(helpers.andCondition(value , typeof value === 'object' ), fallbackKey in value)) {
  //             value = value[fallbackKey];
  //           } else {
  //             console.warn(`Translation key not found: ${key}`);
  //             return key; 
  //           }
  //         }
  //         break;
  //       }
  //     }
      
  //     if (typeof value === 'string') {
  //       if (params) {
  //         return Object.entries(params).reduce((result, [param, val]) => {
  //           return result.replace(new RegExp(`\\{${param}\\}`, 'g'), String(val));
  //         }, value);
  //       }
  //       return value;
  //     }
      
  //     console.warn(`Translation key "${key}" does not resolve to a string`);
  //     return key;
  //   } catch (error) {
  //     console.error(`Error getting translation for key "${key}":`, error);
  //     return key;
  //   }
  // };
  

  const resolvePath = (obj: any, keys: string[]): any => {
    for (const key of keys) {
      if (helpers.andCondition(helpers.andCondition(obj , typeof obj === "object") , key in obj)) {
        obj = obj[key];
      } else {
        return undefined;
      }
    }
    return obj;
  };
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      const keys = key?.split(".");
        let value = resolvePath(translations[currentLanguage], keys);
        if (value === undefined) {
        value = resolvePath(translations.en, keys);
        if (value === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }
  
      if (typeof value !== "string") {
        console.warn(`Translation key "${key}" does not resolve to a string`);
        return key;
      }
        if (params) {
        return Object.entries(params).reduce(
          (result, [param, val]) =>
            result.replace(new RegExp(`\\{${param}\\}`, "g"), String(val)),
          value
        );
      }
  
      return value;
    } catch (error) {
      console.error(`Error getting translation for key "${key}":`, error);
      return key;
    }
  };
  


  const changeLanguage = (language: string) => {
    if (translations[language]) {
      updateSettings({ language });
    }
  };
  
  return (
    <TranslationContext.Provider value={{
      t,
      currentLanguage,
      changeLanguage,
      availableLanguages
    }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}