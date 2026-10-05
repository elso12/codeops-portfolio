import Link from 'next/link';
import MenuCounter from './MenuCounter';

export default function MenuLayout({ children }) {
  const categories = [
    { label: 'All Offerings', count: 6, href: '/menu' },
    { label: 'Signature Wats', count: 1, href: '/menu?category=Signature+Wats' },
    { label: 'Tibs & Grills', count: 2, href: '/menu?category=Tibs+%26+Grills' },
    { label: 'Vegetarian & Fasting', count: 2, href: '/menu?category=Vegetarian+%26+Fasting' },
    { label: 'Coffee & Ceremonies', count: 1, href: '/menu?category=Coffee+%26+Ceremonies' }
  ];

  return (
    <div className="container">
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-turmeric)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            መሶብ ሀውስ · Authentic Habesha Menu
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Culinary Traditions of the Horn
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', fontSize: '1.05rem' }}>
          Every dish is prepared using heirloom spices, traditional claypot simmering, and 100% organic sourdough teff injera.
        </p>
      </div>

      <div className="menu-layout">
        <aside className="menu-sidebar">
          <div className="sidebar-title">
            <span>🧺</span>
            <span>Mesob Categories</span>
          </div>

          <ul className="category-list">
            {categories.map((cat) => (
              <li key={cat.label}>
                <Link href={cat.href} className="category-link">
                  <span>{cat.label}</span>
                  <span style={{ fontSize: '0.75rem', background: 'var(--bg-card)', padding: '0.15rem 0.5rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                    {cat.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Interactive State Counter - Requirement 3 */}
          <MenuCounter />

          {/* Promotional Sidebar Card from Figma */}
          <div className="sidebar-promo-card">
            <span className="sidebar-promo-badge">Special Offer</span>
            <h4>Gursha Hospitality</h4>
            <p>
              Receive a complimentary pot of spiced spiced Shai or Jebena Buna when you order any two signature platters.
            </p>
          </div>
        </aside>

        <section style={{ minWidth: 0 }}>
          {children}
        </section>
      </div>
    </div>
  );
}
