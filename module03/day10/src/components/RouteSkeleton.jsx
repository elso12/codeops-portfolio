import React from 'react';

export function RouteSkeleton({ title = 'Loading Screen...' }) {
  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <div
        className="skeleton"
        style={{ height: '40px', width: '280px', marginBottom: '1.5rem' }}
      />
      <div
        className="skeleton"
        style={{ height: '20px', width: '450px', marginBottom: '2.5rem' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem' }}>
        <div>
          <div className="skeleton" style={{ height: '56px', marginBottom: '1.25rem' }} />
          <div className="skeleton" style={{ height: '56px', marginBottom: '1.25rem' }} />
          <div className="skeleton" style={{ height: '56px', marginBottom: '1.25rem' }} />
          <div className="skeleton" style={{ height: '120px', marginBottom: '1.5rem' }} />
          <div className="skeleton" style={{ height: '48px', width: '100%' }} />
        </div>

        <div>
          <div className="skeleton" style={{ height: '240px', borderRadius: '16px' }} />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
        {title}
      </div>
    </div>
  );
}

export default RouteSkeleton;
