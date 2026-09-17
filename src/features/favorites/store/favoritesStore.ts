import { create } from 'zustand';
import type { FavoriteProduct } from '@/domain/favorites/FavoriteProduct';
import type { Product } from '@/domain/product/Product';
import { favoritesRepository } from '../repository/MMKVFavoritesRepository';

type FavoriteEntry = FavoriteProduct;

function fromProduct(product: Product): FavoriteEntry {
  const entry: FavoriteEntry = {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    category: product.category,
    addedAt: Date.now(),
  };
  if (product.brand !== undefined) entry.brand = product.brand;
  return entry;
}

interface FavoritesState {
  byId: Record<number, FavoriteEntry>;
  isHydrated: boolean;
  hydrate: () => void;
  add: (product: Product) => void;
  remove: (id: number) => void;
  toggle: (product: Product) => void;
}

function sortByAddedDesc(entries: FavoriteEntry[]): FavoriteEntry[] {
  return [...entries].sort((a, b) => b.addedAt - a.addedAt);
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  byId: {},
  isHydrated: false,
  hydrate: () => {
    if (get().isHydrated) return;
    const all = favoritesRepository.getAll();
    const byId: Record<number, FavoriteEntry> = {};
    for (const entry of all) {
      byId[entry.id] = entry;
    }
    set({ byId, isHydrated: true });
  },
  add: product => {
    const prev = get().byId;
    const maxAddedAt = Object.values(prev).reduce(
      (m, e) => Math.max(m, e.addedAt),
      0,
    );
    const entry: FavoriteEntry = {
      ...fromProduct(product),
      addedAt: Math.max(Date.now(), maxAddedAt + 1),
    };
    const byId = { ...prev, [entry.id]: entry };
    favoritesRepository.save(entry);
    set({ byId });
  },
  remove: id => {
    const next = { ...get().byId };
    delete next[id];
    favoritesRepository.remove(id);
    set({ byId: next });
  },
  toggle: product => {
    const { byId } = get();
    if (byId[product.id]) {
      get().remove(product.id);
    } else {
      get().add(product);
    }
  },
}));

export function selectIsFavorite(id: number) {
  return (state: FavoritesState): boolean => state.byId[id] !== undefined;
}

export function selectFavoriteList(state: FavoritesState): FavoriteEntry[] {
  return sortByAddedDesc(Object.values(state.byId));
}

export function selectFavoriteIds(state: FavoritesState): number[] {
  return Object.keys(state.byId).map(k => Number(k));
}

export function selectIsHydrated(state: FavoritesState): boolean {
  return state.isHydrated;
}
