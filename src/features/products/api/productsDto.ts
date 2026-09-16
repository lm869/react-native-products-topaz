export interface ProductApiDto {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  brand?: string;
  tags?: string[];
  availabilityStatus?: string;
  shippingInformation?: string;
  warrantyInformation?: string;
  returnPolicy?: string;
}

export interface ProductsResponseDto {
  products: ProductApiDto[];
  total: number;
  skip: number;
  limit: number;
}

export type RawCategoryDto = string | ProductCategoryDto;

export interface ProductCategoryDto {
  slug: string;
  name: string;
  url: string;
}
