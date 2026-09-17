import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProducts } from '../useProducts';
import { productRepository } from '../../repository/productRepository';
import { NetworkError } from '@/api/errors';
import type { Product } from '@/domain/product/Product';
import type { PaginatedProducts } from '@/domain/product/PaginatedProducts';

jest.mock('../../repository/productRepository', () => ({
  productRepository: {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    searchProducts: jest.fn(),
    getProductsByCategory: jest.fn(),
    getCategories: jest.fn(),
  },
}));

const mockedRepo = productRepository as jest.Mocked<typeof productRepository>;

function makeProduct(id: number): Product {
  return {
    id,
    title: `Product ${id}`,
    description: `Description ${id}`,
    price: 10 * id,
    discountPercentage: 0,
    rating: 4,
    stock: 5,
    category: 'smartphones',
    thumbnail: `https://example.com/${id}.png`,
    images: [],
  };
}

function makePage(
  skip: number,
  limit: number,
  total: number,
): PaginatedProducts {
  const items = Array.from({ length: limit }, (_, i) =>
    makeProduct(skip + i + 1),
  );
  return { items, total, skip, limit };
}

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
  return { wrapper, client };
}

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads initial page successfully', async () => {
    mockedRepo.getProducts.mockResolvedValueOnce(makePage(0, 12, 24));

    const { wrapper } = makeWrapper();
    const { result } = await renderHook(() => useProducts(), { wrapper });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.state).toBe('ALL');
    expect(result.current.items).toHaveLength(12);
    expect(result.current.total).toBe(24);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('exposes an AppError when the repository throws and supports retry', async () => {
    mockedRepo.getProducts
      .mockRejectedValueOnce(new NetworkError())
      .mockResolvedValueOnce(makePage(0, 12, 12));

    const { wrapper } = makeWrapper();
    const { result } = await renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.kind).toBe('network');

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.items).toHaveLength(12);
  });

  it('fetches next page with incremented skip', async () => {
    mockedRepo.getProducts.mockImplementation(({ skip }) =>
      Promise.resolve(makePage(skip ?? 0, 12, 36)),
    );

    const { wrapper } = makeWrapper();
    const { result } = await renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.items).toHaveLength(12);

    await act(async () => {
      result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.items).toHaveLength(24));
    expect(mockedRepo.getProducts).toHaveBeenCalledTimes(2);
    expect(mockedRepo.getProducts.mock.calls[1]?.[0]?.skip).toBe(12);
  });

  it('stops fetching when total is reached', async () => {
    mockedRepo.getProducts.mockResolvedValue(makePage(0, 12, 12));

    const { wrapper } = makeWrapper();
    const { result } = await renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.hasNextPage).toBe(false);

    await act(async () => {
      result.current.fetchNextPage();
    });

    expect(mockedRepo.getProducts).toHaveBeenCalledTimes(1);
  });

  it('treats whitespace-only search as empty (state=ALL)', async () => {
    mockedRepo.getProducts.mockResolvedValueOnce(makePage(0, 12, 12));

    const { wrapper } = makeWrapper();
    const { result } = await renderHook(() => useProducts({ search: '   ' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.state).toBe('ALL');
    expect(mockedRepo.searchProducts).not.toHaveBeenCalled();
  });

  it('uses SEARCHING state when search is provided and clears category', async () => {
    mockedRepo.searchProducts.mockResolvedValueOnce(makePage(0, 12, 5));

    const { wrapper } = makeWrapper();
    const { result } = await renderHook(
      () => useProducts({ search: 'phone', category: 'laptops' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.state).toBe('SEARCHING');
    expect(mockedRepo.searchProducts).toHaveBeenCalledWith(
      'phone',
      expect.objectContaining({ limit: 12, skip: 0 }),
    );
    expect(mockedRepo.getProductsByCategory).not.toHaveBeenCalled();
    expect(mockedRepo.getProducts).not.toHaveBeenCalled();
  });

  it('uses CATEGORY state when category is provided and clears search', async () => {
    mockedRepo.getProductsByCategory.mockResolvedValueOnce(makePage(0, 12, 6));

    const { wrapper } = makeWrapper();
    const { result } = await renderHook(
      () => useProducts({ search: '', category: 'laptops' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.state).toBe('CATEGORY');
    expect(mockedRepo.getProductsByCategory).toHaveBeenCalledWith(
      'laptops',
      expect.objectContaining({ limit: 12, skip: 0 }),
    );
    expect(mockedRepo.searchProducts).not.toHaveBeenCalled();
  });

  it('returns empty items when repository yields total=0', async () => {
    mockedRepo.getProducts.mockResolvedValueOnce({
      items: [],
      total: 0,
      skip: 0,
      limit: 12,
    });

    const { wrapper } = makeWrapper();
    const { result } = await renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.hasNextPage).toBe(false);
  });
});
