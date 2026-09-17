function loadWrapper(
  platform: 'android' | 'ios',
  nativeImpl?: { format: (a: number, c: string, l: string) => Promise<string> },
) {
  jest.resetModules();
  jest.doMock('react-native', () => ({
    Platform: { OS: platform },
    NativeModules: nativeImpl ? { NativeCurrencyFormatter: nativeImpl } : {},
  }));
  return require('../nativeCurrencyFormatter') as typeof import('../nativeCurrencyFormatter');
}

describe('formatCurrencyNative', () => {
  it('falls back to Intl when native module is absent', async () => {
    const { formatCurrencyNative } = loadWrapper('android');
    const formatted = await formatCurrencyNative(1234.5);
    expect(formatted).toMatch(/\$1,?234\.50/);
  });

  it('calls native module when on Android and module is present', async () => {
    const nativeFormat = jest.fn().mockResolvedValue('$1,234.50 (native)');
    const { formatCurrencyNative } = loadWrapper('android', {
      format: nativeFormat,
    });
    const formatted = await formatCurrencyNative(1234.5, 'USD', 'en-US');
    expect(formatted).toBe('$1,234.50 (native)');
    expect(nativeFormat).toHaveBeenCalledWith(1234.5, 'USD', 'en-US');
  });

  it('does not call native on iOS even if module is exposed', async () => {
    const nativeFormat = jest.fn().mockResolvedValue('should not use');
    const { formatCurrencyNative } = loadWrapper('ios', {
      format: nativeFormat,
    });
    const formatted = await formatCurrencyNative(99, 'EUR', 'en-US');
    expect(formatted).toContain('€');
    expect(formatted).toContain('99');
    expect(nativeFormat).not.toHaveBeenCalled();
  });

  it('falls back to Intl when native module rejects', async () => {
    const nativeFormat = jest.fn().mockRejectedValue(new Error('boom'));
    const { formatCurrencyNative } = loadWrapper('android', {
      format: nativeFormat,
    });
    const formatted = await formatCurrencyNative(42, 'USD', 'en-US');
    expect(formatted).toMatch(/\$42\.00/);
  });

  it('falls back to 0 when amount is NaN', async () => {
    const nativeFormat = jest.fn().mockResolvedValue('$0.00');
    const { formatCurrencyNative } = loadWrapper('android', {
      format: nativeFormat,
    });
    const formatted = await formatCurrencyNative(NaN);
    expect(formatted).toMatch(/\$0\.00/);
  });
});

describe('isNativeCurrencyFormatterAvailable', () => {
  it('returns true on Android when module is registered', () => {
    const { isNativeCurrencyFormatterAvailable } = loadWrapper('android', {
      format: jest.fn(),
    });
    expect(isNativeCurrencyFormatterAvailable()).toBe(true);
  });

  it('returns false on Android when module is missing', () => {
    const { isNativeCurrencyFormatterAvailable } = loadWrapper('android');
    expect(isNativeCurrencyFormatterAvailable()).toBe(false);
  });

  it('returns false on iOS regardless of module', () => {
    const { isNativeCurrencyFormatterAvailable } = loadWrapper('ios', {
      format: jest.fn(),
    });
    expect(isNativeCurrencyFormatterAvailable()).toBe(false);
  });
});
