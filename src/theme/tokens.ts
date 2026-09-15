export const palette = {
  light: {
    canvas: '#F2E9E4',
    card: '#FAF6F0',
    accent: '#8D5524',
    primary: '#2B2D42',
    text: '#2B2D42',
    textMuted: '#9A8C98',
    border: 'rgba(154,140,152,0.2)',
    favoriteActive: '#8D5524',
    favoriteInactive: '#9A8C98',
  },
  dark: {
    canvas: '#16182C',
    card: '#22192D',
    accent: '#C9ADA7',
    primary: '#F2E9E4',
    text: '#F2E9E4',
    textMuted: '#C9ADA7',
    border: 'rgba(154,140,152,0.3)',
    favoriteActive: '#C9ADA7',
    favoriteInactive: '#77767D',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type ColorTokens = typeof palette.light;
