'use client';

import Link from 'next/link';
import { useCart } from '../../lib/CartContext';

/**
 * CartClient - Interactive Leaf Client Component
 * 
 * Requirement 4: Move each directive down to the smallest component that genuinely needs it.
 * The cart page itself is a Server Component; only this interactive items table,
 * quantity toggles, and total calculation need "use client".
 */
export default function CartClient() {
  const { items, updateQty, subtotal } = useCart();

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '1.75rem'
    }}>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Your mesob cart is currently empty.
          </p>
          <Link href="/menu" className="btn btn-primary">
            Browse Habesha Menu
          </Link>
        </div>
      ) : (
        <div>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: 0
          }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-card)',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {item.name}
                  </h3>
                  <span style={{ color: 'var(--color-turmeric)', fontWeight: 600 }}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, -1)}
                    className="btn btn-secondary"
                    style={{ padding: '0.2rem 0.6rem' }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 700, minWidth: '1.5rem', textAlign: 'center' }}>
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, 1)}
                    className="btn btn-primary"
                    style={{ padding: '0.2rem 0.6rem' }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Estimated Subtotal
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-turmeric)' }}>
                ${subtotal.toFixed(2)}
              </div>
            </div>
            <Link
              href="/checkout"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Proceed to Dynamic Checkout &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
