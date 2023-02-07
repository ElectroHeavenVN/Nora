import { createContext } from 'react';

export interface ThemeStateContextType {
  isDarkMode: boolean;
}
export interface ThemeUpdateContextType {
  isDarkMode: boolean;
}

export const ThemeStateContext = createContext({} as ThemeStateContextType);
export const ThemeUpdateContext = createContext({} as ThemeUpdateContextType);
