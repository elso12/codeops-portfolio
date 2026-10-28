import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Button from '../ui/Button';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/checkout';

  const [name, setName] = useState('Abebe Bikila');
  const [phone, setPhone] = useState('0911223344');
  const [area, setArea] = useState('Bole');

  function handleLogin(e) {
    if (e) e.preventDefault();
    login({ name, phone, area });
    // Seamlessly return to guarded route
    navigate(from, { replace: true });
  }

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto' }}>
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', marginBottom: '0.5rem' }}>
            Sign In to Continue
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Checkout requires a verified Addis Eats account. You will automatically be returned to{' '}
            <code style={{ color: 'var(--color-amber)', background: 'var(--color-bg)', padding: '2px 6px', borderRadius: '4px' }}>
              {from}
            </code>.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-name">
              Full Name
            </label>
            <input
              id="login-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-phone">
              TeleBirr / Phone Number
            </label>
            <input
              id="login-phone"
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-area">
              Default Delivery Area
            </label>
            <select
              id="login-area"
              className="form-select"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="Bole">Bole (Atlas, Medhanialem, Rwanda)</option>
              <option value="Kazanchis">Kazanchis (UNECA, Intercontinental)</option>
              <option value="Megenagna">Megenagna (Lem Hotel, Signal)</option>
              <option value="Piassa">Piassa (Churchill, Arada)</option>
              <option value="Sarbet">Sarbet (AU, Pushkin)</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ width: '100%', marginTop: '1.25rem' }}
          >
            Sign In & Return to Checkout &rarr;
          </Button>
        </form>

        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '2rem', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
            DEMO EXAMINER SHORTCUT (ONE-CLICK)
          </div>
          <Button
            variant="secondary"
            size="sm"
            style={{ width: '100%' }}
            onClick={() => handleLogin()}
          >
            Instant Sign-In as &ldquo;Abebe Bikila&rdquo;
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
