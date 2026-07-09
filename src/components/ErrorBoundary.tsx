import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-200 select-none">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wider">KRYTYCZNY BŁĄD SYSTEMU</h1>
            <p className="text-sm text-slate-400">
              Coś poszło nie tak. Interfejs napotkał nieoczekiwany problem i nie mógł zostać wyrenderowany.
            </p>
            {this.state.error && (
              <div className="w-full bg-black/50 p-3 rounded border border-slate-800 text-left overflow-x-auto mt-2">
                <code className="text-[10px] text-rose-400 font-mono">
                  {this.state.error.message}
                </code>
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="mt-6 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded border border-amber-400 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Odśwież stronę</span>
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
