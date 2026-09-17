import { useEffect, useState } from 'react';
import { formatCurrency } from './currency';
import {
  formatCurrencyNative,
  isNativeCurrencyFormatterAvailable,
} from './nativeCurrencyFormatter';

type Path = 'native' | 'intl';

export type FormattedPrice = {
  value: string;
  path: Path;
};

const cache = new Map<string, FormattedPrice>();

export function __resetPriceCacheForTesting(): void {
  cache.clear();
}

export function useFormattedPrice(
  amount: number,
  currency: string,
  locale: string,
): FormattedPrice {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const key = `${safeAmount}-${currency}-${locale}`;
  const cached = cache.get(key);
  const [state, setState] = useState<FormattedPrice>(
    cached ?? {
      value: formatCurrency(safeAmount, currency, locale),
      path: 'intl',
    },
  );

  useEffect(() => {
    if (cache.has(key)) {
      setState(cache.get(key) as FormattedPrice);
      return;
    }
    const syncValue = formatCurrency(safeAmount, currency, locale);
    if (!isNativeCurrencyFormatterAvailable()) {
      const entry: FormattedPrice = { value: syncValue, path: 'intl' };
      cache.set(key, entry);
      setState(entry);
      return;
    }
    let mounted = true;
    formatCurrencyNative(safeAmount, currency, locale)
      .then(value => {
        if (!mounted) return;
        const entry: FormattedPrice = { value, path: 'native' };
        cache.set(key, entry);
        setState(entry);
      })
      .catch(() => {
        if (!mounted) return;
        const entry: FormattedPrice = { value: syncValue, path: 'intl' };
        cache.set(key, entry);
        setState(entry);
      });
    return () => {
      mounted = false;
    };
  }, [key, safeAmount, currency, locale]);

  return state;
}
