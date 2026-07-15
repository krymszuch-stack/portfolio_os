import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { WindowProvider } from './contexts/WindowContext';

import { AuthProvider } from './contexts/AuthContext';
import { WindowProvider } from './contexts/WindowContext';

// Mock Firebase and other external dependencies
vi.mock('./lib/googleAuth', () => ({
  auth: { currentUser: null },
  googleSignIn: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()), // returns an unsubscribe function mock
}));

vi.mock('./lib/firestoreStore', () => ({
  loadPortfolioConfig: vi.fn(() => Promise.resolve(null)),
  loadPortfolioBySlug: vi.fn(() => Promise.resolve(null)),
  savePortfolioConfig: vi.fn(() => Promise.resolve(null)),
}));

// Mock sounds to prevent HTMLAudioElement issues in jsdom
vi.mock('./lib/sounds', () => ({
  playXpStartup: vi.fn(),
  playXpShutdown: vi.fn(),
  playXpError: vi.fn(),
  playXpBalloon: vi.fn(),
  playXpClick: vi.fn(),
  setSoundsEnabled: vi.fn(),
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <AuthProvider>
        <WindowProvider>
          <App />
        </WindowProvider>
      </AuthProvider>
    );
    expect(container).toBeTruthy();
    // Verify that the desktop or some generic element renders
    expect(container.querySelector('.system-font-apple') || container.querySelector('.cv-builder-scope')).toBeTruthy();
  });
});
