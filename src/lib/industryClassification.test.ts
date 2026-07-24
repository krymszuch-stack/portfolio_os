import { describe, it, expect } from 'vitest';
import { findBestProfession, normalizeText } from './industryClassification';

describe('industryClassification', () => {
  describe('normalizeText', () => {
    it('should normalize Polish text correctly', () => {
      expect(normalizeText('Zażółć gęślą jaźń')).toBe('zazolc gesla jazn');
      expect(normalizeText('Wesele i Ślub')).toBe('wesele i slub');
      expect(normalizeText('   SPACje   ')).toBe('spacje');
      expect(normalizeText('!@# specjalne znaki$%^')).toBe('specjalne znaki');
    });

    it('should return empty string for falsy inputs', () => {
      expect(normalizeText('')).toBe('');
    });
  });

  describe('findBestProfession', () => {
    it('should return undefined for empty or whitespace-only inputs', () => {
      expect(findBestProfession('')).toBeUndefined();
      expect(findBestProfession('   ')).toBeUndefined();
    });

    it('should return undefined when no keywords match or score is below 6', () => {
      expect(findBestProfession('astronauta w kosmosie')).toBeUndefined();
      expect(findBestProfession('zwykly tekst bez znaczenia')).toBeUndefined();
    });

    it('should match based on exact title', () => {
      const result = findBestProfession('Potrzebny Fotograf Ślubny na weekend');
      expect(result).toBeDefined();
      expect(result?.id).toBe('wedding-photographer');
    });

    it('should match based on anyOf keywords (incremental points)', () => {
      // "fotografia" (6), "wesele" (6) -> score = 12 > 6
      const result = findBestProfession('fotografia na wesele super sprawa');
      expect(result).toBeDefined();
      expect(result?.id).toBe('wedding-photographer');
    });

    it('should match based on requiredAll keywords (significant bonus)', () => {
      // requiredAll for photographer: 'zdjec', 'slub'
      const result = findBestProfession('szukam kogos kto robi fajne zdjecia na slub');
      expect(result).toBeDefined();
      expect(result?.id).toBe('wedding-photographer');
    });

    it('should correctly prioritize the match with the highest score', () => {
      // Testing prioritization between two potentially overlapping areas.
      // E.g., general programming vs specific web dev
      // "programista" (anyOf) + "react" (requiredAll) + "stron" (requiredAll)
      const result = findBestProfession('programista react ktory tworzy strony webowe');
      expect(result).toBeDefined();
      expect(result?.id).toBe('web-developer');
    });
  });
});
