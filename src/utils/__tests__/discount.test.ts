import { computeDiscountedPrice, isOnSale } from '../discount';

describe('computeDiscountedPrice', () => {
  it('applies a positive discount', () => {
    expect(computeDiscountedPrice(100, 25)).toBeCloseTo(75, 5);
  });

  it('returns the price when discount is zero', () => {
    expect(computeDiscountedPrice(100, 0)).toBe(100);
  });

  it('returns the price when discount is negative', () => {
    expect(computeDiscountedPrice(100, -10)).toBe(100);
  });

  it('clamps discounts above 100 to 100', () => {
    expect(computeDiscountedPrice(50, 150)).toBe(0);
  });

  it('caps at 100 exactly when discount equals 100', () => {
    expect(computeDiscountedPrice(80, 100)).toBe(0);
  });

  it('returns the original price when price is NaN', () => {
    expect(Number.isNaN(computeDiscountedPrice(NaN, 10))).toBe(true);
  });

  it('returns the original price when discount is NaN', () => {
    expect(computeDiscountedPrice(100, NaN)).toBe(100);
  });

  it('returns the original price when price is Infinity', () => {
    expect(computeDiscountedPrice(Infinity, 10)).toBe(Infinity);
  });
});

describe('isOnSale', () => {
  it('returns true for positive discount', () => {
    expect(isOnSale(10)).toBe(true);
  });

  it('returns false for zero discount', () => {
    expect(isOnSale(0)).toBe(false);
  });

  it('returns false for negative discount', () => {
    expect(isOnSale(-5)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isOnSale(NaN)).toBe(false);
  });
});
