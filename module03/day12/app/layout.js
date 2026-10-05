import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Mesob House | Authentic Habesha Restaurant & Elevated Dining',
  description: 'Experience communal Ethiopian and Eritrean culinary heritage at Mesob House. Handcrafted injera, rich wats, sizzling tibs, and ceremonial jebena coffee.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="site-header">
            <div className="header-container">
              <Link href="/" className="brand">
                <span className="brand-badge">መሶብ</span>
                <div>
                  <div style={{ lineHeight: 1.1 }}>Mesob House</div>
                  <span className="brand-sub">Habesha Restaurant</span>
                </div>
              </Link>
              <nav>
                <ul className="nav-links">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/menu">Menu</Link>
                  </li>
                  <li>
                    <Link href="/offers">Offers</Link>
                  </li>
                  <li>
                    <Link href="/reservations">Reservations</Link>
                  </li>
                  <li>
                    <Link href="/login" style={{ color: 'var(--text-muted)' }}>Login</Link>
                  </li>
                  <li>
                    <Link href="/checkout" className="nav-order-btn">
                      Cart &amp; Order
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <main className="main-content">
            {children}
          </main>

          <footer className="site-footer">
            <div className="footer-container">
              <div className="footer-top">
                <div className="footer-about">
                  <h3>Mesob House (መሶብ)</h3>
                  <p>
                    Rooted in the communal hospitality and rich culinary traditions of Ethiopia and Eritrea. 
                    From slow-simmered wats and fire-seared tibs to tableside jebena coffee ceremonies, 
                    we share the warmth of the Habesha table.
                  </p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.85rem', color: '#fff', fontSize: '1.05rem' }}>Experience</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <li><Link href="/">Home &amp; Heritage</Link></li>
                    <li><Link href="/menu">Browse Mesob Offerings</Link></li>
                    <li><Link href="/offers">Special Feasts &amp; Discounts</Link></li>
                    <li><Link href="/reservations">Book a Handcrafted Mesob</Link></li>
                    <li><Link href="/login">Guest &amp; Member Portal</Link></li>
                    <li><Link href="/checkout">Active Cart &amp; Checkout</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.85rem', color: '#fff', fontSize: '1.05rem' }}>Dining Hours &amp; Location</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.35rem' }}>Bole Road, Addis Ababa, Ethiopia</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.35rem' }}>Mon – Fri: 11:30 AM – 11:00 PM</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sat – Sun: 10:00 AM – Midnight</p>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Mesob House Restaurant. Authentic Habesha Gastronomy.</p>
                <p>Built with Next.js App Router · Module 3 Day 37</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
