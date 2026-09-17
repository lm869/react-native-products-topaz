import { renderHook, act } from '@testing-library/react-native';
import { useDebouncedValue } from '../useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('emits the latest value after the default delay (350ms)', async () => {
    const { result, rerender } = await renderHook<string, { value: string }>(
      ({ value }) => useDebouncedValue(value),
      { initialProps: { value: 'a' } },
    );

    expect(result.current).toBe('a');

    await act(async () => {
      await rerender({ value: 'ab' });
    });
    expect(result.current).toBe('a');

    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(result.current).toBe('ab');
  });

  it('emits only the last value when changes are rapid', async () => {
    const { result, rerender } = await renderHook<string, { value: string }>(
      ({ value }) => useDebouncedValue(value),
      { initialProps: { value: 'a' } },
    );

    await act(async () => {
      await rerender({ value: 'ab' });
    });
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    await act(async () => {
      await rerender({ value: 'abc' });
    });
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    await act(async () => {
      await rerender({ value: 'abcd' });
    });
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe('a');

    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(result.current).toBe('abcd');
  });

  it('emits immediately when delay is 0', async () => {
    const { result, rerender } = await renderHook<
      string,
      { value: string; delay: number }
    >(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'a', delay: 0 },
    });

    await act(async () => {
      await rerender({ value: 'b', delay: 0 });
    });
    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toBe('b');
  });

  it('emits immediately when delay is negative', async () => {
    const { result, rerender } = await renderHook<
      string,
      { value: string; delay: number }
    >(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'a', delay: -10 },
    });

    await rerender({ value: 'b', delay: -10 });

    expect(result.current).toBe('b');
  });

  it('cleans up the timer on unmount', async () => {
    const { result, rerender, unmount } = await renderHook<
      string,
      { value: string }
    >(({ value }) => useDebouncedValue(value, 350), {
      initialProps: { value: 'a' },
    });

    await act(async () => {
      await rerender({ value: 'b' });
    });
    await act(async () => {
      await unmount();
    });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('a');
  });
});
