import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { isAppError, type AppError } from '@/api/errors';
import type { Product } from '@/domain/product/Product';
import { productRepository } from '../repository/productRepository';

export interface UseProductResult {
  product: Product | undefined;
  isPending: boolean;
  isError: boolean;
  isNotFound: boolean;
  error: AppError | null;
  refetch: () => void;
}

export function useProduct(id: number): UseProductResult {
  const query = useQuery<Product, Error>({
    queryKey: queryKeys.products.detail(id),
    queryFn: ({ signal }) => productRepository.getProductById(id, signal),
  });

  const appError: AppError | null =
    query.error && isAppError(query.error) ? query.error : null;

  const isNotFound = appError?.kind === 'http' && appError.status === 404;

  return {
    product: query.data,
    isPending: query.isPending,
    isError: query.isError,
    isNotFound,
    error: appError,
    refetch: () => {
      query.refetch().catch(() => undefined);
    },
  };
}
