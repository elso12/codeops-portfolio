import React from 'react';

/**
 * RouteSkeleton - Animated content skeleton for route-level Suspense boundaries.
 *
 * Requirements (Day 34 Section 2):
 * - Keeps layout stable while dynamic chunk downloads
 * - Avoids jarring cumulative layout shifts (CLS)
 * - Shimmering placeholder bars simulating headings, inputs, and summaries
 */
export default function RouteSkeleton({ title = 'Loading screen...' }) {
  return (
    <div className="skeleton-container" aria-busy="true" aria-label={title}>
      <div className="skeleton-header">
        <div className="skeleton-shimmer skeleton-badge"></div>
        <div className="skeleton-shimmer skeleton-title"></div>
        <div className="skeleton-shimmer skeleton-subtitle"></div>
      </div>

      <div className="skeleton-grid">
        <div className="skeleton-main-card">
          <div className="skeleton-shimmer skeleton-line short"></div>
          <div className="skeleton-shimmer skeleton-input"></div>
          <div className="skeleton-shimmer skeleton-line short"></div>
          <div className="skeleton-shimmer skeleton-input"></div>
          <div className="skeleton-shimmer skeleton-line short"></div>
          <div className="skeleton-shimmer skeleton-input"></div>
          <div className="skeleton-shimmer skeleton-btn"></div>
        </div>

        <div className="skeleton-side-card">
          <div className="skeleton-shimmer skeleton-line medium"></div>
          <div className="skeleton-shimmer skeleton-row"></div>
          <div className="skeleton-shimmer skeleton-row"></div>
          <div className="skeleton-shimmer skeleton-divider"></div>
          <div className="skeleton-shimmer skeleton-total"></div>
        </div>
      </div>
    </div>
  );
}
