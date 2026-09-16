import React, { useMemo } from 'react';
import { ThemeContext, type AppTheme } from '@/theme/ThemeContext';
import { lightTheme } from '@/theme/lightTheme';
import { darkTheme } from '@/theme/darkTheme';
import { useThemeStore } from '@/features/settings/store/themeStore';

type Props = { children: React.ReactNode };

export function ThemeOverrideProvider({ children }: Props): React.JSX.Element {
  const mode = useThemeStore(s => s.mode) ?? 'light';

  const effectiveTheme: AppTheme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  );

  return (
    <ThemeContext.Provider value={effectiveTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
