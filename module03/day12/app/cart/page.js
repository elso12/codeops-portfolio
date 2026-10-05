'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [items, setItems] = useState([
    { id: 'doro-wat', name: 'Doro Wat (ዶሮ ወጥ)', price: 24.50, qty: 1 },
    { id: 'kitfo', name: 'Special Kitfo (ልዩ ክትፎ)', price: 22.00, qty: 1 },
  ]);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/menu" className="back-link">
          &larr; Back to full Habesha menu
        </Link>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-turmeric)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>
          Addis Eats · Client Cart (CSR)
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.35rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Your Addis Eats Mesob Cart
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Strategy: <strong>Client Component</strong> — Handles local, private user session state entirely in the browser.
        </p>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.75rem' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Your mesob cart is currently empty.</p>
            <Link href="/menu" className="btn btn-primary">Browse Habesha Menu</Link>
          </div>
        ) : (
          <div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {items.map((item) => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{item.name}</h3>
                    <span style={{ color: 'var(--color-turmeric)', fontWeight: 600 }}>${item.price.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => updateQty(item.id, -1)} className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem' }}>-</button>
                    <span style={{ fontWeight: 700, minWidth: '1.5rem', textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="btn btn-primary" style={{ padding: '0.2rem 0.6rem' }}>+</button>
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Estimated Subtotal</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-turmeric)' }}>${subtotal.toFixed(2)}</div>
              </div>
              <Link href="/checkout" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                Proceed to Dynamic Checkout &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
