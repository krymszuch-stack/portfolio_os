import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from './useCopyToClipboard';
import { triggerHaptic } from '../lib/haptics';

// Mock the haptics library
vi.mock('../lib/haptics', () => ({
  triggerHaptic: vi.fn(),
}));

describe('useCopyToClipboard hook', () => {
  const originalClipboard = { ...global.navigator.clipboard };
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    // Mock console.warn
    console.warn = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    Object.assign(navigator, { clipboard: originalClipboard });
    console.warn = originalConsoleWarn;
  });

  it('should have initial state isCopied as false', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current[0]).toBe(false);
  });

  it('should set isCopied to true, call clipboard, and trigger success haptic on copy', async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    const [, copy] = result.current;

    await act(async () => {
      await copy('test text');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    expect(result.current[0]).toBe(true);
    expect(triggerHaptic).toHaveBeenCalledWith('success');
  });

  it('should reset isCopied after default interval (2000ms)', async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    const [, copy] = result.current;

    await act(async () => {
      await copy('test text');
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current[0]).toBe(false);
  });

  it('should reset isCopied after custom interval', async () => {
    const { result } = renderHook(() => useCopyToClipboard(5000));
    const [, copy] = result.current;

    await act(async () => {
      await copy('test text');
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current[0]).toBe(false);
  });

  it('should do nothing if text is empty', async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    const [, copy] = result.current;

    await act(async () => {
      await copy('');
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(result.current[0]).toBe(false);
    expect(triggerHaptic).not.toHaveBeenCalled();
  });

  it('should handle error, log warning, trigger error haptic, and keep isCopied as false', async () => {
    const mockError = new Error('Clipboard error');
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(mockError),
      },
    });

    const { result } = renderHook(() => useCopyToClipboard());
    const [, copy] = result.current;

    await act(async () => {
      await copy('test text');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    expect(console.warn).toHaveBeenCalledWith('Failed to copy', mockError);
    expect(result.current[0]).toBe(false);
    expect(triggerHaptic).toHaveBeenCalledWith('error');
  });
});
