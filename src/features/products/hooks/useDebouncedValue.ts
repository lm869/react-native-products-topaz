import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number = 350): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    if (!Number.isFinite(delayMs) || delayMs < 0) {
      setDebounced(value);
      return;
    }
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
