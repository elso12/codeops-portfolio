import Link from 'next/link';

export const metadata = {
  title: 'Mesob House | Habesha Restaurant Experience',
  description: 'Authentic Ethiopian and Eritrean culinary heritage crafted with communal warmth and modern hospitality.',
};

export default function HomePage() {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-pill">
          <span>✨</span>
          <span>Authentic Habesha Restaurant &amp; Mesob Dining</span>
        </div>

        <h1 className="hero-title">
          Where Ancient Heritage Meets <br />
          <span className="hero-highlight">Elevated Habesha Dining</span>
        </h1>

        <p className="hero-desc">
          Step into Mesob House — a tribute to Ethiopian and Eritrean culinary warmth.
          Gather around the handcrafted woven mesob, savor slow-simmered wats, sizzling rib-eye tibs,
          and fresh sourdough teff injera made daily.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/menu" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            Explore Our Menu &rarr;
          </Link>
          <Link href="/checkout" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            Reserve a Table / Order
          </Link>
        </div>
      </section>

      {/* Culinary Pillars from Figma Design */}
      <section className="feature-strip">
        <div className="feature-box">
          <span className="feature-icon">🧺</span>
          <h3>Communal Mesob Dining</h3>
          <p>
            Centered around the iconic handcrafted straw mesob basket. In Habesha tradition, eating together from one platter fosters togetherness, conversation, and love (Gursha).
          </p>
        </div>

        <div className="feature-box">
          <span className="feature-icon">🌶️</span>
          <h3>Artisan Berbere &amp; Herbs</h3>
          <p>
            Our master chefs sun-dry and stone-grind over 16 sacred spices to produce our signature berbere, mitmita, and herb-infused niter kibbeh clarified butter.
          </p>
        </div>

        <div className="feature-box">
          <span className="feature-icon">☕</span>
          <h3>Jebena Buna Ceremony</h3>
          <p>
            An unhurried sensory experience. Green Yirgacheffe beans roasted over open flame, crushed by pestle, and brewed in an earthenware black clay jebena.
          </p>
        </div>
      </section>

      {/* Special Offer Banner from Figma */}
      <section style={{
        marginTop: '3.5rem',
        padding: '2.5rem',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(186, 51, 32, 0.2), rgba(28, 56, 43, 0.4))',
        border: '1px solid rgba(229, 169, 60, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--color-turmeric)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Chef's Weekend Special · የሳምንቱ መጨረሻ ልዩ
          </span>
          <h2 style={{ fontSize: '1.85rem', color: '#fff', marginTop: '0.35rem', marginBottom: '0.5rem' }}>
            Grand Mesob Feast for Two
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '520px', fontSize: '0.95rem' }}>
            Sample Royal Doro Wat, Special Kitfo, and Yetsom Beyaynetu served with endless teff injera and a complimentary Jebena Buna ceremony.
          </p>
        </div>
        <Link href="/menu" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
          View Menu Details &rarr;
        </Link>
      </section>
    </div>
  );
}
