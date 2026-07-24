import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthScreen } from './AuthScreen';
import '@testing-library/jest-dom';
import { googleSignIn } from '../lib/googleAuth';
import { loginMicrosoft } from '../lib/microsoftAuth';

// Mock auth modules
vi.mock('../lib/googleAuth', () => ({
  googleSignIn: vi.fn(),
}));

vi.mock('../lib/microsoftAuth', () => ({
  loginMicrosoft: vi.fn(),
}));

describe('AuthScreen Component', () => {
  const mockOnContinueGuest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with all authentication options', () => {
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    expect(screen.getByText('Zarządzanie Tożsamością')).toBeInTheDocument();
    expect(screen.getByText('ZALOGUJ PRZEZ GOOGLE')).toBeInTheDocument();
    expect(screen.getByText('ZALOGUJ PRZEZ MICROSOFT LIVE')).toBeInTheDocument();
    expect(screen.getByText('> KONTYNUUJ BEZ LOGOWANIA (ZAPISZ LOKALNIE)')).toBeInTheDocument();
  });

  it('calls googleSignIn and sets loading state on Google button click', async () => {
    (googleSignIn as any).mockResolvedValueOnce({ user: { uid: '123' }, accessToken: 'token' });

    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const googleButton = screen.getByText('ZALOGUJ PRZEZ GOOGLE');
    fireEvent.click(googleButton);

    // Check if loading state text appears
    expect(screen.getByText('ŁĄCZENIE Z SERWEREM GOOGLE...')).toBeInTheDocument();
    expect(googleSignIn).toHaveBeenCalledTimes(1);

    // Wait for async operation to complete
    await waitFor(() => {
      // The loading text should disappear and revert to original
      expect(screen.queryByText('ŁĄCZENIE Z SERWEREM GOOGLE...')).not.toBeInTheDocument();
      expect(screen.getByText('ZALOGUJ PRZEZ GOOGLE')).toBeInTheDocument();
    });
  });

  it('displays specific error message when Google login fails with unauthorized-domain', async () => {
    const error = new Error('Auth failed');
    (error as any).code = 'auth/unauthorized-domain';
    (googleSignIn as any).mockRejectedValueOnce(error);

    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const googleButton = screen.getByText('ZALOGUJ PRZEZ GOOGLE');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText(/Domena nie jest autoryzowana w Firebase/)).toBeInTheDocument();
    });
  });

  it('displays generic error message when Google login fails with other error', async () => {
    const error = new Error('Generic failure');
    (googleSignIn as any).mockRejectedValueOnce(error);

    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const googleButton = screen.getByText('ZALOGUJ PRZEZ GOOGLE');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText(/Logowanie Google nie powiodło się/)).toBeInTheDocument();
    });
  });

  it('calls loginMicrosoft and sets loading state on Microsoft button click', async () => {
    (loginMicrosoft as any).mockResolvedValueOnce({ user: { uid: '123' }, accessToken: 'token' });

    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const microsoftButton = screen.getByText('ZALOGUJ PRZEZ MICROSOFT LIVE');
    fireEvent.click(microsoftButton);

    expect(screen.getByText('AUTORYZACJA MICROSOFT...')).toBeInTheDocument();
    expect(loginMicrosoft).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByText('AUTORYZACJA MICROSOFT...')).not.toBeInTheDocument();
      expect(screen.getByText('ZALOGUJ PRZEZ MICROSOFT LIVE')).toBeInTheDocument();
    });
  });

  it('displays specific error message when Microsoft login fails with BrowserAuthError', async () => {
    const error = new Error('Popup blocked');
    error.name = 'BrowserAuthError';
    (loginMicrosoft as any).mockRejectedValueOnce(error);

    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const microsoftButton = screen.getByText('ZALOGUJ PRZEZ MICROSOFT LIVE');
    fireEvent.click(microsoftButton);

    await waitFor(() => {
      expect(screen.getByText(/Błąd Microsoft: Popup blocked/)).toBeInTheDocument();
    });
  });

  it('displays generic error message when Microsoft login fails with other error', async () => {
    const error = new Error('Generic failure');
    (loginMicrosoft as any).mockRejectedValueOnce(error);

    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const microsoftButton = screen.getByText('ZALOGUJ PRZEZ MICROSOFT LIVE');
    fireEvent.click(microsoftButton);

    await waitFor(() => {
      expect(screen.getByText(/Logowanie Microsoft AD nie powiodło się/)).toBeInTheDocument();
    });
  });

  it('calls onContinueGuest when guest button is clicked', () => {
    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    const guestButton = screen.getByText('> KONTYNUUJ BEZ LOGOWANIA (ZAPISZ LOKALNIE)');
    fireEvent.click(guestButton);

    expect(mockOnContinueGuest).toHaveBeenCalledTimes(1);
  });

  it('disables all buttons while loading', async () => {
    // Make Google sign in hang to test disabled state
    let resolveGoogleSignIn: any;
    const googleSignInPromise = new Promise((resolve) => {
      resolveGoogleSignIn = resolve;
    });
    (googleSignIn as any).mockReturnValueOnce(googleSignInPromise);

    render(<AuthScreen onContinueGuest={mockOnContinueGuest} />);

    // Initially enabled
    const googleButton = screen.getByRole('button', { name: /ZALOGUJ PRZEZ GOOGLE/i });
    const msButton = screen.getByRole('button', { name: /ZALOGUJ PRZEZ MICROSOFT LIVE/i });
    const guestButton = screen.getByRole('button', { name: /> KONTYNUUJ BEZ LOGOWANIA/i });

    expect(googleButton).not.toBeDisabled();
    expect(msButton).not.toBeDisabled();
    expect(guestButton).not.toBeDisabled();

    // Click Google
    fireEvent.click(googleButton);

    // Should be disabled now
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ŁĄCZENIE Z SERWEREM GOOGLE.../i })).toBeDisabled();
    });
    expect(msButton).toBeDisabled();
    expect(guestButton).toBeDisabled();

    // Resolve the promise
    resolveGoogleSignIn({ user: { uid: '123' }, accessToken: 'token' });

    // Should be enabled again
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ZALOGUJ PRZEZ GOOGLE/i })).not.toBeDisabled();
    });
    expect(msButton).not.toBeDisabled();
    expect(guestButton).not.toBeDisabled();
  });
});
