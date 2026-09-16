export const spacing = {
  none: 0,
  xxs: 4,
  avatar: 8,
  xs: 8,
  sm: 12,
  gutterSm: 14,
  md: 16,
  gutter: 16,
  lg: 20,
  margin: 20,
  xl: 24,
  xxl: 32,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof Spacing;
