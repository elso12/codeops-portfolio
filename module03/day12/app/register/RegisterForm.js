'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    diningPreference: 'Traditional Mesob (Low Seating)',
    dietary: 'None',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    setError('');
    setIsRegistered(true);
  };

  if (isRegistered) {
    return (
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--color-turmeric)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '520px',
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
          እንኳን ደህና መጡ ወደ መሶብ ክለብ!
        </h2>
        <p style={{ color: 'var(--color-turmeric)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
          Welcome to Addis Eats Mesob Club, {formData.fullName}!
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Your member profile is ready. You will earn Gursha loyalty points, enjoy priority communal mesob bookings, and receive exclusive chef tasting invitations.
        </p>
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            textAlign: 'left',
            fontSize: '0.85rem',
            border: '1px solid var(--border-color)',
          }}
        >
          <div><strong style={{ color: 'var(--text-muted)' }}>Registered Email:</strong> <span style={{ color: '#fff' }}>{formData.email}</span></div>
          <div><strong style={{ color: 'var(--text-muted)' }}>Mobile Contact:</strong> <span style={{ color: '#fff' }}>{formData.phone}</span></div>
          <div><strong style={{ color: 'var(--text-muted)' }}>Preferred Seating:</strong> <span style={{ color: 'var(--color-turmeric)' }}>{formData.diningPreference}</span></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/menu" className="btn btn-primary">
            Explore Menu &rarr;
          </Link>
          <Link href="/reservations" className="btn btn-secondary">
            Book a Mesob
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '2.5rem',
        maxWidth: '520px',
        margin: '0 auto',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
          Create Your Member Account
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Join the Mesob Club for exclusive dining privileges &amp; reward points.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--color-paprika)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Full Name *
          </label>
          <input
            type="text"
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Almaz Bekele"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: '#fff',
              fontSize: '0.95rem',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="almaz@example.com"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Mobile Phone *
            </label>
            <input
              type="tel"
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+251 91 234 5678"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Password *
            </label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Confirm Password *
            </label>
            <input
              type="password"
              required
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Preferred Dining Seating
          </label>
          <select
            name="diningPreference"
            value={formData.diningPreference}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: '#fff',
              fontSize: '0.95rem',
            }}
          >
            <option value="Traditional Mesob (Low Seating)">Traditional Mesob (Low Seating)</option>
            <option value="Terrace Dining (Addis Views)">Terrace Dining (Addis Views)</option>
            <option value="Jebena Coffee Lounge">Jebena Coffee Lounge</option>
            <option value="Private VIP Room">Private VIP Room</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.95rem', marginTop: '0.5rem' }}>
          Register Account &rarr;
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-turmeric)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
}
