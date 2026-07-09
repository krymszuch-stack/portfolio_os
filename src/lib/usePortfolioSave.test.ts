import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePortfolioSave } from './usePortfolioSave';

// Mock dependencies
vi.mock('./googleAuth', () => ({
  auth: { currentUser: { uid: 'test-user-123' } },
  googleSignIn: vi.fn(),
}));

vi.mock('./firestoreStore', () => ({
  savePortfolioConfig: vi.fn(),
}));

import { savePortfolioConfig } from './firestoreStore';

describe('usePortfolioSave hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully save and update status', async () => {
    const mockSave = savePortfolioConfig as any;
    mockSave.mockResolvedValueOnce({ success: true, publicSlug: 'test-slug' });

    const { result } = renderHook(() => usePortfolioSave());

    expect(result.current.saveStatus).toBe('idle');

    await act(async () => {
      const response = await result.current.saveToCloud({} as any, [], [], [], []);
      expect(response.success).toBe(true);
      expect(response.publicSlug).toBe('test-slug');
    });

    expect(result.current.publicSlug).toBe('test-slug');
    expect(result.current.saveStatus).toBe('success');
  });

  it('should handle save error gracefully', async () => {
    const mockSave = savePortfolioConfig as any;
    mockSave.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => usePortfolioSave());

    await act(async () => {
      const response = await result.current.saveToCloud({} as any, [], [], [], []);
      expect(response.success).toBe(false);
    });

    expect(result.current.saveStatus).toBe('error');
  });
});
