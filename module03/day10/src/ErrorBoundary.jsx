import React, { Component } from 'react';
import Button from './ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary captured render exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({
              error: this.state.error,
              resetErrorBoundary: this.handleReset,
            })
          : this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            maxWidth: '680px',
            margin: '3rem auto',
            padding: '2.5rem',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-berbere-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🛡️</span>
            <div>
              <div style={{ color: 'var(--color-berbere)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                ERROR BOUNDARY INTERCEPT
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem' }}>
                Something went wrong in this screen component
              </h2>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            A runtime error occurred during the React component render pass. The Error Boundary prevented the entire application tree from crashing.
          </p>

          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              color: '#FCA5A5',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              wordBreak: 'break-word',
            }}
          >
            {this.state.error?.message || 'Unknown render error'}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={this.handleReset}>
              🔄 Try Again / Reset Component
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                this.handleReset();
                window.location.href = '/';
              }}
            >
              Return to Safe Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
