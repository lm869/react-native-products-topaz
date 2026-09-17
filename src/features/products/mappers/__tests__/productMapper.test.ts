import {
  mapProductDto,
  mapProductsResponseDto,
  mapCategoryDto,
} from '../productMapper';
import type {
  ProductApiDto,
  ProductsResponseDto,
  ProductCategoryDto,
} from '../../api/productsDto';

const baseDto: ProductApiDto = {
  id: 1,
  title: 'iPhone 9',
  description: 'An apple mobile',
  category: 'smartphones',
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  thumbnail: 'https://example.com/iphone.png',
  images: ['https://example.com/iphone-1.png'],
};

describe('mapProductDto', () => {
  it('maps a minimal DTO with required fields only', () => {
    const product = mapProductDto(baseDto);

    expect(product.id).toBe(1);
    expect(product.title).toBe('iPhone 9');
    expect(product.description).toBe('An apple mobile');
    expect(product.price).toBe(549);
    expect(product.discountPercentage).toBe(12.96);
    expect(product.rating).toBe(4.69);
    expect(product.stock).toBe(94);
    expect(product.category).toBe('smartphones');
    expect(product.thumbnail).toBe('https://example.com/iphone.png');
    expect(product.images).toEqual(['https://example.com/iphone-1.png']);
  });

  it('does not set secondary fields when DTO omits them', () => {
    const product = mapProductDto(baseDto);

    expect(product.brand).toBeUndefined();
    expect(product.tags).toBeUndefined();
    expect(product.availabilityStatus).toBeUndefined();
    expect(product.shippingInformation).toBeUndefined();
    expect(product.warrantyInformation).toBeUndefined();
    expect(product.returnPolicy).toBeUndefined();
  });

  it('includes secondary fields when present in DTO', () => {
    const full: ProductApiDto = {
      ...baseDto,
      brand: 'Apple',
      tags: ['smartphone', 'ios'],
      availabilityStatus: 'In Stock',
      shippingInformation: 'Ships in 1 day',
      warrantyInformation: '1 year',
      returnPolicy: '30 days',
    };

    const product = mapProductDto(full);

    expect(product.brand).toBe('Apple');
    expect(product.tags).toEqual(['smartphone', 'ios']);
    expect(product.availabilityStatus).toBe('In Stock');
    expect(product.shippingInformation).toBe('Ships in 1 day');
    expect(product.warrantyInformation).toBe('1 year');
    expect(product.returnPolicy).toBe('30 days');
  });

  it('falls back to empty array when images is undefined', () => {
    const dto: ProductApiDto = {
      ...baseDto,
      images: undefined as unknown as string[],
    };
    const product = mapProductDto(dto);

    expect(product.images).toEqual([]);
  });
});

describe('mapProductsResponseDto', () => {
  it('maps products, total, skip and limit', () => {
    const response: ProductsResponseDto = {
      products: [baseDto, { ...baseDto, id: 2, title: 'iPhone X' }],
      total: 100,
      skip: 0,
      limit: 2,
    };

    const paginated = mapProductsResponseDto(response);

    expect(paginated.items).toHaveLength(2);
    expect(paginated.items[0]?.id).toBe(1);
    expect(paginated.items[1]?.id).toBe(2);
    expect(paginated.total).toBe(100);
    expect(paginated.skip).toBe(0);
    expect(paginated.limit).toBe(2);
  });

  it('handles an empty products list', () => {
    const response: ProductsResponseDto = {
      products: [],
      total: 0,
      skip: 0,
      limit: 12,
    };

    const paginated = mapProductsResponseDto(response);

    expect(paginated.items).toEqual([]);
    expect(paginated.total).toBe(0);
  });
});

describe('mapCategoryDto', () => {
  it('builds a category from a raw string slug', () => {
    expect(mapCategoryDto('smartphones')).toEqual({
      slug: 'smartphones',
      name: 'Smartphones',
    });
  });

  it('passes through an object with name', () => {
    const raw: ProductCategoryDto = {
      slug: 'mens-watches',
      name: "Men's Watches",
      url: 'https://example.com/c/mens-watches',
    };

    expect(mapCategoryDto(raw)).toEqual({
      slug: 'mens-watches',
      name: "Men's Watches",
    });
  });

  it('falls back to titleCase from slug when object has no name', () => {
    const raw: ProductCategoryDto = {
      slug: 'home-decoration',
      name: undefined as unknown as string,
      url: 'https://example.com/c/home-decoration',
    };

    expect(mapCategoryDto(raw).name).toBe('Home decoration');
  });
});
