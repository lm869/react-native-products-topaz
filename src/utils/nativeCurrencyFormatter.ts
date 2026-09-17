import { NativeModules, Platform } from 'react-native';

type NativeCurrencyFormatter = {
  format(amount: number, currencyCode: string, locale: string): Promise<string>;
};

const nativeModule = (
  NativeModules as { NativeCurrencyFormatter?: NativeCurrencyFormatter }
).NativeCurrencyFormatter;

function formatWithIntl(
  amount: number,
  currency: string,
  locale: string,
): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

export async function formatCurrencyNative(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): Promise<string> {
  if (Platform.OS === 'android' && nativeModule) {
    try {
      return await nativeModule.format(amount, currency, locale);
    } catch {
      return formatWithIntl(amount, currency, locale);
    }
  }
  return formatWithIntl(amount, currency, locale);
}

export function isNativeCurrencyFormatterAvailable(): boolean {
  return Platform.OS === 'android' && nativeModule !== undefined;
}
