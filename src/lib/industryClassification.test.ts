import { describe, it, expect } from 'vitest';
import { findBestProfession, professionalDictionary, normalizeText } from './industryClassification';

describe('findBestProfession', () => {
  it('should return undefined for empty string or whitespace only', () => {
    expect(findBestProfession('')).toBeUndefined();
    expect(findBestProfession('   ')).toBeUndefined();
    expect(findBestProfession('\n')).toBeUndefined();
  });

  it('should return undefined when no profession matches the minimum score (6)', () => {
    // Need a random string that definitely doesn't match any keywords in any category
    expect(findBestProfession('qwertyuiop asdfghjkl zxcvbnm')).toBeUndefined();
  });

  it('should find a profession by requiredAll match (yields 35 points)', () => {
    // "ogrod" and "podlewanie" are requiredAll for gardener
    const result = findBestProfession('ogród podlewanie traw');
    expect(result).toBeDefined();
    expect(result?.id).toBe('gardener');
  });

  it('should find a profession by exact title match (yields 25 points)', () => {
    // "Mechanik Samochodowy" is the title of the mechanic profession
    const result = findBestProfession('Szukam kogoś kto ma warsztat, to mechanik samochodowy');
    expect(result).toBeDefined();
    expect(result?.id).toBe('mechanic');
  });

  it('should find a profession by anyOf match (yields 6 points each)', () => {
    // "seo" and "pozycjonowanie" are anyOf for marketing-specialist
    // 2 * 6 = 12 points, which is > 6
    const result = findBestProfession('oferuje seo oraz pozycjonowanie stron');
    expect(result).toBeDefined();
    expect(result?.id).toBe('marketing-specialist');
  });

  it('should normalize input text correctly (handling diacritics and case)', () => {
    // "ZDJĘC" and "ŚLUB" should match "zdjec" and "slub" after normalization
    // "zdjec" and "slub" are requiredAll for wedding-photographer
    const result = findBestProfession('robię ZDJĘCIA i kręcę na ŚLUBIE');
    expect(result).toBeDefined();
    expect(result?.id).toBe('wedding-photographer');
  });

  it('should pick the profession with the highest score when multiple match', () => {
    // "zdjecia slubne" -> wedding-photographer (requiredAll match - 35) + anyOf(zdjecia, slubny - 12) = 47
    // "montaz wideo" -> video-editor (requiredAll match - 35) + anyOf(video) = 35?
    // Let's create a specific conflict
    // "fotograf" (anyOf photographer: 6) vs "fotograf ślubny" (exact title photographer: 25) vs
    // Wait, let's look at graphic-designer: "grafik" + "projektowanie" (requiredAll: 35)
    // vs something else.
    // Actually, "projektowanie" is requiredAll for graphic-designer if "grafik" is present.
    // "fotografia" is anyOf for wedding-photographer (6).
    // Let's give: "Zajmuję się projektowaniem grafiki, czasem robię też fotografię"
    // graphic-designer: requiredAll(grafik, projektowanie) -> 35
    // wedding-photographer: anyOf(fotografia) -> 6
    // Expected: graphic-designer
    const result = findBestProfession('Zajmuję się projektowaniem grafiki, czasem robię też fotografię');
    expect(result).toBeDefined();
    expect(result?.id).toBe('graphic-designer');
  });
});
