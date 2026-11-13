import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext.jsx';

export default function CartPanel() {
  const { cart, itemCount, totalPrice, addToCart, removeFromCart, clearCart, isCartCorrupted } = useCart();
  const navigate = useNavigate();

  if (isCartCorrupted) {
    throw new Error(
      'Simulated render error in CartPanel — proves that Cart Boundary catches failures independently while Menu and Header stay alive.'
    );
  }

  return (
    <aside className="cart-panel" aria-labelledby="cart-heading">
      <div className="cart-top">
        <h2 id="cart-heading" className="section-title">Your Order</h2>
        {cart.length > 0 && (
          <button type="button" className="btn-ghost" onClick={clearCart}>
            Clear
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <span aria-hidden="true">🛍</span>
          <p>Your order is empty.</p>
          <p className="cart-hint">Pick a dish from the menu to get started.</p>
        </div>
      ) : (
        <>
          <ul className="cart-list" aria-label="Cart items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">{item.price} ETB ea.</span>
                </div>

                <div className="cart-item-controls">
                  <div className="stepper" role="group" aria-label={`Quantity for ${item.name}`}>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Decrease ${item.name}`}
                    >−</button>
                    <span className="stepper-val">{item.qty}</span>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => addToCart(item)}
                      aria-label={`Increase ${item.name}`}
                    >+</button>
                  </div>
                  <span className="cart-item-sub">{item.price * item.qty} ETB</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Items ({itemCount})</span>
              <span>{totalPrice} ETB</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{totalPrice} ETB</span>
            </div>

            <button
              type="button"
              className="btn-primary btn-checkout"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
