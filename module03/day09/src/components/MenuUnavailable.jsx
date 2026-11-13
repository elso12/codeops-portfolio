import React from 'react';

/**
 * MenuUnavailable - Accessible fallback component when Menu catalog crashes.
 *
 * Requirements (Day 34 Section 1):
 * - Tells the person clearly what failed
 * - Confirms that other app regions (Header, Cart) are still alive
 * - Offers an immediate actionable recovery (Retry / Clear error)
 */
export default function MenuUnavailable({ error, onReset }) {
  return (
    <div
      role="alert"
      className="error-boundary-fallback menu-fallback-card"
      data-testid="menu-error-boundary"
    >
      <div className="fallback-badge">⚠️ Menu Catalog Isolated Failure</div>
      <h3 className="fallback-title">Unable to Load Kitchen Catalog</h3>
      <p className="fallback-desc">
        A render error occurred inside the menu catalog component. 
        <strong> Good news:</strong> Your cart, existing items, and header balance remain completely safe and operational.
      </p>

      {error && (
        <details className="fallback-tech-details">
          <summary>Technical Diagnostics (Render Error)</summary>
          <pre className="fallback-pre">{error.stack || error.message}</pre>
        </details>
      )}

      <div className="fallback-actions">
        <button
          type="button"
          onClick={onReset}
          className="btn-fallback-retry"
        >
          🔄 Restore Menu Catalog
        </button>
      </div>
    </div>
  );
}
