import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from './useCopyToClipboard';
import { triggerHaptic } from '../lib/haptics';

// Mock the haptics module
vi.mock('../lib/haptics', () => ({
  triggerHaptic: vi.fn(),
}));

describe('useCopyToClipboard', () => {
  const originalClipboard = navigator.clipboard;
  const originalWarn = console.warn;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    // Mock console.warn to keep test output clean and track calls
    console.warn = vi.fn();

    // Create a mock for navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    console.warn = originalWarn;
    Object.assign(navigator, {
      clipboard: originalClipboard,
    });
  });

  it('should copy text to clipboard successfully', async () => {
    const mockWriteText = vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopyToClipboard());

    const [isCopied, copy] = result.current;
    expect(isCopied).toBe(false);

    await act(async () => {
      await copy('test text');
    });

    expect(mockWriteText).toHaveBeenCalledWith('test text');
    expect(triggerHaptic).toHaveBeenCalledWith('success');
    expect(result.current[0]).toBe(true); // isCopied should be true

    // Advance timers to trigger reset
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current[0]).toBe(false); // isCopied should be reset to false
  });

  it('should handle clipboard copy error gracefully', async () => {
    const error = new Error('Clipboard error');
    const mockWriteText = vi.mocked(navigator.clipboard.writeText).mockRejectedValue(error);
    const mockWarn = vi.mocked(console.warn);

    const { result } = renderHook(() => useCopyToClipboard());

    const [isCopied, copy] = result.current;
    expect(isCopied).toBe(false);

    await act(async () => {
      await copy('test text');
    });

    expect(mockWriteText).toHaveBeenCalledWith('test text');
    expect(mockWarn).toHaveBeenCalledWith('Failed to copy', error);
    expect(triggerHaptic).toHaveBeenCalledWith('error');
    expect(result.current[0]).toBe(false); // isCopied should remain false
  });

  it('should do nothing if text is empty', async () => {
    const mockWriteText = vi.mocked(navigator.clipboard.writeText);
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current[1]('');
    });

    expect(mockWriteText).not.toHaveBeenCalled();
    expect(triggerHaptic).not.toHaveBeenCalled();
    expect(result.current[0]).toBe(false);
  });
});
