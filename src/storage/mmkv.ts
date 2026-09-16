import { MMKV } from 'react-native-mmkv';

export interface KeyValueStorage {
  getItem(key: string): string | undefined;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  getAllKeys(): string[];
}

export const STORAGE_KEYS = {
  favoritesV1: 'favorites:v1',
  settingsV1: 'settings:v1',
} as const;

const mmkv = new MMKV({ id: 'topaz-products' });

export const storage: KeyValueStorage = {
  getItem: key => mmkv.getString(key),
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: key => mmkv.delete(key),
  clear: () => mmkv.clearAll(),
  getAllKeys: () => mmkv.getAllKeys(),
};
