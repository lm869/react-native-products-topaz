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
import { SnackbarProvider } from '@/components/SnackbarProvider';
import { useFavoritesStore } from '@/features/favorites/store/favoritesStore';
import { favoritesRepository } from '@/features/favorites/repository/MMKVFavoritesRepository';
import type { FavoriteProduct } from '@/domain/favorites/FavoriteProduct';
import type { RootTabScreenProps } from '@/navigation/types';
import type { ConfirmFn } from '@/components/confirmContext';

jest.mock('@/features/favorites/repository/MMKVFavoritesRepository', () => ({
  favoritesRepository: {
    getAll: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
  },
}));

jest.mock('@/hooks/useConfirm', () => ({
  useConfirm: jest.fn(),
}));

const mockedRepo = favoritesRepository as jest.Mocked<
  typeof favoritesRepository
>;

const mockedUseConfirm = jest.requireMock('@/hooks/useConfirm')
  .useConfirm as jest.MockedFunction<() => ConfirmFn>;

function setConfirmNextResult(value: boolean) {
  mockedUseConfirm.mockReturnValueOnce(() => Promise.resolve(value));
}

function makeFavorite(
  id: number,
  addedAt: number,
  extras: Partial<FavoriteProduct> = {},
): FavoriteProduct {
  return {
    id,
    title: `Fav ${id}`,
    price: id * 10,
    thumbnail: `https://example.com/${id}.png`,
    category: 'smartphones',
    addedAt,
    rating: 4.5,
    discountPercentage: 10,
    originalPrice: (id * 10) / 0.9,
    ...extras,
  };
}

const baseNavigation = {
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
  navigate: jest.fn(),
  addListener: jest.fn(() => () => undefined),
} as unknown as RootTabScreenProps<'FavoritesTab'>['navigation'];

const baseRoute = {
  key: 'favorites',
  name: 'FavoritesTab' as const,
  params: undefined,
};

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

async function renderScreen() {
  const props: RootTabScreenProps<'FavoritesTab'> = {
    route: baseRoute,
    navigation: baseNavigation,
  } as RootTabScreenProps<'FavoritesTab'>;

  const { FavoritesScreen } = require('../FavoritesScreen');
  const { wrapper } = makeWrapper();
  const utils = await render(
    React.createElement(
      ThemeContext.Provider,
      { value: lightTheme },
      React.createElement(
        SnackbarProvider,
        null,
        React.createElement(FavoritesScreen, props),
      ),
    ),
    { wrapper },
  );
  return { ...utils, props };
}

describe('FavoritesScreen (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseConfirm.mockReturnValue(jest.fn(() => Promise.resolve(false)));
    useFavoritesStore.setState({
      byId: {},
      isHydrated: true,
      lastClearedSnapshot: [],
    });
  });

  it('renders hero, counter, and three favorites when store has items', async () => {
    useFavoritesStore.setState({
      byId: {
        1: makeFavorite(1, 3000),
        2: makeFavorite(2, 2000),
        3: makeFavorite(3, 1000),
      },
      isHydrated: true,
    });

    await renderScreen();

    expect(screen.getByText('Your Saved Pieces')).toBeTruthy();
    expect(screen.getByText('3 items')).toBeTruthy();
    expect(screen.getByText('Fav 1')).toBeTruthy();
    expect(screen.getByText('Fav 2')).toBeTruthy();
    expect(screen.getByText('Fav 3')).toBeTruthy();
    expect(screen.getByText('Clear all')).toBeTruthy();
  });

  it('uses singular noun when only one favorite exists', async () => {
    useFavoritesStore.setState({
      byId: { 1: makeFavorite(1, 1000) },
      isHydrated: true,
    });

    await renderScreen();

    expect(screen.getByText('1 item')).toBeTruthy();
  });

  it('shows empty state when favorites list is empty', async () => {
    useFavoritesStore.setState({ byId: {}, isHydrated: true });

    await renderScreen();

    expect(
      screen.getByText(
        'Items you favorite in the catalog will sync and appear here automatically.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Your atelier is empty')).toBeTruthy();
    expect(screen.queryByText('Your Saved Pieces')).toBeNull();
  });

  it('clear-all: confirm accepted → store cleared + snackbar shows Undo', async () => {
    const confirmFn = jest.fn(() => Promise.resolve(true));
    mockedUseConfirm.mockReturnValue(confirmFn);

    useFavoritesStore.setState({
      byId: {
        1: makeFavorite(1, 3000),
        2: makeFavorite(2, 2000),
        3: makeFavorite(3, 1000),
      },
      isHydrated: true,
    });

    await renderScreen();

    fireEvent.press(screen.getByText('Clear all'));

    await waitFor(() => {
      expect(confirmFn).toHaveBeenCalledTimes(1);
      expect(useFavoritesStore.getState().byId).toEqual({});
    });

    expect(confirmFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Clear all favorites?',
        confirmLabel: 'Clear all',
      }),
    );

    expect(
      screen.getByText(
        'Items you favorite in the catalog will sync and appear here automatically.',
      ),
    ).toBeTruthy();

    expect(screen.getByText('All favorites removed')).toBeTruthy();
    expect(screen.getByText('UNDO')).toBeTruthy();

    fireEvent.press(screen.getByText('UNDO'));

    await waitFor(() => {
      expect(useFavoritesStore.getState().byId[1]).toBeDefined();
      expect(useFavoritesStore.getState().byId[2]).toBeDefined();
      expect(useFavoritesStore.getState().byId[3]).toBeDefined();
    });
  });

  it('clear-all: confirm canceled → no changes', async () => {
    setConfirmNextResult(false);

    useFavoritesStore.setState({
      byId: { 1: makeFavorite(1, 1000) },
      isHydrated: true,
    });

    await renderScreen();

    fireEvent.press(screen.getByText('Clear all'));

    await waitFor(() => {
      expect(useFavoritesStore.getState().byId[1]).toBeDefined();
    });
    expect(mockedRepo.remove).not.toHaveBeenCalled();
  });

  it('swipeable delete: confirm accepted → removes entry + shows undo', async () => {
    const confirmFn = jest.fn(() => Promise.resolve(true));
    mockedUseConfirm.mockReturnValue(confirmFn);

    useFavoritesStore.setState({
      byId: { 2: makeFavorite(2, 1000) },
      isHydrated: true,
    });

    await renderScreen();

    const deleteBtn = screen.getByLabelText('Delete Fav 2');
    expect(deleteBtn).toBeTruthy();

    fireEvent.press(deleteBtn);

    await waitFor(() => {
      expect(confirmFn).toHaveBeenCalledTimes(1);
    });

    expect(confirmFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Remove favorite?',
        message: 'Fav 2',
        confirmLabel: 'Delete',
      }),
    );

    await waitFor(() => {
      expect(useFavoritesStore.getState().byId[2]).toBeUndefined();
    });

    expect(screen.getByText(/Removed Fav 2/i)).toBeTruthy();
    expect(screen.getByText('UNDO')).toBeTruthy();

    fireEvent.press(screen.getByText('UNDO'));

    await waitFor(() => {
      expect(useFavoritesStore.getState().byId[2]).toBeDefined();
    });
  });

  it('swipeable delete: confirm canceled → entry preserved, no snackbar', async () => {
    setConfirmNextResult(false);

    useFavoritesStore.setState({
      byId: { 2: makeFavorite(2, 1000) },
      isHydrated: true,
    });

    await renderScreen();

    fireEvent.press(screen.getByLabelText('Delete Fav 2'));

    await waitFor(() => {
      expect(useFavoritesStore.getState().byId[2]).toBeDefined();
    });
    expect(screen.queryByText(/Removed Fav 2/i)).toBeNull();
  });

  it('swipeable delete: registers reset callback on mount (cancel resets row)', async () => {
    setConfirmNextResult(false);

    useFavoritesStore.setState({
      byId: { 7: makeFavorite(7, 1000) },
      isHydrated: true,
    });

    await renderScreen();

    expect(screen.getByLabelText('Delete Fav 7')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Delete Fav 7'));

    await waitFor(() => {
      expect(useFavoritesStore.getState().byId[7]).toBeDefined();
    });
  });

  it('navigates to product detail when the favorite item is pressed', async () => {
    useFavoritesStore.setState({
      byId: { 5: makeFavorite(5, 1000) },
      isHydrated: true,
    });

    await renderScreen();

    const navigateSpy = baseNavigation.navigate as jest.Mock;
    navigateSpy.mockClear();

    fireEvent.press(screen.getByText('Fav 5'));

    expect(navigateSpy).toHaveBeenCalledWith('ProductsTab', {
      screen: 'ProductDetail',
      params: { productId: 5 },
    });
  });
});
