'use client';

import { useState } from 'react';

export default function MenuCounter() {
  const [count, setCount] = useState(0);

  return (
    <div
      className="layout-counter-box"
      style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--primary-accent)',
          marginBottom: '0.35rem',
        }}
      >
        Layout State Counter
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Tests that layout state persists during client-side navigation between menu and dish views.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          id="counter-decrement-btn"
          onClick={() => setCount((c) => c - 1)}
          className="btn btn-secondary"
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.9rem' }}
          aria-label="Decrement counter"
        >
          -
        </button>
        <span
          id="layout-counter-value"
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            minWidth: '2rem',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          {count}
        </span>
        <button
          id="counter-increment-btn"
          onClick={() => setCount((c) => c + 1)}
          className="btn btn-primary"
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.9rem' }}
          aria-label="Increment counter"
        >
          +
        </button>
      </div>
    </div>
  );
}
