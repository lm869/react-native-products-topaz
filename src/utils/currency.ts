export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}
