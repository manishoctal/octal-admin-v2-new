import { createContext } from 'react';
import { SettingsContextType } from './settings.types';

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
