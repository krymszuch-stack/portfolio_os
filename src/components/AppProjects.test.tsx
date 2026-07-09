import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProjects } from './AppProjects';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = vi.fn();

describe('AppProjects Github Import', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not add a project and shows an error on failed github fetch', async () => {
    const mockSetProjects = vi.fn();
    const config = { githubUsername: 'test-user' };

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
    });

    render(
      <AppProjects 
        projects={[]} 
        setProjects={mockSetProjects} 
        config={config} 
      />
    );

    // Enter a repo name
    const input = screen.getByPlaceholderText(/np\. krymszuch-stack\/portfolio/i);
    fireEvent.change(input, { target: { value: 'missing-repo' } });

    // Submit form
    const importButton = screen.getByText('Importuj');
    fireEvent.click(importButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Nie udało się pobrać repo test-user\/missing-repo/i)).toBeInTheDocument();
    });

    // Ensure setProjects was NEVER called (meaning no fabricated project was added)
    expect(mockSetProjects).not.toHaveBeenCalled();
  });

  it('shows error if no owner can be determined', async () => {
    const mockSetProjects = vi.fn();
    const config = {}; // No githubUsername

    render(
      <AppProjects 
        projects={[]} 
        setProjects={mockSetProjects} 
        config={config} 
      />
    );

    const input = screen.getByPlaceholderText(/np\. krymszuch-stack\/portfolio/i);
    fireEvent.change(input, { target: { value: 'just-repo' } });

    const importButton = screen.getByText('Importuj');
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(screen.getByText(/Wpisz pełną nazwę w formacie uzytkownik\/repozytorium/i)).toBeInTheDocument();
    });

    expect(mockSetProjects).not.toHaveBeenCalled();
  });
});
