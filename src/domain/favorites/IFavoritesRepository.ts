import type { FavoriteProduct } from './FavoriteProduct';

export interface IFavoritesRepository {
  getAll(): FavoriteProduct[];
  save(fav: FavoriteProduct): void;
  remove(id: number): void;
  exists(id: number): boolean;
}
