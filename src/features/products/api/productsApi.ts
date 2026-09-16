import { request } from '@/api/httpClient';
import type {
  ProductApiDto,
  ProductCategoryDto,
  ProductsResponseDto,
} from './productsDto';

export interface ListParams {
  limit: number;
  skip: number;
  signal?: AbortSignal;
}

export interface ProductsApi {
  list(params: ListParams): Promise<ProductsResponseDto>;
  getById(id: number, signal?: AbortSignal): Promise<ProductApiDto>;
  search(q: string, params: ListParams): Promise<ProductsResponseDto>;
  byCategory(slug: string, params: ListParams): Promise<ProductsResponseDto>;
  categories(signal?: AbortSignal): Promise<ProductCategoryDto[]>;
}

export const productsApi: ProductsApi = {
  async list({ limit, skip, signal }) {
    return request<ProductsResponseDto>({
      path: '/products',
      query: { limit, skip },
      signal,
    });
  },
  async getById(id, signal) {
    return request<ProductApiDto>({
      path: `/products/${id}`,
      signal,
    });
  },
  async search(q, { limit, skip, signal }) {
    return request<ProductsResponseDto>({
      path: '/products/search',
      query: { q, limit, skip },
      signal,
    });
  },
  async byCategory(slug, { limit, skip, signal }) {
    return request<ProductsResponseDto>({
      path: `/products/category/${encodeURIComponent(slug)}`,
      query: { limit, skip },
      signal,
    });
  },
  async categories(signal) {
    return request<ProductCategoryDto[]>({
      path: '/products/categories',
      signal,
    });
  },
};
