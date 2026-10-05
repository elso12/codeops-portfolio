import Link from 'next/link';
import { cookies } from 'next/headers';
import InteractiveCart from './InteractiveCart';

export const metadata = {
  title: 'Mesob House Checkout & Table Reservation',
  description: 'Confirm your communal Mesob dining experience, table preferences, and Habesha culinary selections.',
};

export default async function CheckoutPage() {
  // LINE THAT REQUIRES DYNAMIC RENDERING:
  // Reading incoming request cookies via `await cookies()` reads request-specific headers,
  // which forces Next.js to classify and serve this route dynamically (ƒ Dynamic) on every request.
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('mesob_session_id')?.value || 'mesob_guest_bole_7842';
  const tablePreference = cookieStore.get('mesob_seating')?.value || 'Traditional Handcrafted Mesob (Low Seating)';

  return (
    <div className="container" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/menu" className="back-link">
          &larr; Back to full Habesha menu
        </Link>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-turmeric)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>
          መሶብ ሀውስ · Order &amp; Dining Reservation
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.35rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Mesob House Checkout
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review your authentic feast selections and confirm table seating or pickup preferences.
        </p>
      </div>

      {/* Dynamic Session Card - Evaluated per request via cookies */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.6rem' }}>🔐</span>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-turmeric)' }}>
              Dynamic Guest &amp; Table State
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Evaluated on the server per request via <code>cookies()</code> reader.
            </p>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          padding: '1.25rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          fontSize: '0.9rem'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--text-muted)' }}>Active Session Token:</strong>{' '}
            <code style={{ color: 'var(--color-turmeric)', background: 'rgba(229, 169, 60, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              {sessionId}
            </code>
          </div>
          <div>
            <strong style={{ color: 'var(--text-muted)' }}>Reserved Table Preference:</strong>{' '}
            <span style={{ color: '#fff', fontWeight: 600 }}>{tablePreference}</span>
          </div>
        </div>
      </div>

      {/* Interactive Cart with dynamic quantity & price recalculation */}
      <InteractiveCart
        initialSessionId={sessionId}
        initialTablePreference={tablePreference}
      />
    </div>
  );
}
