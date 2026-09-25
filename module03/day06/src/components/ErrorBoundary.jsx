import React from 'react';
import { GiCookingPot } from 'react-icons/gi';
import { FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Mesob House Application Error Boundary Caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          backgroundColor: '#FAF6F0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '0 16px 40px rgba(143, 45, 20, 0.12)',
            border: '1px solid rgba(143, 45, 20, 0.15)'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#FDF7E7',
              color: '#8F2D14',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              marginBottom: '20px'
            }}>
              <GiCookingPot />
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(143, 45, 20, 0.08)',
              color: '#8F2D14',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px'
            }}>
              <FiAlertTriangle />
              <span>HEARTH NOTICE</span>
            </div>

            <h2 style={{
              fontSize: '1.8rem',
              color: '#231F20',
              marginBottom: '8px',
              fontWeight: '700'
            }}>
              Something Went Wrong at Our Hearth
            </h2>

            <p style={{
              color: '#5C5252',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              An unexpected temporary issue occurred while preparing this view. Don't worry, your active cart and table reservation details are safely preserved.
            </p>

            <button
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#8F2D14',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '999px',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(143, 45, 20, 0.25)',
                transition: 'transform 0.2s ease, background 0.2s ease'
              }}
            >
              <FiRefreshCw />
              <span>Refresh Hearth Page (እንደገና ጫን)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
