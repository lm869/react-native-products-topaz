import { formatCurrency } from '../currency';

describe('formatCurrency', () => {
  it('formats a positive amount in USD by default', () => {
    const formatted = formatCurrency(1234.5);
    expect(formatted).toMatch(/\$1,?234\.50/);
  });

  it('falls back to 0 when amount is NaN', () => {
    const formatted = formatCurrency(NaN);
    expect(formatted).toMatch(/\$0\.00/);
  });

  it('formats with a custom currency', () => {
    const formatted = formatCurrency(99, 'EUR', 'en-US');
    expect(formatted).toContain('€');
    expect(formatted).toContain('99');
  });

  it('formats with a custom locale', () => {
    const formatted = formatCurrency(1234.5, 'USD', 'es-AR');
    expect(formatted).toMatch(/1\.?234,50/);
  });
});
