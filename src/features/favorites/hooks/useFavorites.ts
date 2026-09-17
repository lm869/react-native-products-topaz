import { useFavoritesStore, selectFavoriteList } from '../store/favoritesStore';
import type { FavoriteProduct } from '@/domain/favorites/FavoriteProduct';

export interface UseFavoritesResult {
  items: FavoriteProduct[];
  isHydrated: boolean;
}

export function useFavorites(): UseFavoritesResult {
  const items = useFavoritesStore(selectFavoriteList);
  const isHydrated = useFavoritesStore(state => state.isHydrated);
  return { items, isHydrated };
}
