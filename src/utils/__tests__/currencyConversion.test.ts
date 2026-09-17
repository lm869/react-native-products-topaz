import {
  convertFromUSD,
  DEMO_RATES_FROM_USD,
  getCurrencyLocale,
  getDemoRate,
} from '../currencyConversion';

describe('convertFromUSD', () => {
  it('returns the same amount for USD target', () => {
    expect(convertFromUSD(100, 'USD')).toBe(100);
  });

  it('multiplies by EUR rate', () => {
    expect(convertFromUSD(100, 'EUR')).toBeCloseTo(93);
  });

  it('multiplies by ARS rate (high)', () => {
    expect(convertFromUSD(100, 'ARS')).toBe(100000);
  });

  it('multiplies by JPY rate', () => {
    expect(convertFromUSD(100, 'JPY')).toBe(15000);
  });

  it('handles zero', () => {
    expect(convertFromUSD(0, 'EUR')).toBe(0);
  });
});

describe('getCurrencyLocale', () => {
  it('maps ARS to es-AR', () => {
    expect(getCurrencyLocale('ARS')).toBe('es-AR');
  });

  it('maps JPY to ja-JP', () => {
    expect(getCurrencyLocale('JPY')).toBe('ja-JP');
  });

  it('maps USD to en-US', () => {
    expect(getCurrencyLocale('USD')).toBe('en-US');
  });

  it('maps EUR to en-US', () => {
    expect(getCurrencyLocale('EUR')).toBe('en-US');
  });
});

describe('getDemoRate', () => {
  it('returns the rate for the given currency', () => {
    expect(getDemoRate('EUR')).toBe(DEMO_RATES_FROM_USD.EUR);
    expect(getDemoRate('ARS')).toBe(1000);
  });
});
