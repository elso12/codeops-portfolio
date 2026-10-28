import React from 'react';

export function Spinner({ size = 'md', label = 'Loading content...' }) {
  const pixelSize = size === 'sm' ? 20 : size === 'lg' ? 48 : 32;

  return (
    <div
      role="status"
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          border: '3px solid rgba(245, 158, 11, 0.2)',
          borderTopColor: '#F59E0B',
          borderRadius: '50%',
          animation: 'spin 0.8s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite',
        }}
      />
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {label}
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Spinner;
