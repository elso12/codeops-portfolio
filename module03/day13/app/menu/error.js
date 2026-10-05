'use client';

import { useEffect } from 'react';

/**
 * app/menu/error.js - Client Component
 * 
 * Check yourself: Can you explain in one sentence why error.js needs "use client"?
 * Answer: In the Next.js App Router, error.js must be a Client Component because it functions as
 * a React Error Boundary that catches runtime client render errors and executes the interactive reset() callback.
 */
export default function MenuError({ error, reset }) {
  useEffect(() => {
    console.error('Menu route error caught by boundary:', error);
  }, [error]);

  return (
    <div style={{
      maxWidth: '650px',
      margin: '3rem auto',
      padding: '2.5rem',
      background: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: '16px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginBottom: '0.75rem' }}>
        Unable to Load Mesob Offerings
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
        {error?.message || 'A temporary issue occurred while rendering the kitchen menu.'}
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.75rem' }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
