import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import Button from '../ui/Button';

export function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotalETB,
    deliveryFeeETB,
    grandTotalETB,
    triggerFault
  } = useCart();

  const navigate = useNavigate();

  // Failure path testing: deliberate render crash inside cart if toggled
  if (triggerFault) {
    throw new Error('Simulated Cart Render Crash: Unhandled state in CartPage item pipeline');
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🛒</div>
        <h2 className="empty-state-title">Your Order is Empty</h2>
        <p className="empty-state-text">
          Experience the authentic culinary heritage of Addis Ababa. Explore our slow-simmered wats, sizzling tibs, and vegan feasts.
        </p>
        <Link to="/menu">
          <Button variant="primary">Browse Addis Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            Your Order
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Review your authentic dishes before proceeding to secure checkout.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={clearCart}>
          Clear All
        </Button>
      </div>

      <div className="cart-layout">
        {/* Items List */}
        <div className="cart-items-card">
          {items.map((item) => {
            const lineTotal = item.price * item.qty;
            return (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-info">
                  <div className="cart-item-icon">🍲</div>
                  <div>
                    <Link
                      to={`/menu/${item.id}`}
                      style={{ color: 'var(--color-text-primary)', textDecoration: 'none' }}
                    >
                      <div className="cart-item-name">{item.name}</div>
                    </Link>
                    <div className="cart-item-price">
                      {item.price} ETB each &bull; <span style={{ color: 'var(--color-amber)' }}>{lineTotal} ETB</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Quantity Stepper */}
                  <div className="quantity-stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <span className="stepper-value" aria-live="polite">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: '1.25rem',
                      padding: '0.25rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--color-berbere)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    &times;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Running ETB Summary */}
        <div className="cart-summary-card">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
            Summary
          </h2>

          <div className="summary-row">
            <span>Dishes Subtotal</span>
            <span>{subtotalETB} ETB</span>
          </div>

          <div className="summary-row">
            <span>Fast Express Courier (Addis)</span>
            <span>{deliveryFeeETB === 0 ? 'FREE' : `${deliveryFeeETB} ETB`}</span>
          </div>

          {subtotalETB < 500 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--color-amber)', marginBottom: '0.75rem' }}>
              Add {500 - subtotalETB} ETB more to unlock FREE courier delivery!
            </div>
          )}

          <div className="summary-row summary-total">
            <span>Total Payable</span>
            <span style={{ color: 'var(--color-amber)' }}>{grandTotalETB} ETB</span>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button
              variant="primary"
              size="lg"
              style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout &rarr;
            </Button>
            <Link to="/menu" style={{ width: '100%' }}>
              <Button variant="secondary" style={{ width: '100%' }}>
                Add More Dishes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
