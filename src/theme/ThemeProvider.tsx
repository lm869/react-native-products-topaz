import React, { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext, type AppTheme } from './ThemeContext';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

type Props = { children: React.ReactNode };

export function ThemeProvider({ children }: Props): React.JSX.Element {
  const scheme = useColorScheme();
  const theme: AppTheme = useMemo(
    () => (scheme === 'dark' ? darkTheme : lightTheme),
    [scheme],
  );
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
