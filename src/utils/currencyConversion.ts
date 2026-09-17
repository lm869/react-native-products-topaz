export const DEMO_RATES_FROM_USD = {
  USD: 1.0,
  EUR: 0.93,
  ARS: 1000,
  JPY: 150,
} as const;

export const DEMO_DISCLAIMER = 'Demo rates — not real-time';

export type DemoCurrency = keyof typeof DEMO_RATES_FROM_USD;

export function convertFromUSD(
  amountUSD: number,
  target: DemoCurrency,
): number {
  return amountUSD * DEMO_RATES_FROM_USD[target];
}

export function getCurrencyLocale(c: DemoCurrency): string {
  if (c === 'ARS') return 'es-AR';
  if (c === 'JPY') return 'ja-JP';
  return 'en-US';
}

export function getDemoRate(c: DemoCurrency): number {
  return DEMO_RATES_FROM_USD[c];
}
