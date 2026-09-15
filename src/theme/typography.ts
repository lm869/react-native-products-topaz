import type { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  price: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
} satisfies Record<string, TextStyle>;

export type Typography = typeof typography;
export type TypographyKey = keyof Typography;
