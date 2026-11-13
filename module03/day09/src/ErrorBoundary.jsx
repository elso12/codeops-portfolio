import React from 'react';

/**
 * ErrorBoundary — the one class you still write (Day 34 · Section 1).
 *
 * getDerivedStateFromError  → update state so the fallback renders.
 * componentDidCatch         → side-effect: log to console / telemetry.
 *
 * Props
 *   fallback  ReactElement  shown when a child throws during render
 *   onReset   () => void    optional — called when the boundary resets itself
 */
export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.error) {
      const { fallback } = this.props;
      if (typeof fallback === 'function') {
        return fallback({
          error: this.state.error,
          reset: this.handleReset,
          onReset: this.handleReset,
        });
      }
      if (React.isValidElement(fallback)) {
        // Only clone if it's a React component (not a host HTML tag like 'div')
        if (typeof fallback.type === 'string') {
          return fallback;
        }
        return React.cloneElement(fallback, {
          error: this.state.error,
          onReset: this.handleReset,
          reset: this.handleReset,
        });
      }
      return fallback ?? null;
    }
    return this.props.children;
  }
}
