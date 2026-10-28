import React from 'react';

export function Badge({ children, variant = 'amber', className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}

export default Badge;
