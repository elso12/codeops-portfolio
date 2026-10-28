import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export function NotFound() {
  return (
    <div className="empty-state" style={{ maxWidth: '600px', margin: '4rem auto' }}>
      <div className="empty-state-icon">🗺️</div>
      <div style={{ color: 'var(--color-amber)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>
        404 ERROR &bull; ROUTE NOT FOUND
      </div>
      <h1 className="empty-state-title" style={{ fontSize: '2rem' }}>
        Lost in Addis Ababa?
      </h1>
      <p className="empty-state-text">
        The route you navigated to does not exist in our menu or kitchen dispatch ledger. Let&rsquo;s get you back to the aroma of fresh injera and stews!
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/menu">
          <Button variant="primary">Browse Addis Menu &rarr;</Button>
        </Link>
        <Link to="/">
          <Button variant="secondary">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
