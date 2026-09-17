import { storage, STORAGE_KEYS } from '@/storage/mmkv';
import type { FavoriteProduct } from '@/domain/favorites/FavoriteProduct';
import type { IFavoritesRepository } from '@/domain/favorites/IFavoritesRepository';

type StoredShape = FavoriteProduct[];

function readRaw(): string | undefined {
  return storage.getItem(STORAGE_KEYS.favoritesV1);
}

function parseStored(raw: string): StoredShape {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      console.warn(
        '[favorites] Stored payload is not an array — resetting to empty',
      );
      return [];
    }
    const valid = parsed.filter(isFavoriteShape);
    return valid;
  } catch (cause) {
    console.warn('[favorites] Corrupted JSON in MMKV — resetting to empty', {
      cause,
    });
    return [];
  }
}

function isFavoriteShape(value: unknown): value is FavoriteProduct {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.title === 'string' &&
    typeof v.price === 'number' &&
    typeof v.thumbnail === 'string' &&
    typeof v.category === 'string' &&
    typeof v.addedAt === 'number'
  );
}

export class MMKVFavoritesRepository implements IFavoritesRepository {
  getAll(): FavoriteProduct[] {
    const raw = readRaw();
    if (raw === undefined) return [];
    return parseStored(raw);
  }

  save(fav: FavoriteProduct): void {
    const current = this.getAll();
    const next = current.filter(item => item.id !== fav.id);
    next.push(fav);
    storage.setItem(STORAGE_KEYS.favoritesV1, JSON.stringify(next));
  }

  remove(id: number): void {
    const current = this.getAll();
    const next = current.filter(item => item.id !== id);
    storage.setItem(STORAGE_KEYS.favoritesV1, JSON.stringify(next));
  }

  exists(id: number): boolean {
    return this.getAll().some(item => item.id === id);
  }
}

export const favoritesRepository: IFavoritesRepository =
  new MMKVFavoritesRepository();
