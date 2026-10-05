'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginForm() {
  const [tab, setTab] = useState('guest'); // 'guest' or 'member'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  if (loggedIn) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--color-turmeric)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👋🏾</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
          እንኳን ደህና መጡ!
        </h2>
        <p style={{ color: 'var(--color-turmeric)', fontWeight: 600, marginBottom: '1.5rem' }}>
          Welcome, {name || phone || email || 'Honored Guest'}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Your Habesha dining profile is active. You can now track your orders and enjoy communal hospitality rewards.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/menu" className="btn btn-primary">
            Explore Menu &rarr;
          </Link>
          <Link href="/checkout" className="btn btn-secondary">
            View Active Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '20px',
      padding: '2.5rem',
      maxWidth: '480px',
      margin: '0 auto',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Tab Switcher */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--bg-secondary)',
        padding: '0.35rem',
        borderRadius: '10px',
        marginBottom: '2rem',
        border: '1px solid var(--border-color)'
      }}>
        <button
          type="button"
          onClick={() => setTab('guest')}
          style={{
            padding: '0.65rem',
            borderRadius: '8px',
            border: 'none',
            background: tab === 'guest' ? 'var(--bg-card)' : 'transparent',
            color: tab === 'guest' ? 'var(--color-turmeric)' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Guest Quick-Order
        </button>
        <button
          type="button"
          onClick={() => setTab('member')}
          style={{
            padding: '0.65rem',
            borderRadius: '8px',
            border: 'none',
            background: tab === 'member' ? 'var(--bg-card)' : 'transparent',
            color: tab === 'member' ? 'var(--color-turmeric)' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Mesob Club Login
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {tab === 'guest' ? (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eyasu"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: '#fff',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Mobile Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 91 123 4567"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: '#fff',
                  fontSize: '0.95rem'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem', display: 'block' }}>
                We'll text you SMS updates on your table and order status.
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eyasu@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: '#fff',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: '#fff',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.95rem' }}>
          {tab === 'guest' ? 'Continue as Guest &rarr;' : 'Sign In to Mesob Club &rarr;'}
        </button>
      </form>
    </div>
  );
}
