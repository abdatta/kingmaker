// Route-level error boundary. Catches render-time exceptions in a screen so
// the rest of the app shell (sidebar / topbar / AI rail) keeps working and
// the user can navigate away. Resets automatically when the URL changes.
import React from 'react';
import { useLocation } from 'react-router-dom';

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Route error:', error, info);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="px-6 py-8 max-w-[720px] text-slate-300">
          <div className="text-[11px] uppercase tracking-[0.14em] text-rose-400">Render error</div>
          <h1 className="text-[20px] font-semibold text-slate-100 mt-1">
            Something broke on this screen.
          </h1>
          <p className="text-[12.5px] text-slate-400 mt-2">
            The rest of the app is still usable — navigate away from this route or reload.
          </p>
          <pre className="mt-4 rounded border border-slate-800 bg-slate-900/60 p-3 text-[11.5px] text-rose-300 whitespace-pre-wrap break-words">
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export function RouteErrorBoundary({ children }) {
  const location = useLocation();
  return <ErrorBoundaryInner resetKey={location.pathname}>{children}</ErrorBoundaryInner>;
}
