import React, { useState } from 'react';
import Checkout from './checkout/Checkout.jsx';
import CheckoutHookForm from './checkout/CheckoutHookForm.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('by-hand'); // 'by-hand' | 'hook-form'
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
    <div className="app">
      <a href="#main-form-heading" className="skip-to-content">
        Skip to Checkout Form
      </a>

      <header className="app-header">
        <div className="header-container">
          <a href="/" className="brand" aria-label="Addis Eats Homepage">
            <div className="brand-badge" aria-hidden="true">
              🇪🇹
            </div>
            <div className="brand-text">
              <h1>Addis Eats</h1>
              <p>Authentic Ethiopian Cuisine · Express Checkout</p>
            </div>
          </a>

          <div className="header-controls">
            <div className="mode-tabs" role="tablist" aria-label="Checkout implementation mode">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'by-hand'}
                className={`btn-toggle-greyscale ${activeTab === 'by-hand' ? 'active' : ''}`}
                onClick={() => setActiveTab('by-hand')}
              >
                Controlled (By Hand)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'hook-form'}
                className={`btn-toggle-greyscale ${activeTab === 'hook-form' ? 'active' : ''}`}
                onClick={() => setActiveTab('hook-form')}
              >
                React Hook Form + Zod
              </button>
            </div>

            <button
              type="button"
              className={`btn-toggle-greyscale ${isGreyscale ? 'active' : ''}`}
              onClick={toggleGreyscale}
              aria-pressed={isGreyscale}
              title="Test accessibility without relying on colour"
            >
              <span aria-hidden="true">👁️</span>
              {isGreyscale ? 'Exit Greyscale' : 'Test Greyscale Mode'}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="page-title-section">
          <span className="page-badge">Module 3 · Day 33 Mini-Project</span>
          <h2 id="main-form-heading" className="page-title">
            {activeTab === 'by-hand'
              ? 'Hand-Crafted Controlled Checkout'
              : 'Declarative React Hook Form Checkout'}
          </h2>
          <p className="page-subtitle">
            {activeTab === 'by-hand'
              ? 'All four fields in one state object, pure validate(form) on render, touched tracking on blur, accessible aria wiring, and zero data loss on failure.'
              : 'Uncontrolled registration with useForm, Zod schema validation, minimal re-renders, and automatic state tracking.'}
          </p>
        </div>

        <div className="checkout-grid">
          <div className="checkout-main">
            {activeTab === 'by-hand' ? <Checkout /> : <CheckoutHookForm />}
          </div>

          <aside className="order-summary-card" aria-label="Order Basket">
            <div className="summary-header">
              <h3>Order Basket</h3>
              <span className="badge-pill">3 Items</span>
            </div>

            <div className="items-list">
              <div className="order-item">
                <div className="item-info">
                  <span className="item-qty">1×</span>
                  <span className="item-name">Special Doro Wat</span>
                </div>
                <span className="item-price">380 ETB</span>
              </div>

              <div className="order-item">
                <div className="item-info">
                  <span className="item-qty">1×</span>
                  <span className="item-name">Shiro Tegabino w/ Injera</span>
                </div>
                <span className="item-price">220 ETB</span>
              </div>

              <div className="order-item">
                <div className="item-info">
                  <span className="item-qty">2×</span>
                  <span className="item-name">Traditional Buna Ceremony</span>
                </div>
                <span className="item-price">80 ETB</span>
              </div>
            </div>

            <div className="calc-breakdown">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>680 ETB</span>
              </div>
              <div className="calc-row">
                <span>Doorstep Delivery (Addis Ababa)</span>
                <span>50 ETB</span>
              </div>
              <div className="calc-total">
                <span className="total-label">Total to Pay</span>
                <span className="total-amount">730 ETB</span>
              </div>
            </div>

            <div className="telebirr-banner">
              <span style={{ fontSize: '1.4rem' }} aria-hidden="true">📱</span>
              <div>
                <strong>TeleBirr Express Payment</strong>
                <p>Instant SMS payment prompt will be pushed to your phone upon placing order.</p>
              </div>
            </div>

            {/* Checklist audit reminder */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                Key Checkpoints:
              </div>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <li>Enter submits the form cleanly</li>
                <li>Full keyboard tab navigation</li>
                <li>Untouched fields stay quiet</li>
                <li>Correction clears errors live</li>
                <li>Button disabled during submit</li>
                <li>Zero data loss on failed API</li>
                <li>Accessible in 100% greyscale</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Addis Eats · CodeOps Full Stack Software Development · Module 3 · Day 33 Mini-Project
        </p>
      </footer>
    </div>
  );
}
