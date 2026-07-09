import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Optional: run cleanup after each test automatically
afterEach(() => {
  cleanup();
});
