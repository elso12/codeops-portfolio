import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import CartBadge from '../cart/CartBadge';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { networkState } from '../api/menu';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { setTriggerFault } = useCart();
  const navigate = useNavigate();

  // Diagnostic states for failure checks
  const [isGreyscale, setIsGreyscale] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  function toggleGreyscale() {
    const next = !isGreyscale;
    setIsGreyscale(next);
    document.body.classList.toggle('simulating-greyscale', next);
  }

  function toggleThrottling() {
    const next = !isThrottled;
    setIsThrottled(next);
    networkState.throttleSlow3G = next;
  }

  function toggleFailure() {
    const next = !isFailed;
    setIsFailed(next);
    networkState.simulateFailure = next;
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      {/* Diagnostic & Failure Path Verification Bar */}
      <div className="diagnostic-bar">
        <div className="diagnostic-badges">
          <span className="diagnostic-tag">DAY 35 VERIFICATION HUD</span>
          <span>Test failure states & accessibility live:</span>
        </div>

        <div className="diagnostic-actions">
          <button
            type="button"
            className={`diag-btn ${isGreyscale ? 'active' : ''}`}
            onClick={toggleGreyscale}
            title="Day 33 Accessibility: Test visual contrast without color"
          >
            {isGreyscale ? '👁️ Greyscale: ON' : '👁️ Greyscale Test'}
          </button>

          <button
            type="button"
            className={`diag-btn ${isThrottled ? 'active' : ''}`}
            onClick={toggleThrottling}
            title="Day 35 Failure Check 1: Throttle to Slow 3G"
          >
            {isThrottled ? '⏳ Slow 3G: ON (1.5s)' : '⏳ Throttle Slow 3G'}
          </button>

          <button
            type="button"
            className={`diag-btn ${isFailed ? 'active' : ''}`}
            onClick={toggleFailure}
            title="Day 35 Failure Check 2: Simulate Gateway / Data Failure"
          >
            {isFailed ? '💥 Network Error: ACTIVE' : '💥 Simulate Fetch Error'}
          </button>

          <button
            type="button"
            className="diag-btn"
            onClick={() => setTriggerFault(true)}
            title="Day 34: Test Error Boundary catching a render crash"
          >
            ⚡ Test Error Boundary
          </button>
        </div>
      </div>

      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon" role="img" aria-label="Addis Eats logo">🍲</span>
            <div>
              <div className="brand-title">Addis Eats</div>
              <div className="brand-tagline">Ethiopian Gourmet Express</div>
            </div>
          </Link>

          <nav className="nav-links" aria-label="Main Navigation">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
            <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Menu
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Cart
            </NavLink>
            <NavLink to="/checkout" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Checkout
            </NavLink>
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <div className="user-pill">
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <span>{user.name.split(' ')[0]}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.75rem',
                    marginLeft: '4px',
                    textDecoration: 'underline',
                  }}
                  title="Sign out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-amber)',
                  fontWeight: 600,
                  padding: '0.35rem 0.65rem',
                }}
              >
                Sign In
              </Link>
            )}

            <CartBadge />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
