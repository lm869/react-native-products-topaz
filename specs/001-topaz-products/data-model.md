# Data Model — topazProducts

Three layers, three responsibilities.

- **DTOs** (DummyJSON contract) live at `src/features/products/api/productsDto.ts`
- **Application models** (consumed by UI/hooks) live at `src/domain/product/`
- **Persisted model** (MMKV) lives at `src/domain/favorites/FavoriteProduct.ts`

## Layer 1 — API DTOs (DummyJSON contract)

```ts
// src/features/products/api/productsDto.ts
export interface DimensionsDto {
  width: number; height: number; depth: number;
}
export interface ReviewDto {
  rating: number; comment: string; date: string;
  reviewerName: string; reviewerEmail: string;
}
export interface MetaDto {
  createdAt: string; updatedAt: string;
  barcode: string; qrCode: string;
}
export interface ProductApiDto {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: DimensionsDto;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ReviewDto[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: MetaDto;
  thumbnail: string;
  images: string[];
}

// src/features/products/api/productsDto.ts (continued)
export interface ProductsResponseDto {
  products: ProductApiDto[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductCategoryDto {
  slug: string;
  name: string;
  url: string;
}
```

## Layer 2 — Application Models

```ts
// src/domain/product/Product.ts
export interface Money { amount: number; currency: string; }

export interface Product {
  id: number;
  title: string;
  description: string;
  category: ProductCategory;
  price: Money;
  discountedPrice: Money;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string | null;
  thumbnail: string;
  images: string[];
  availabilityStatus: string | null;
  shippingInformation: string | null;
  warrantyInformation: string | null;
  returnPolicy: string | null;
}

// src/domain/product/ProductCategory.ts
export interface ProductCategory { slug: string; name: string; }

// src/domain/product/PaginatedProducts.ts
export interface PaginatedProducts {
  items: Product[];
  total: number;
  skip: number;
  limit: number;
  hasNextPage: boolean;
  nextSkip: number | null;
}
```

`PaginatedProducts.hasNextPage` and `nextSkip` are computed in the mapper:
- `hasNextPage = items.length < total`
- `nextSkip = hasNextPage ? skip + limit : null`

## Layer 3 — Persisted Model (MMKV)

```ts
// src/domain/favorites/FavoriteProduct.ts
export interface FavoriteProduct {
  id: number;
  title: string;
  thumbnail: string;
  price: Money;
  discountPercentage: number;
  rating: number;
  addedAt: number; // epoch ms
}
```

**Why not store full `Product`:**
1. `FavoritesScreen` only renders the visual minimum (id, title, thumbnail,
   price, discount, rating). Storing the rest wastes MMKV footprint.
2. API schema may change; persisted model is a contract owned by the app.
3. The note in the requirements explicitly forbids storing only IDs because
   it would force an API call to render `FavoritesScreen`. `FavoriteProduct`
   satisfies both: offline-renderable AND minimum footprint.

## Mappers

```ts
// src/features/products/mappers/productMapper.ts
import { computeDiscountedPrice } from '@/utils/discount';
import type { ProductApiDto, ProductsResponseDto, ProductCategoryDto } from '@/features/products/api/productsDto';
import type { Product, ProductCategory, PaginatedProducts } from '@/domain/product';

export function mapProductDto(dto: ProductApiDto): Product {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    category: { slug: dto.category, name: dto.category },
    price: { amount: dto.price, currency: 'USD' },
    discountedPrice: {
      amount: computeDiscountedPrice(dto.price, dto.discountPercentage),
      currency: 'USD',
    },
    discountPercentage: dto.discountPercentage,
    rating: dto.rating,
    stock: dto.stock,
    tags: dto.tags ?? [],
    brand: dto.brand ?? null,
    thumbnail: dto.thumbnail,
    images: dto.images ?? [],
    availabilityStatus: dto.availabilityStatus ?? null,
    shippingInformation: dto.shippingInformation ?? null,
    warrantyInformation: dto.warrantyInformation ?? null,
    returnPolicy: dto.returnPolicy ?? null,
  };
}

export function mapProductsResponseDto(
  dto: ProductsResponseDto,
): PaginatedProducts {
  const items = dto.products.map(mapProductDto);
  return {
    items,
    total: dto.total,
    skip: dto.skip,
    limit: dto.limit,
    hasNextPage: items.length < dto.total,
    nextSkip: items.length < dto.total ? dto.skip + dto.limit : null,
  };
}

export function mapCategoryDto(dto: ProductCategoryDto): ProductCategory {
  return { slug: dto.slug, name: dto.name };
}
```

## Cross-Layer Map

```
ProductApiDto ─mapProductDto──► Product
ProductsResponseDto ─mapProductsResponseDto──► PaginatedProducts
ProductCategoryDto ─mapCategoryDto──► ProductCategory
Product ─(select fields)──► FavoriteProduct
```

## Error Types

```ts
// src/api/errors.ts
export interface NetworkError extends Error { kind: 'network'; cause?: unknown }
export interface TimeoutError extends Error { kind: 'timeout'; timeoutMs: number }
export interface HttpError extends Error {
  kind: 'http'; status: number; statusText: string; url: string; body?: unknown
}
export interface ParseError extends Error { kind: 'parse'; cause?: unknown }
export interface UnknownAppError extends Error { kind: 'unknown'; cause?: unknown }
export type AppError = NetworkError | TimeoutError | HttpError | ParseError | UnknownAppError;
```

## Repository Interfaces (Domain Contracts)

```ts
// src/domain/product/IProductRepository.ts
export interface IProductRepository {
  getProducts(p: {limit: number; skip: number; signal?: AbortSignal}): Promise<PaginatedProducts>;
  getProductById(id: number, signal?: AbortSignal): Promise<Product>;
  searchProducts(q: string, p: {limit: number; skip: number; signal?: AbortSignal}): Promise<PaginatedProducts>;
  getProductsByCategory(slug: string, p: {limit: number; skip: number; signal?: AbortSignal}): Promise<PaginatedProducts>;
  getCategories(signal?: AbortSignal): Promise<ProductCategory[]>;
}

// src/domain/favorites/IFavoritesRepository.ts
export interface IFavoritesRepository {
  getAll(): FavoriteProduct[];
  save(fav: FavoriteProduct): void;
  remove(id: number): void;
  exists(id: number): boolean;
}
```

Concrete implementations:
- `src/features/products/repository/DummyJsonProductRepository.ts` — implements
  `IProductRepository` using `productsApi` + `productMapper`.
- `src/features/favorites/repository/MMKVFavoritesRepository.ts` — implements
  `IFavoritesRepository` using `src/storage/mmkv.ts`.

The composition root (`src/AppProviders.tsx`) wires the concrete impls into
hooks via TanStack Query or Zustand factories.

## Type Invariants (tested)

- INV-001: `mapProductDto(dto).brand === null` whenever `dto.brand` is undefined
- INV-002: `mapProductsResponseDto(dto).hasNextPage === (items.length < total)`
- INV-003: `mapProductsResponseDto(dto).nextSkip === null` when exhausted
- INV-004: `FavoriteProduct.addedAt` is set by the repository at save time
- INV-005: `Money.currency` is always a valid ISO 4217 code
- INV-006: `src/domain/*` files have zero non-type imports outside `src/domain/`
