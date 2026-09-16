export interface FavoriteProduct {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  brand?: string;
  addedAt: number;
}
