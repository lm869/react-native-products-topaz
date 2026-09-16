import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { isAppError } from '@/api/errors';
import type { AppError } from '@/api/errors';
import type { ProductCategory } from '@/domain/product/ProductCategory';
import { productRepository } from '../repository/productRepository';

export interface UseCategoriesResult {
  items: ProductCategory[];
  isPending: boolean;
  isError: boolean;
  error: AppError | null;
}

export function useCategories(): UseCategoriesResult {
  const query = useQuery<ProductCategory[], Error>({
    queryKey: queryKeys.products.categories(),
    queryFn: ({ signal }) => productRepository.getCategories(signal),
  });

  const appError = query.error && isAppError(query.error) ? query.error : null;

  return {
    items: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    error: appError,
  };
}
