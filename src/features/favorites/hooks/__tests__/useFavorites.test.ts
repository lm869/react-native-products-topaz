import { renderHook, act } from '@testing-library/react-native';
import {
  useFavoritesStore,
  selectFavoriteList,
  selectIsFavorite,
} from '../../store/favoritesStore';
import { useFavorites } from '../useFavorites';
import { favoritesRepository } from '../../repository/MMKVFavoritesRepository';
import type { FavoriteProduct } from '@/domain/favorites/FavoriteProduct';
import type { Product } from '@/domain/product/Product';

jest.mock('../../repository/MMKVFavoritesRepository', () => ({
  favoritesRepository: {
    getAll: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
  },
}));

const mockedRepo = favoritesRepository as jest.Mocked<
  typeof favoritesRepository
>;

function makeFavorite(id: number, addedAt: number): FavoriteProduct {
  return {
    id,
    title: `Fav ${id}`,
    price: id * 10,
    thumbnail: `https://example.com/${id}.png`,
    category: 'smartphones',
    addedAt,
  };
}

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

describe('useFavorites (store-driven)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFavoritesStore.setState({ byId: {}, isHydrated: false });
  });

  it('returns an empty list before hydration', async () => {
    const { result } = await renderHook(() => useFavorites());

    expect(result.current.items).toEqual([]);
    expect(result.current.isHydrated).toBe(false);
    expect(mockedRepo.getAll).not.toHaveBeenCalled();
  });

  it('hydrates from repository on first hydrate() call', async () => {
    const stored = [makeFavorite(1, 1000), makeFavorite(2, 500)];
    mockedRepo.getAll.mockReturnValueOnce(stored);

    await act(async () => {
      useFavoritesStore.getState().hydrate();
    });

    const { result } = await renderHook(() => useFavorites());

    expect(result.current.isHydrated).toBe(true);
    expect(result.current.items).toHaveLength(2);
    expect(mockedRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it('does not re-read storage on subsequent hydrate() calls', async () => {
    mockedRepo.getAll.mockReturnValue([]);

    await act(async () => {
      useFavoritesStore.getState().hydrate();
    });
    await act(async () => {
      useFavoritesStore.getState().hydrate();
    });

    expect(mockedRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it('adds a favorite and persists via the repository', async () => {
    mockedRepo.getAll.mockReturnValue([]);

    await act(async () => {
      useFavoritesStore.getState().hydrate();
    });

    const product = makeProduct(7);

    await act(async () => {
      useFavoritesStore.getState().add(product);
    });

    expect(mockedRepo.save).toHaveBeenCalledTimes(1);
    expect(useFavoritesStore.getState().byId[7]?.id).toBe(7);

    const { result } = await renderHook(() => useFavorites());
    expect(result.current.items).toHaveLength(1);
  });

  it('removes a favorite and persists via the repository', async () => {
    mockedRepo.getAll.mockReturnValue([makeFavorite(3, 1000)]);

    await act(async () => {
      useFavoritesStore.getState().hydrate();
    });

    await act(async () => {
      useFavoritesStore.getState().remove(3);
    });

    expect(mockedRepo.remove).toHaveBeenCalledWith(3);
    expect(useFavoritesStore.getState().byId[3]).toBeUndefined();
  });

  it('toggle alternates between add and remove', async () => {
    mockedRepo.getAll.mockReturnValue([]);

    await act(async () => {
      useFavoritesStore.getState().hydrate();
    });

    const product = makeProduct(9);

    await act(async () => {
      useFavoritesStore.getState().toggle(product);
    });
    expect(useFavoritesStore.getState().byId[9]).toBeDefined();
    expect(mockedRepo.save).toHaveBeenCalledTimes(1);

    await act(async () => {
      useFavoritesStore.getState().toggle(product);
    });
    expect(useFavoritesStore.getState().byId[9]).toBeUndefined();
    expect(mockedRepo.remove).toHaveBeenCalledWith(9);
  });

  it('updates one subscriber when another mutates the store (reactive cross-screen)', async () => {
    mockedRepo.getAll.mockReturnValue([]);

    await act(async () => {
      useFavoritesStore.getState().hydrate();
    });

    const { result: listA } = await renderHook(() => useFavorites());
    const { result: listB } = await renderHook(() => useFavorites());

    expect(listA.current.items).toHaveLength(0);
    expect(listB.current.items).toHaveLength(0);

    await act(async () => {
      useFavoritesStore.getState().add(makeProduct(11));
    });

    expect(listA.current.items).toHaveLength(1);
    expect(listA.current.items[0]?.id).toBe(11);
    expect(listB.current.items).toHaveLength(1);
    expect(listB.current.items[0]?.id).toBe(11);

    await act(async () => {
      useFavoritesStore.getState().add(makeProduct(12));
    });

    expect(listA.current.items).toHaveLength(2);
    expect(listA.current.items[0]?.id).toBe(12);
    expect(listA.current.items[1]?.id).toBe(11);
  });

  it('selector helpers reflect store state correctly', () => {
    useFavoritesStore.setState({
      byId: {
        1: makeFavorite(1, 1000),
        2: makeFavorite(2, 500),
      },
      isHydrated: true,
    });

    expect(selectIsFavorite(1)(useFavoritesStore.getState())).toBe(true);
    expect(selectIsFavorite(99)(useFavoritesStore.getState())).toBe(false);

    const list = selectFavoriteList(useFavoritesStore.getState());
    expect(list[0]?.id).toBe(1);
    expect(list[1]?.id).toBe(2);
  });

  it('returns a stable items reference across re-renders when byId is unchanged (regression: Maximum update depth)', async () => {
    await act(async () => {
      useFavoritesStore.setState({
        byId: { 1: makeFavorite(1, 1000) },
        isHydrated: true,
      });
    });

    const { result, rerender } = await renderHook(() => useFavorites());

    const firstItems = result.current?.items;
    expect(firstItems).toHaveLength(1);
    expect(result.current?.isHydrated).toBe(true);

    rerender(() => useFavorites());
    rerender(() => useFavorites());
    rerender(() => useFavorites());

    expect(result.current?.items).toBe(firstItems);
  });
});
