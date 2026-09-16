import type { Product } from './Product';

export interface PaginatedProducts {
  items: Product[];
  total: number;
  skip: number;
  limit: number;
}

export function hasNextPage(page: PaginatedProducts): boolean {
  return page.skip + page.items.length < page.total;
}
