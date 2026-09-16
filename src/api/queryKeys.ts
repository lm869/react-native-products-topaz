import type { ProductListParams } from '@/domain/product/IProductRepository';

export interface ProductsKeyScope {
  list(params: Pick<ProductListParams, 'limit' | 'skip'>): readonly unknown[];
  search(
    q: string,
    params: Pick<ProductListParams, 'limit' | 'skip'>,
  ): readonly unknown[];
  byCategory(
    slug: string,
    params: Pick<ProductListParams, 'limit' | 'skip'>,
  ): readonly unknown[];
  detail(id: number): readonly unknown[];
  categories(): readonly unknown[];
}

export interface QueryKeys {
  products: ProductsKeyScope;
}

export const queryKeys: QueryKeys = {
  products: {
    list: ({ limit, skip }) => ['products', 'list', { limit, skip }] as const,
    search: (q, { limit, skip }) =>
      ['products', 'search', q, { limit, skip }] as const,
    byCategory: (slug, { limit, skip }) =>
      ['products', 'category', slug, { limit, skip }] as const,
    detail: id => ['products', 'detail', id] as const,
    categories: () => ['products', 'categories'] as const,
  },
};
