import { palette } from './tokens';
import { radius } from './radius';
import { spacing } from './spacing';
import { typography } from './typography';

export const darkTheme = {
  scheme: 'dark' as const,
  colors: palette.dark,
  radius,
  spacing,
  typography,
};

export type DarkTheme = typeof darkTheme;
