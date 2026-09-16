import type {
  IProductRepository,
  ProductListParams,
} from '@/domain/product/IProductRepository';
import type { PaginatedProducts } from '@/domain/product/PaginatedProducts';
import type { Product } from '@/domain/product/Product';
import type { ProductCategory } from '@/domain/product/ProductCategory';
import {
  mapCategoryDto,
  mapProductDto,
  mapProductsResponseDto,
} from '../mappers/productMapper';
import { productsApi } from '../api/productsApi';

export class DummyJsonProductRepository implements IProductRepository {
  async getProducts(params: ProductListParams): Promise<PaginatedProducts> {
    const dto = await productsApi.list(params);
    return mapProductsResponseDto(dto);
  }

  async getProductById(id: number, signal?: AbortSignal): Promise<Product> {
    const dto = await productsApi.getById(id, signal);
    return mapProductDto(dto);
  }

  async searchProducts(
    q: string,
    params: ProductListParams,
  ): Promise<PaginatedProducts> {
    const dto = await productsApi.search(q, params);
    return mapProductsResponseDto(dto);
  }

  async getProductsByCategory(
    slug: string,
    params: ProductListParams,
  ): Promise<PaginatedProducts> {
    const dto = await productsApi.byCategory(slug, params);
    return mapProductsResponseDto(dto);
  }

  async getCategories(signal?: AbortSignal): Promise<ProductCategory[]> {
    const dto = await productsApi.categories(signal);
    return dto.map(mapCategoryDto);
  }
}
