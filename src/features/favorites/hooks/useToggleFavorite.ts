import { useCallback } from 'react';
import type { Product } from '@/domain/product/Product';
import { useFavoritesStore } from '../store/favoritesStore';

export interface UseToggleFavoriteResult {
  toggle: (product: Product) => void;
}

export function useToggleFavorite(): UseToggleFavoriteResult {
  const toggle = useFavoritesStore(state => state.toggle);
  return {
    toggle: useCallback(
      (product: Product) => {
        toggle(product);
      },
      [toggle],
    ),
  };
}
