import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage, STORAGE_KEYS } from '@/storage/mmkv';
import type { StateStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

type State = {
  mode: ThemeMode;
};

type Actions = {
  setMode: (mode: ThemeMode) => void;
};

const mmkvStateStorage: StateStorage = {
  getItem: key => storage.getItem(key) ?? null,
  setItem: (key, value) => storage.setItem(key, value),
  removeItem: key => storage.removeItem(key),
};

export const useThemeStore = create<State & Actions>()(
  persist(
    set => ({
      mode: 'light',
      setMode: mode => set({ mode }),
    }),
    {
      name: STORAGE_KEYS.settingsV1,
      storage: createJSONStorage(() => mmkvStateStorage),
      partialize: ({ mode }) => ({ mode }),
      version: 2,
      migrate: (persisted, _version) => {
        const p = (persisted ?? {}) as { mode?: string };
        const mode: ThemeMode = p.mode === 'dark' ? 'dark' : 'light';
        return { mode };
      },
    },
  ),
);
