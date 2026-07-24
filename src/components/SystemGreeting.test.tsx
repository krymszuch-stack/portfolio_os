import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SystemGreeting } from './SystemGreeting';
import '@testing-library/jest-dom';

describe('SystemGreeting', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setHour = (hour: number, minute: number = 0) => {
    const date = new Date(2023, 1, 1, hour, minute, 0);
    vi.setSystemTime(date);
  };

  it('renders "Dzień dobry" in the morning (5:00 - 11:59)', () => {
    setHour(5);
    const { unmount } = render(<SystemGreeting />);
    expect(screen.getByText('Dzień dobry, gość •')).toBeInTheDocument();
    unmount();

    setHour(11, 59);
    render(<SystemGreeting />);
    expect(screen.getByText('Dzień dobry, gość •')).toBeInTheDocument();
  });

  it('renders "Witaj na pulpicie" in the afternoon (12:00 - 17:59)', () => {
    setHour(12);
    const { unmount } = render(<SystemGreeting />);
    expect(screen.getByText('Witaj na pulpicie, gość •')).toBeInTheDocument();
    unmount();

    setHour(17, 59);
    render(<SystemGreeting />);
    expect(screen.getByText('Witaj na pulpicie, gość •')).toBeInTheDocument();
  });

  it('renders "Dobry wieczór" in the evening/night (18:00 - 4:59)', () => {
    setHour(18);
    const { unmount } = render(<SystemGreeting />);
    expect(screen.getByText('Dobry wieczór, gość •')).toBeInTheDocument();
    unmount();

    setHour(4, 59);
    render(<SystemGreeting />);
    expect(screen.getByText('Dobry wieczór, gość •')).toBeInTheDocument();
  });

  it('updates greeting when time changes across boundary', () => {
    // Start at 11:59
    setHour(11, 59);

    render(<SystemGreeting />);
    expect(screen.getByText('Dzień dobry, gość •')).toBeInTheDocument();

    // Advance 1 minute to 12:00
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(screen.getByText('Witaj na pulpicie, gość •')).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = render(<SystemGreeting />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });

  it('applies custom className', () => {
    setHour(12);
    render(<SystemGreeting className="custom-class" />);
    const element = screen.getByText('Witaj na pulpicie, gość •');
    expect(element).toHaveClass('custom-class');
  });
});
