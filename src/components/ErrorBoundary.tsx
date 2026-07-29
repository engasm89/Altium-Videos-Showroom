import React from 'react';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

/**
 * Catches render errors so a single broken view cannot blank the whole SPA.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('UI error boundary', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4 py-16 text-slate-100">
          <div className="max-w-md space-y-4 text-center">
            <h1 className="text-xl font-bold text-white">Something went wrong</h1>
            <p className="text-sm text-slate-400">
              This screen hit an unexpected error. Your progress in this browser is unchanged.
            </p>
            <p className="text-xs font-mono text-amber-300/90 break-all">{this.state.error.message}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => this.setState({ error: null })}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Try again
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-200 text-xs font-semibold"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
