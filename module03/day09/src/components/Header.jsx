import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../cart/CartContext.jsx';

export default function Header({
  onTriggerDishCrash,
  isDishCrashed,
  onResetDishCrash,
}) {
  const { itemCount, totalPrice, triggerCartCrash, isCartCorrupted, resetCartCrash } = useCart();
  const location = useLocation();
  const [isGreyscale, setIsGreyscale] = useState(false);

  const toggleGreyscale = () => {
    setIsGreyscale((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('simulating-greyscale');
      } else {
        document.body.classList.remove('simulating-greyscale');
      }
      return next;
    });
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="brand" aria-label="Addis Eats Homepage">
          <div className="brand-badge" aria-hidden="true">
            🇪🇹
          </div>
          <div className="brand-text">
            <h1>Addis Eats</h1>
            <p>Authentic Ethiopian Cuisine • Gourmet Kitchen & Checkout</p>
          </div>
        </Link>

        <div className="header-controls">
          <nav className="mode-tabs" role="navigation" aria-label="Main Navigation">
            <Link
              to="/"
              className={`nav-tab-btn ${location.pathname === '/' || location.pathname === '/menu' ? 'active' : ''}`}
            >
              🍽️ Kitchen Menu
            </Link>
            <Link
              to="/checkout"
              className={`nav-tab-btn ${location.pathname === '/checkout' ? 'active' : ''}`}
            >
              💳 Checkout
            </Link>
          </nav>

          {/* Cart Badge Pill */}
          <Link
            to="/"
            className="cart-badge-pill"
            aria-label={`Cart with ${itemCount} items, total ${totalPrice} ETB`}
          >
            🛒 <span className="cart-badge-count">{itemCount}</span> items
            <span className="cart-badge-price">({totalPrice} ETB)</span>
          </Link>

          {/* Day 8 Accessibility Greyscale Toggle */}
          <button
            type="button"
            className={`btn-toggle-greyscale ${isGreyscale ? 'active' : ''}`}
            onClick={toggleGreyscale}
            aria-pressed={isGreyscale}
            title="Test accessibility without relying on colour"
          >
            <span aria-hidden="true">👁️</span>
            <span>{isGreyscale ? 'Exit Greyscale' : 'Test Greyscale'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Fault Injection & Diagnostic Test Bar (Day 8 / Day 9 Spec) */}
      <div className="testing-toolbar" role="region" aria-label="Fault Injection & Resiliency Test Bar">
        <div className="testing-toolbar-inner">
          <span className="toolbar-label">🧪 Resilience Seams:</span>

          {/* Deliberate Dish Error Toggle (Exercise 2) */}
          {!isDishCrashed ? (
            <button
              type="button"
              className="btn-toolbar btn-toolbar-danger"
              onClick={onTriggerDishCrash}
              title="Throw deliberately inside Kitfo dish to prove Menu boundary catches it while Header & Cart stay alive"
            >
              💥 Crash Dish (Menu Boundary)
            </button>
          ) : (
            <button
              type="button"
              className="btn-toolbar btn-toolbar-success"
              onClick={onResetDishCrash}
            >
              ✅ Heal Menu Catalog
            </button>
          )}

          {/* Deliberate Cart Error Toggle (Exercise 3) */}
          {!isCartCorrupted ? (
            <button
              type="button"
              className="btn-toolbar btn-toolbar-warning"
              onClick={triggerCartCrash}
              title="Throw deliberately inside Cart Panel to prove Cart boundary catches it while Menu & Header stay alive"
            >
              💥 Crash Cart Panel (Cart Boundary)
            </button>
          ) : (
            <button
              type="button"
              className="btn-toolbar btn-toolbar-success"
              onClick={resetCartCrash}
            >
              ✅ Heal Cart Panel
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
