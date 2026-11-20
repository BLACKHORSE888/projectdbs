import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let display = error.message || 'An unexpected error occurred.';
    try {
      const parsed = JSON.parse(display);
      if (parsed?.error) {
        display = parsed.error;
      }
    } catch {
      // Non-JSON error message
    }
    return { hasError: true, message: display };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5EFE0] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EAE0C8] shadow-soft text-center">
            <AlertTriangle className="w-12 h-12 text-[#D98222] mx-auto mb-4" />
            <h1 className="text-xl font-bold text-[#1F2421] mb-2">Something went wrong</h1>
            <p className="text-sm text-[#525B56] mb-6">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F6B3F] text-white text-sm font-semibold hover:bg-[#265833] transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
