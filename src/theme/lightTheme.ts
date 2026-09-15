import { palette } from './tokens';
import { radius } from './radius';
import { spacing } from './spacing';
import { typography } from './typography';

export const lightTheme = {
  scheme: 'light' as const,
  colors: palette.light,
  radius,
  spacing,
  typography,
};

export type LightTheme = typeof lightTheme;
