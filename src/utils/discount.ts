export function computeDiscountedPrice(
  price: number,
  discountPercentage: number,
): number {
  if (!Number.isFinite(price) || !Number.isFinite(discountPercentage)) {
    return price;
  }
  if (discountPercentage <= 0) return price;
  const pct = discountPercentage > 100 ? 100 : discountPercentage;
  return price * (1 - pct / 100);
}

export function isOnSale(discountPercentage: number): boolean {
  return Number.isFinite(discountPercentage) && discountPercentage > 0;
}
