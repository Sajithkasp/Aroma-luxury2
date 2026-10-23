import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'An unexpected error occurred.' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('aurora_luxe_config_v2');
      localStorage.removeItem('aurora_luxe_products_v2');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6 text-zinc-900 font-sans">
          <div className="max-w-md w-full bg-white border border-[#e8e2d5] rounded-2xl shadow-xl p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center text-amber-600 text-2xl font-bold">
              !
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-zinc-900">Refreshing Store Data</h2>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                The storefront encountered a temporary syncing issue. Click below to reload with latest cloud data.
              </p>
            </div>
            {this.state.errorMessage && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-[11px] font-mono text-zinc-600 text-left overflow-auto max-h-24">
                {this.state.errorMessage}
              </div>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#b58d4a] hover:bg-[#9c7637] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 rounded-lg text-xs font-medium transition-colors"
              >
                Reset Store Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
