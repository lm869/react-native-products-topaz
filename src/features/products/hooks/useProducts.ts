import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { isAppError, type AppError } from '@/api/errors';
import type { Product } from '@/domain/product/Product';
import type { PaginatedProducts } from '@/domain/product/PaginatedProducts';
import { productRepository } from '../repository/productRepository';

const PAGE_SIZE = 12;

export type UseProductsState = 'ALL' | 'SEARCHING' | 'CATEGORY';

export interface UseProductsInput {
  search?: string;
  category?: string | null;
}

export interface UseProductsResult {
  state: UseProductsState;
  items: Product[];
  total: number;
  isPending: boolean;
  isError: boolean;
  error: AppError | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  refetch: () => void;
}

function trimSearch(search: string | undefined): string {
  if (!search) return '';
  return search.trim();
}

export function useProducts(input: UseProductsInput = {}): UseProductsResult {
  const search = trimSearch(input.search);
  const category = input.category ?? null;

  const state: UseProductsState = useMemo(() => {
    if (search) return 'SEARCHING';
    if (category) return 'CATEGORY';
    return 'ALL';
  }, [search, category]);

  const query = useInfiniteQuery<PaginatedProducts, Error>({
    queryKey:
      state === 'SEARCHING'
        ? queryKeys.products.search(search, { limit: PAGE_SIZE, skip: 0 })
        : state === 'CATEGORY' && category
        ? queryKeys.products.byCategory(category, { limit: PAGE_SIZE, skip: 0 })
        : queryKeys.products.list({ limit: PAGE_SIZE, skip: 0 }),
    queryFn: ({ pageParam, signal }) => {
      const skip = typeof pageParam === 'number' ? pageParam : 0;
      const params = { limit: PAGE_SIZE, skip, signal };
      if (state === 'SEARCHING') {
        return productRepository.searchProducts(search, params);
      }
      if (state === 'CATEGORY' && category) {
        return productRepository.getProductsByCategory(category, params);
      }
      return productRepository.getProducts(params);
    },
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const next = lastPage.skip + lastPage.items.length;
      return next < lastPage.total ? next : undefined;
    },
  });

  const items: Product[] = useMemo(() => {
    if (!query.data) return [];
    return query.data.pages.flatMap(p => p.items);
  }, [query.data]);

  const total: number = useMemo(() => {
    if (!query.data || query.data.pages.length === 0) return 0;
    const last = query.data.pages[query.data.pages.length - 1];
    return last ? last.total : 0;
  }, [query.data]);

  const appError: AppError | null =
    query.error && isAppError(query.error) ? query.error : null;

  return {
    state,
    items,
    total,
    isPending: query.isPending,
    isError: query.isError,
    error: appError,
    hasNextPage: query.hasNextPage === true,
    fetchNextPage: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage().catch(() => undefined);
      }
    },
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: () => {
      query.refetch().catch(() => undefined);
    },
  };
}
