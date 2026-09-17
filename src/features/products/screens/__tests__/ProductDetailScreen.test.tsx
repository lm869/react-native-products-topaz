import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeContext } from '@/theme/ThemeContext';
import { lightTheme } from '@/theme/lightTheme';
import { useFavoritesStore } from '@/features/favorites/store/favoritesStore';
import type { Product } from '@/domain/product/Product';
import type { UseProductResult } from '@/features/products/hooks/useProduct';
import type { ProductsStackScreenProps } from '@/navigation/types';

jest.mock('@/features/products/hooks/useProduct', () => ({
  useProduct: jest.fn(),
}));

const useProductMock = jest.requireMock('@/features/products/hooks/useProduct')
  .useProduct as jest.MockedFunction<(id: number) => UseProductResult>;

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 42,
    title: 'Essence Mascara Lash Princess',
    description: 'A popular mascara',
    price: 9.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 99,
    category: 'beauty',
    brand: 'Essence',
    thumbnail: 'https://example.com/m.png',
    images: ['https://example.com/m1.png', 'https://example.com/m2.png'],
    tags: ['mascara', 'beauty'],
    availabilityStatus: 'In Stock',
    shippingInformation: 'Ships in 1-2 days',
    warrantyInformation: '1 week',
    returnPolicy: 'No returns',
    ...overrides,
  };
}

const baseRoute = {
  key: 'detail',
  name: 'ProductDetail' as const,
  params: { productId: 42 },
};

const baseNavigation = {
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
} as unknown as ProductsStackScreenProps<'ProductDetail'>['navigation'];

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      SafeAreaProvider,
      {
        initialMetrics: {
          frame,
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        },
      },
      React.createElement(QueryClientProvider, { client }, children),
    );
  return { wrapper, client };
}

async function renderScreen(productId = 42) {
  const props: ProductsStackScreenProps<'ProductDetail'> = {
    route: { ...baseRoute, params: { productId } },
    navigation: baseNavigation,
  } as ProductsStackScreenProps<'ProductDetail'>;

  // dynamic import to keep mocks hoisted
  const { ProductDetailScreen } = require('../ProductDetailScreen');
  const { wrapper } = makeWrapper();
  const utils = await render(
    React.createElement(
      ThemeContext.Provider,
      { value: lightTheme },
      React.createElement(ProductDetailScreen, props),
    ),
    { wrapper },
  );
  return { ...utils, props };
}

describe('ProductDetailScreen (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFavoritesStore.setState({ byId: {}, isHydrated: true });
  });

  it('renders product title, price and description when loaded', async () => {
    useProductMock.mockReturnValue({
      product: makeProduct(),
      isPending: false,
      isError: false,
      isNotFound: false,
      error: null,
      refetch: jest.fn(),
    });

    await renderScreen();

    expect(screen.getByText('Essence Mascara Lash Princess')).toBeTruthy();
    expect(screen.getByText(/\$\s?9/)).toBeTruthy();
    expect(screen.getByText('A popular mascara')).toBeTruthy();
  });

  it('renders ProductDetailSkeleton while pending', async () => {
    useProductMock.mockReturnValue({
      product: undefined,
      isPending: true,
      isError: false,
      isNotFound: false,
      error: null,
      refetch: jest.fn(),
    });

    await renderScreen();

    expect(screen.queryByText('Essence Mascara Lash Princess')).toBeNull();
    expect(useFavoritesStore.getState().byId[42]).toBeUndefined();
  });

  it('renders the not-found empty state when product is missing', async () => {
    useProductMock.mockReturnValue({
      product: undefined,
      isPending: false,
      isError: true,
      isNotFound: true,
      error: {
        kind: 'http',
        name: 'HttpError',
        status: 404,
      } as UseProductResult['error'],
      refetch: jest.fn(),
    });

    await renderScreen();

    expect(screen.getByText('Product not found')).toBeTruthy();
    expect(screen.getByText('Go back')).toBeTruthy();
  });

  it('renders ErrorState for non-404 errors', async () => {
    useProductMock.mockReturnValue({
      product: undefined,
      isPending: false,
      isError: true,
      isNotFound: false,
      error: {
        kind: 'network',
        name: 'NetworkError',
      } as UseProductResult['error'],
      refetch: jest.fn(),
    });

    await renderScreen();

    expect(screen.getByText(/No connection|Check your network/i)).toBeTruthy();
  });

  it('toggles favorite state when the FavoriteButton is pressed (AC-FAV-001)', async () => {
    useProductMock.mockReturnValue({
      product: makeProduct(),
      isPending: false,
      isError: false,
      isNotFound: false,
      error: null,
      refetch: jest.fn(),
    });

    await renderScreen();

    const addBtn = screen.getByLabelText('Add to favorites');
    expect(addBtn).toBeTruthy();

    fireEvent.press(addBtn);

    await waitFor(() => {
      expect(useFavoritesStore.getState().byId[42]).toBeDefined();
    });
    expect(useFavoritesStore.getState().byId[42]?.id).toBe(42);

    expect(screen.getByLabelText('Remove from favorites')).toBeTruthy();
    expect(screen.queryByLabelText('Add to favorites')).toBeNull();

    fireEvent.press(screen.getByLabelText('Remove from favorites'));

    await waitFor(() => {
      expect(useFavoritesStore.getState().byId[42]).toBeUndefined();
    });
    expect(screen.getByLabelText('Add to favorites')).toBeTruthy();
  });

  it('reflects an already-favorited product on mount', async () => {
    useFavoritesStore.setState({
      byId: {
        42: {
          id: 42,
          title: 'Essence Mascara Lash Princess',
          price: 9.99,
          thumbnail: 'https://example.com/m.png',
          category: 'beauty',
          brand: 'Essence',
          addedAt: 1,
        },
      },
      isHydrated: true,
    });

    useProductMock.mockReturnValue({
      product: makeProduct(),
      isPending: false,
      isError: false,
      isNotFound: false,
      error: null,
      refetch: jest.fn(),
    });

    await renderScreen();

    expect(screen.getByLabelText('Remove from favorites')).toBeTruthy();
  });
});
