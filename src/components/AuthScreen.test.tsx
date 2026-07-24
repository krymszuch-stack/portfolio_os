import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthScreen } from './AuthScreen';
import { googleSignIn } from '../lib/googleAuth';
import { loginMicrosoft } from '../lib/microsoftAuth';

// Mock the authentication modules
vi.mock('../lib/googleAuth', () => ({
  googleSignIn: vi.fn(),
}));

vi.mock('../lib/microsoftAuth', () => ({
  loginMicrosoft: vi.fn(),
}));

describe('AuthScreen', () => {
  const mockOnContinueGuest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);
    expect(screen.getByText('Zarządzanie Tożsamością')).toBeInTheDocument();
    expect(screen.getByText('ZALOGUJ PRZEZ GOOGLE')).toBeInTheDocument();
    expect(screen.getByText('ZALOGUJ PRZEZ MICROSOFT LIVE')).toBeInTheDocument();
    expect(screen.getByText('> KONTYNUUJ BEZ LOGOWANIA (ZAPISZ LOKALNIE)')).toBeInTheDocument();
  });

  it('calls onContinueGuest when guest button is clicked', () => {
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);
    const guestButton = screen.getByText('> KONTYNUUJ BEZ LOGOWANIA (ZAPISZ LOKALNIE)');
    fireEvent.click(guestButton);
    expect(mockOnContinueGuest).toHaveBeenCalledTimes(1);
  });

  it('handles Google login successfully', async () => {
    // Make the promise hang so we can test the loading state
    let resolveLogin: (val: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    (googleSignIn as any).mockReturnValueOnce(loginPromise);
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const googleButton = screen.getByRole('button', { name: /ZALOGUJ PRZEZ GOOGLE/i });
    fireEvent.click(googleButton);

    expect(googleSignIn).toHaveBeenCalledTimes(1);

    // Check loading state
    expect(await screen.findByText(/ŁĄCZENIE Z SERWEREM GOOGLE.../i)).toBeInTheDocument();
    expect(googleButton).toBeDisabled();

    // Resolve the promise
    resolveLogin!({ user: { uid: '123' } });

    // After resolution
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ZALOGUJ PRZEZ GOOGLE/i })).not.toBeDisabled();
    });
  });

  it('handles Google login error - unauthorized domain', async () => {
    const error = { code: 'auth/unauthorized-domain' };
    (googleSignIn as any).mockRejectedValueOnce(error);
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const googleButton = screen.getByRole('button', { name: /ZALOGUJ PRZEZ GOOGLE/i });
    fireEvent.click(googleButton);

    expect(await screen.findByText(/Błąd Google: Domena nie jest autoryzowana w Firebase/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(googleButton).not.toBeDisabled();
    });
  });

  it('handles Google login error - generic', async () => {
    const error = new Error('Some random error');
    (googleSignIn as any).mockRejectedValueOnce(error);
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const googleButton = screen.getByRole('button', { name: /ZALOGUJ PRZEZ GOOGLE/i });
    fireEvent.click(googleButton);

    expect(await screen.findByText(/Logowanie Google nie powiodło się. Spróbuj ponownie./i)).toBeInTheDocument();
  });

  it('handles Microsoft login successfully', async () => {
    let resolveLogin: (val: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    (loginMicrosoft as any).mockReturnValueOnce(loginPromise);
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const msButton = screen.getByRole('button', { name: /ZALOGUJ PRZEZ MICROSOFT LIVE/i });
    fireEvent.click(msButton);

    expect(loginMicrosoft).toHaveBeenCalledTimes(1);

    // Check loading state
    expect(await screen.findByText(/AUTORYZACJA MICROSOFT.../i)).toBeInTheDocument();
    expect(msButton).toBeDisabled();

    // Resolve the promise
    resolveLogin!({ user: { uid: '123' } });

    // After resolution
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ZALOGUJ PRZEZ MICROSOFT LIVE/i })).not.toBeDisabled();
    });
  });

  it('handles Microsoft login error - BrowserAuthError', async () => {
    const error = { name: 'BrowserAuthError', message: 'Popup blocked' };
    (loginMicrosoft as any).mockRejectedValueOnce(error);
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const msButton = screen.getByRole('button', { name: /ZALOGUJ PRZEZ MICROSOFT LIVE/i });
    fireEvent.click(msButton);

    expect(await screen.findByText(/Błąd Microsoft: Popup blocked/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(msButton).not.toBeDisabled();
    });
  });

  it('handles Microsoft login error - generic', async () => {
    const error = new Error('Some network error');
    (loginMicrosoft as any).mockRejectedValueOnce(error);
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const msButton = screen.getByRole('button', { name: /ZALOGUJ PRZEZ MICROSOFT LIVE/i });
    fireEvent.click(msButton);

    expect(await screen.findByText(/Logowanie Microsoft AD nie powiodło się. Spróbuj ponownie./i)).toBeInTheDocument();
  });
});
