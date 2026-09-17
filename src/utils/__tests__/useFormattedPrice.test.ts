import { renderHook, waitFor } from '@testing-library/react-native';

jest.mock('../nativeCurrencyFormatter', () => ({
  formatCurrencyNative: jest.fn(),
  isNativeCurrencyFormatterAvailable: jest.fn(),
}));

import {
  formatCurrencyNative,
  isNativeCurrencyFormatterAvailable,
} from '../nativeCurrencyFormatter';
import {
  __resetPriceCacheForTesting,
  useFormattedPrice,
} from '../useFormattedPrice';

const mockAvailable = isNativeCurrencyFormatterAvailable as jest.Mock;
const mockFormat = formatCurrencyNative as jest.Mock;

beforeEach(() => {
  mockAvailable.mockReset();
  mockFormat.mockReset();
  __resetPriceCacheForTesting();
});

describe('useFormattedPrice', () => {
  it('renders Intl fallback on initial render (before fetch resolves)', async () => {
    mockAvailable.mockReturnValue(true);
    let resolveFn: (v: string) => void = () => undefined;
    mockFormat.mockReturnValue(
      new Promise<string>(r => {
        resolveFn = r;
      }),
    );
    const { result } = await renderHook(() =>
      useFormattedPrice(1234.5, 'USD', 'en-US'),
    );
    expect(result.current.path).toBe('intl');
    expect(result.current.value).toMatch(/\$1,?234\.50/);
    resolveFn('$X.XX native');
    await waitFor(() => expect(result.current.path).toBe('native'));
  });

  it('updates to native path after async resolves', async () => {
    mockAvailable.mockReturnValue(true);
    mockFormat.mockResolvedValue('$1,234.50 (native)');
    const { result } = await renderHook(() =>
      useFormattedPrice(1234.5, 'USD', 'en-US'),
    );
    await waitFor(() => expect(result.current.path).toBe('native'));
    expect(result.current.value).toBe('$1,234.50 (native)');
    expect(mockFormat).toHaveBeenCalledWith(1234.5, 'USD', 'en-US');
  });

  it('stays on Intl path when native module is unavailable', async () => {
    mockAvailable.mockReturnValue(false);
    const { result } = await renderHook(() =>
      useFormattedPrice(42, 'EUR', 'en-US'),
    );
    expect(result.current.path).toBe('intl');
    expect(result.current.value).toContain('€');
    await new Promise(r => setTimeout(r, 50));
    expect(result.current.path).toBe('intl');
    expect(mockFormat).not.toHaveBeenCalled();
  });

  it('falls back to Intl path when native promise rejects', async () => {
    mockAvailable.mockReturnValue(true);
    mockFormat.mockRejectedValue(new Error('boom'));
    const { result } = await renderHook(() =>
      useFormattedPrice(99, 'USD', 'en-US'),
    );
    expect(result.current.path).toBe('intl');
    await waitFor(() => expect(mockFormat).toHaveBeenCalled());
    await new Promise(r => setTimeout(r, 50));
    expect(result.current.path).toBe('intl');
    expect(result.current.value).toMatch(/\$99\.00/);
  });
});
