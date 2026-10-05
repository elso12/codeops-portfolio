import Link from 'next/link';
import CartClient from './CartClient';

export const metadata = {
  title: 'Your Mesob Cart | Addis Eats · Mesob House',
  description: 'Review your selected authentic Habesha dishes before proceeding to dynamic checkout.',
};

/**
 * CartPage - Server Component
 * 
 * Requirement 4: Move "use client" down to the smallest component that needs it.
 * The page shell is a Server Component, pre-rendering the title, breadcrumbs,
 * and layout on the server. Only the interactive items list (`CartClient`) runs on the client.
 */
export default function CartPage() {
  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/menu" className="back-link">
          &larr; Back to full Habesha menu
        </Link>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--color-turmeric)',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          display: 'block'
        }}>
          Addis Eats · Mesob Cart
        </span>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          marginTop: '0.35rem',
          marginBottom: '0.5rem',
          letterSpacing: '-0.5px'
        }}>
          Your Addis Eats Mesob Cart
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Strategy: <strong>Server Page Shell + Client Leaf</strong> — Header &amp; SEO pre-rendered on server; state managed by client leaf.
        </p>
      </div>

      {/* Interactive Cart Leaf Component */}
      <CartClient />
    </div>
  );
}
