export const radius = {
  none: 0,
  sm: 8,
  image: 12,
  chip: 12,
  button: 14,
  card: 18,
  xl: 24,
  pill: 999,
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof Radius;
