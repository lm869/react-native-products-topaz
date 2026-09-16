import { useCallback } from 'react';
import {
  useThemeStore,
  type ThemeMode,
} from '@/features/settings/store/themeStore';

export type { ThemeMode };

export type ThemeOverride = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
};

const ORDER: readonly ThemeMode[] = ['light', 'dark'] as const;
const NOOP = (): void => {};

export function useThemeOverride(): ThemeOverride {
  const mode: ThemeMode = useThemeStore(s => s.mode) ?? 'light';
  const setMode: (mode: ThemeMode) => void =
    useThemeStore(s => s.setMode) ?? NOOP;

  const cycleMode = useCallback(() => {
    const idx = ORDER.indexOf(mode);
    const next = ORDER[(idx + 1) % ORDER.length] ?? 'light';
    setMode(next);
  }, [mode, setMode]);

  return { mode, setMode, cycleMode };
}
