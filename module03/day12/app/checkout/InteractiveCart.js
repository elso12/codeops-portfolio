'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InteractiveCart({ initialSessionId, initialTablePreference }) {
  const [items, setItems] = useState([
    {
      id: 'doro-wat',
      name: 'Royal Doro Wat (የንጉሥ ዶሮ ወጥ)',
      sub: 'Free-range chicken, berbere, farm egg, 2 teff injeras',
      price: 24.00,
      qty: 1
    },
    {
      id: 'beyaynetu',
      name: 'Grand Yetsom Beyaynetu (የጾም በያይነቱ ድግስ)',
      sub: 'Rainbow fasting platter with 6 traditional vegetable wats',
      price: 21.00,
      qty: 1
    }
  ]);

  const [seating, setSeating] = useState(initialTablePreference);
  const [extraInjera, setExtraInjera] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0) + (extraInjera ? 4.00 : 0);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  if (isOrdered) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--color-turmeric)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-turmeric)', letterSpacing: '1px', textTransform: 'uppercase' }}>
          ትእዛዝዎ ተጠናቋል · Order Received
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem', color: '#fff' }}>
          Melkam Megeb! (መልካም ምግብ)
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
          Your order has been sent to our master chefs in the kitchen. 
          Your handcrafted mesob will be served hot with fresh sourdough teff injera.
        </p>

        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          maxWidth: '460px',
          margin: '0 auto 2rem',
          textAlign: 'left',
          fontSize: '0.9rem'
        }}>
          <div><strong>Order Ref:</strong> <code style={{ color: 'var(--color-turmeric)' }}>HABESHA-ORD-{Math.floor(1000 + Math.random() * 9000)}</code></div>
          <div style={{ marginTop: '0.35rem' }}><strong>Dining Style:</strong> <span>{seating}</span></div>
          <div style={{ marginTop: '0.35rem' }}><strong>Amount Charged:</strong> <span style={{ fontWeight: 800, color: '#fff' }}>${total.toFixed(2)}</span></div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/menu" className="btn btn-primary">
            Explore More Dishes &rarr;
          </Link>
          <button
            onClick={() => setIsOrdered(false)}
            className="btn btn-secondary"
          >
            Create Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Seating Preference Selector */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🧺</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-turmeric)' }}>
            Dining Seating &amp; Service Style
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {[
            'Traditional Handcrafted Mesob (Low Seating)',
            'Highland Terrace Outdoor Table',
            'Takeaway / Carry-out Mesob Box'
          ].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSeating(opt)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: seating === opt ? '1px solid var(--color-turmeric)' : '1px solid var(--border-color)',
                background: seating === opt ? 'rgba(229, 169, 60, 0.12)' : 'var(--bg-card)',
                color: seating === opt ? 'var(--color-turmeric)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Cart Items List */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
            Feast Order Summary
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-turmeric)', fontWeight: 600 }}>
            {items.reduce((acc, i) => acc + i.qty, 0)} Items Selected
          </span>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Your Mesob feast basket is empty.</p>
            <Link href="/menu" className="btn btn-primary">Browse Full Menu</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{item.name}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 800, fontSize: '1rem' }}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span style={{ minWidth: '1.5rem', textAlign: 'center', fontWeight: 700, color: '#fff' }}>{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-turmeric)', cursor: 'pointer', fontWeight: 800, fontSize: '1rem' }}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-turmeric)', minWidth: '70px', textAlign: 'right' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            {/* Extra Teff Addon */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.85rem 1.25rem',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={extraInjera}
                    onChange={(e) => setExtraInjera(e.target.checked)}
                    style={{ accentColor: 'var(--color-turmeric)' }}
                  />
                  <span>Add Extra Warm Basket of 100% Teff Injera (3 rolls)</span>
                </label>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--color-turmeric)', fontSize: '0.95rem' }}>+$4.00</span>
            </div>
          </div>
        )}

        {/* Pricing Summary */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          fontSize: '0.95rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Hospitality &amp; VAT (15%):</span>
            <span>${vat.toFixed(2)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.35rem',
            fontWeight: 800,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.85rem',
            marginTop: '0.5rem',
            color: '#fff'
          }}>
            <span>Total Payable:</span>
            <span style={{ color: 'var(--color-turmeric)' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Link href="/menu" className="btn btn-secondary">
          Add More Dishes
        </Link>
        <button
          type="button"
          onClick={() => setIsOrdered(true)}
          disabled={items.length === 0}
          className="btn btn-primary"
          style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem', cursor: items.length > 0 ? 'pointer' : 'not-allowed' }}
        >
          Confirm Mesob Reservation &amp; Order (${total.toFixed(2)}) &rarr;
        </button>
      </div>
    </div>
  );
}
