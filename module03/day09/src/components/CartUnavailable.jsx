import React from 'react';

/**
 * CartUnavailable - Accessible fallback component when Cart panel crashes.
 *
 * Requirements (Day 34 Section 1 & Exercise 3):
 * - Independent boundary around cart panel
 * - Proves that cart failure does not take down the menu or header
 * - Offers recovery button to clear error or restore safe state
 */
export default function CartUnavailable({ error, onReset }) {
  return (
    <aside
      role="alert"
      className="sidebar error-boundary-fallback cart-fallback-card"
      data-testid="cart-error-boundary"
    >
      <div className="fallback-badge">⚠️ Cart Region Isolated Failure</div>
      <h3 className="fallback-title">Cart Panel Encountered an Issue</h3>
      <p className="fallback-desc">
        A render exception occurred within the order panel. 
        <strong> Good news:</strong> The dishes catalog and navigation header are still running smoothly.
      </p>

      {error && (
        <details className="fallback-tech-details">
          <summary>Technical Details</summary>
          <pre className="fallback-pre">{error.stack || error.message}</pre>
        </details>
      )}

      <div className="fallback-actions">
        <button
          type="button"
          onClick={onReset}
          className="btn-fallback-retry"
        >
          🔄 Reset Cart Panel
        </button>
      </div>
    </aside>
  );
}
