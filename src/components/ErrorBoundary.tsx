import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL: Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    try {
      if ('caches' in window) {
        caches.keys().then(keys => {
          keys.forEach(k => caches.delete(k));
        }).finally(() => {
          window.location.reload();
        });
        return;
      }
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
    window.location.reload();
  };

  private handleResetData = () => {
    try {
      localStorage.removeItem('krishna-kirana-store');
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(keys => {
          keys.forEach(k => caches.delete(k));
        });
      }
    } catch (e) {
      console.warn('Reset error:', e);
    }
    window.location.href = window.location.origin;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <AlertTriangle size={32} />
            </div>
            
            <h1 className="text-xl font-black text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              We encountered an unexpected display issue. Please reload or reset the app cache to continue shopping.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw size={18} /> Reload Store
              </button>

              <button
                type="button"
                onClick={this.handleResetData}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
              >
                <Trash2 size={15} /> Reset Local Data & Clear Cache
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left border-t border-gray-100 pt-4">
                <summary className="text-xs text-gray-400 cursor-pointer font-mono hover:text-gray-600 select-none">
                  Error Details (Click to view)
                </summary>
                <div className="mt-2 p-3 bg-gray-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-auto max-h-36 leading-relaxed whitespace-pre-wrap">
                  {this.state.error.toString()}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
