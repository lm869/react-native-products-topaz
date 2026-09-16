import type { PaginatedProducts } from './PaginatedProducts';
import type { Product } from './Product';
import type { ProductCategory } from './ProductCategory';

export interface ProductListParams {
  limit: number;
  skip: number;
  signal?: AbortSignal;
}

export interface IProductRepository {
  getProducts(params: ProductListParams): Promise<PaginatedProducts>;
  getProductById(id: number, signal?: AbortSignal): Promise<Product>;
  searchProducts(
    q: string,
    params: ProductListParams,
  ): Promise<PaginatedProducts>;
  getProductsByCategory(
    slug: string,
    params: ProductListParams,
  ): Promise<PaginatedProducts>;
  getCategories(signal?: AbortSignal): Promise<ProductCategory[]>;
}
