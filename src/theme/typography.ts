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
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    marginTop: 10,
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
  eyebrow: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  eyebrowSm: {
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  searchInput: {
    fontFamily: 'Manrope-Medium',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  priceMain: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  priceStrike: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    textDecorationLine: 'line-through',
  },
  footerLabel: {
    fontFamily: 'Manrope-Medium',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  screenTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  displayLg: {
    fontFamily: 'Manrope-Bold',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
} satisfies Record<string, TextStyle>;

export type Typography = typeof typography;
export type TypographyKey = keyof Typography;
