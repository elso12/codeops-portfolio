import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Receipt - Lazy-loaded order confirmation screen.
 *
 * Requirements (Day 34 Section 2):
 * - Code-split behind lazy and Suspense
 * - Shows confirmation receipt with order id, line items, and delivery estimate
 */
export default function Receipt() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('addis_last_order');
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved order:', e);
      }
    }
  }, []);

  if (!order) {
    return (
      <div className="receipt-container">
        <div className="receipt-card">
          <h2>No Recent Order Found</h2>
          <p>You have not placed an order in this browsing session.</p>
          <Link to="/" className="btn-primary">
            ← Return to Menu Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-container">
      <div className="receipt-card">
        <div className="receipt-success-badge">✅ Order Confirmed!</div>
        <h2 className="receipt-title">Beteseb, Your Feast is on the Way!</h2>
        <p className="receipt-subtitle">
          The kitchen at Addis Eats has accepted your order and started preparation.
        </p>

        <div className="receipt-meta-box">
          <div className="meta-col">
            <span className="meta-label">Order Number</span>
            <span className="meta-val">{order.orderNumber}</span>
          </div>
          <div className="meta-col">
            <span className="meta-label">Estimated Delivery</span>
            <span className="meta-val">30 - 45 mins</span>
          </div>
          <div className="meta-col">
            <span className="meta-label">Payment</span>
            <span className="meta-val" style={{ textTransform: 'capitalize' }}>
              {order.customer.paymentMethod}
            </span>
          </div>
        </div>

        <div className="receipt-details-section">
          <h3>Items Ordered:</h3>
          <ul className="receipt-items-list">
            {order.items.map((item) => (
              <li key={item.id} className="receipt-item-row">
                <span>
                  {item.qty}x {item.name}
                </span>
                <span>{item.price * item.qty} ETB</span>
              </li>
            ))}
          </ul>

          <div className="receipt-summary-footer">
            <div className="summary-line">
              <span>Total Paid:</span>
              <span className="receipt-grand-total">{order.total} ETB</span>
            </div>
            <div className="summary-line customer-line">
              <span>Deliver To:</span>
              <span>
                {order.customer.fullName} • {order.customer.neighborhood} (
                {order.customer.phone})
              </span>
            </div>
          </div>
        </div>

        <div className="receipt-actions">
          <Link to="/" className="btn-return-menu">
            🍽️ Order More Dishes
          </Link>
        </div>
      </div>
    </div>
  );
}
