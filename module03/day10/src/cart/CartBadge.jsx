import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

export function CartBadge() {
  const { totalItemCount, subtotalETB } = useCart();

  return (
    <Link to="/cart" className="cart-badge-btn" aria-label={`View cart: ${totalItemCount} items, total ${subtotalETB} ETB`}>
      <span style={{ fontSize: '1.15rem' }}>🛍️</span>
      <span style={{ display: 'none' }} className="cart-desktop-text">
        Cart
      </span>
      <span className="cart-counter" aria-live="polite">
        {totalItemCount}
      </span>
      {subtotalETB > 0 && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-amber)', fontWeight: 700 }}>
          {subtotalETB} ETB
        </span>
      )}
    </Link>
  );
}

export default CartBadge;
