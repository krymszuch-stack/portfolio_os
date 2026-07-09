import { describe, it, expect, vi, beforeEach } from 'vitest';
import { savePortfolioConfig } from './firestoreStore';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  limit: vi.fn(),
}));

vi.mock('./googleAuth', () => ({
  app: {}, // Mock app initialized
}));

import { getDoc, setDoc } from 'firebase/firestore';

describe('firestoreStore slug logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should preserve existing publicSlug', async () => {
    const mockGetDoc = getDoc as any;
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ publicSlug: 'existing-slug-123' })
    });

    const mockSetDoc = setDoc as any;

    const result = await savePortfolioConfig('user-1', {} as any, [], [], [], []);
    
    expect(result.publicSlug).toBe('existing-slug-123');
    expect(mockSetDoc).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ publicSlug: 'existing-slug-123' }),
      { merge: true }
    );
  });

  it('should generate a new slug if none exists', async () => {
    const mockGetDoc = getDoc as any;
    mockGetDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    const mockGetDocs = getDocs as any;
    mockGetDocs.mockResolvedValueOnce({ empty: true });

    const mockSetDoc = setDoc as any;

    const config = { portfolioName: 'My Test Portfolio' };
    const result = await savePortfolioConfig('user-1', config as any, [], [], [], []);
    
    expect(result.publicSlug).toMatch(/^my-test-portfolio-[a-z0-9]{4}$/);
    expect(mockSetDoc).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ publicSlug: result.publicSlug }),
      { merge: true }
    );
  });

  it('should generate a default slug if config has no name', async () => {
    const mockGetDoc = getDoc as any;
    mockGetDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    const mockGetDocs = getDocs as any;
    // Assume available
    mockGetDocs.mockResolvedValueOnce({ empty: true });

    const mockSetDoc = setDoc as any;

    const result = await savePortfolioConfig('user-1', {} as any, [], [], [], []);
    
    expect(result.publicSlug).toMatch(/^portfolio-[a-z0-9]{4}$/);
    expect(mockSetDoc).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ publicSlug: result.publicSlug }),
      { merge: true }
    );
  });

  it('should retry generating a slug up to 5 times if collisions occur', async () => {
    const mockGetDoc = getDoc as any;
    mockGetDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    const mockGetDocs = getDocs as any;
    
    // Fail 3 times, succeed on 4th
    mockGetDocs
      .mockResolvedValueOnce({ empty: false, docs: [{ id: 'other-user-1' }] }) // Taken
      .mockResolvedValueOnce({ empty: false, docs: [{ id: 'other-user-2' }] }) // Taken
      .mockResolvedValueOnce({ empty: false, docs: [{ id: 'other-user-3' }] }) // Taken
      .mockResolvedValueOnce({ empty: true }); // Available!

    const mockSetDoc = setDoc as any;

    const result = await savePortfolioConfig('user-retry', {} as any, [], [], [], []);
    
    expect(mockGetDocs).toHaveBeenCalledTimes(4); // Checked 4 times
    expect(result.publicSlug).toMatch(/^portfolio-[a-z0-9]{4}$/);
    expect(mockSetDoc).toHaveBeenCalled();
  });
  
  it('should fail if slug generation fails 5 times', async () => {
    const mockGetDoc = getDoc as any;
    mockGetDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    const mockGetDocs = getDocs as any;
    
    // Fail 5 times
    mockGetDocs.mockResolvedValue({ empty: false, docs: [{ id: 'other-user' }] });

    await expect(savePortfolioConfig('user-fail', {} as any, [], [], [], [])).rejects.toThrow("Could not generate a unique public slug");
    expect(mockGetDocs).toHaveBeenCalledTimes(5);
  });
});
