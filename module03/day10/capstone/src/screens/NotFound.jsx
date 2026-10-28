import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="capstone-card" style={{ textAlign: 'center', padding: '3.5rem', maxWidth: '540px', margin: '3rem auto' }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏥</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        404 &bull; Clinical Route Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        The requested medical record or clinic route is not present in the MedAddis register.
      </p>
      <Link
        to="/"
        style={{
          background: 'var(--primary)',
          color: '#fff',
          padding: '0.65rem 1.25rem',
          borderRadius: '8px',
          fontWeight: 600,
        }}
      >
        Return to Triage Dashboard &rarr;
      </Link>
    </div>
  );
}

export default NotFound;
