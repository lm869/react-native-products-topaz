import { createContext, useContext } from 'react';
import type { LightTheme } from './lightTheme';
import type { DarkTheme } from './darkTheme';

export type AppTheme = LightTheme | DarkTheme;

export const ThemeContext = createContext<AppTheme | undefined>(undefined);

export function useAppTheme(): AppTheme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return theme;
}
