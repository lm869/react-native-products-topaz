import {
  DefaultTheme,
  DarkTheme,
  type Theme as NavTheme,
} from '@react-navigation/native';
import type { AppTheme } from '@/theme/ThemeContext';

export function toNavigationTheme(theme: AppTheme): NavTheme {
  const base = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: theme.scheme === 'dark',
    colors: {
      ...base.colors,
      primary: theme.colors.tabActive,
      background: theme.colors.canvas,
      card: theme.colors.canvas,
      text: theme.colors.text,
      border: theme.colors.cardBorder,
      notification: theme.colors.discountBg,
    },
  };
}
