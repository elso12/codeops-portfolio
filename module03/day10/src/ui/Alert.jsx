import React from 'react';

export function Alert({ variant = 'error', title, children, action }) {
  const icon = variant === 'error' ? '⚠️' : variant === 'success' ? '✓' : 'ℹ️';

  return (
    <div className={`alert alert-${variant}`} role="alert">
      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        {title && <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{title}</strong>}
        <div>{children}</div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default Alert;
