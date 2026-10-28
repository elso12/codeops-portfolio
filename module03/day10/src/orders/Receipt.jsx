import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export function Receipt() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto' }}>
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🎉</div>
        <Badge variant="success">Order Successfully Dispatched</Badge>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', margin: '1rem 0 0.5rem' }}>
          Tena Yistelegn!
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginBottom: '1.75rem' }}>
          Your order has been sent to the Addis Eats central kitchen in <strong>{order.customer?.area}</strong>. Fresh injera and hot stews are being prepared now.
        </p>

        {/* Order Details Receipt Card */}
        <div
          style={{
            background: 'var(--color-bg)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Order Reference</span>
            <span style={{ fontWeight: 700, color: 'var(--color-amber)' }}>{order.id}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Recipient</span>
            <span>{order.customer?.name} ({order.customer?.phone})</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Delivery Area</span>
            <span>{order.customer?.area} &bull; {order.customer?.address}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Estimated Delivery</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{order.estimatedDelivery}</span>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Ordered Dishes
            </div>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                <span>{item.qty}&times; {item.name}</span>
                <span style={{ color: 'var(--color-amber)' }}>{item.lineTotal} ETB</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.15rem' }}>
            <span>Total Paid (via {order.paymentMethod?.toUpperCase()})</span>
            <span style={{ color: 'var(--color-amber)' }}>{order.financials?.grandTotalETB} ETB</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/menu">
            <Button variant="primary">Return to Menu</Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
