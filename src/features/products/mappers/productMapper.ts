import type { Product } from '@/domain/product/Product';
import type { ProductCategory } from '@/domain/product/ProductCategory';
import type { PaginatedProducts } from '@/domain/product/PaginatedProducts';
import type {
  ProductApiDto,
  ProductsResponseDto,
  RawCategoryDto,
} from '../api/productsDto';

function titleCaseFromSlug(slug: string): string {
  const spaced = slug.replace(/[-_]+/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function mapProductDto(dto: ProductApiDto): Product {
  const product: Product = {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    price: dto.price,
    discountPercentage: dto.discountPercentage,
    rating: dto.rating,
    stock: dto.stock,
    category: dto.category,
    thumbnail: dto.thumbnail,
    images: dto.images ?? [],
  };
  if (dto.brand !== undefined) product.brand = dto.brand;
  if (dto.tags !== undefined) product.tags = dto.tags;
  if (dto.availabilityStatus !== undefined)
    product.availabilityStatus = dto.availabilityStatus;
  if (dto.shippingInformation !== undefined)
    product.shippingInformation = dto.shippingInformation;
  if (dto.warrantyInformation !== undefined)
    product.warrantyInformation = dto.warrantyInformation;
  if (dto.returnPolicy !== undefined) product.returnPolicy = dto.returnPolicy;
  return product;
}

export function mapProductsResponseDto(
  dto: ProductsResponseDto,
): PaginatedProducts {
  return {
    items: dto.products.map(mapProductDto),
    total: dto.total,
    skip: dto.skip,
    limit: dto.limit,
  };
}

export function mapCategoryDto(raw: RawCategoryDto): ProductCategory {
  if (typeof raw === 'string') {
    return { slug: raw, name: titleCaseFromSlug(raw) };
  }
  return {
    slug: raw.slug,
    name: raw.name ?? titleCaseFromSlug(raw.slug),
  };
}
