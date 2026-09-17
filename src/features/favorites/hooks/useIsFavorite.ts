import { useFavoritesStore, selectIsFavorite } from '../store/favoritesStore';

export function useIsFavorite(id: number): boolean {
  return useFavoritesStore(selectIsFavorite(id));
}
