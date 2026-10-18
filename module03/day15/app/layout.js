import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata = {
  title: "Mesob House · Addis Eats | Traditional Habesha Hearth & Restaurant",
  description:
    "Communal Warmth, Slow-Cooked Heritage. Handcrafted wats, ancient stone-ground teff injera, velvety kitfo, and traditional jebena coffee ceremonies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div className="app-shell">
            <Navbar />

            <main className="main-content">
              {children}
            </main>

            <footer className="footer-figma">
              <div className="footer-figma__inner">
                <div className="footer-figma__grid">
                  <div className="footer-figma__brand-col">
                    <div className="footer-brand-badge">መሶብ</div>
                    <h3 className="footer-title">Mesob House (መሶብ)</h3>
                    <p className="footer-desc">
                      Rooted in communal hospitality and the sacred culinary traditions of Ethiopia and Eritrea.
                      Gather around the woven mesob for handcrafted slow-simmered wats, freshly baked teff sourdough,
                      and authentic ceremonial Jebena Buna roasted over charcoal.
                    </p>
                  </div>

                  <div className="footer-figma__links-col">
                    <h4 className="footer-heading">Culinary Experience</h4>
                    <ul className="footer-links">
                      <li><Link href="/">Home &amp; Hearth</Link></li>
                      <li><Link href="/menu">Full Banquet Menu</Link></li>
                      <li><Link href="/offers">Weekend Mesob Feasts</Link></li>
                      <li><Link href="/reservations">Book a Handcrafted Mesob</Link></li>
                      <li><Link href="/orders">Live Order Tracking</Link></li>
                      <li><Link href="/checkout">Express Checkout</Link></li>
                    </ul>
                  </div>

                  <div className="footer-figma__info-col">
                    <h4 className="footer-heading">Hearth Hours &amp; Location</h4>
                    <p className="footer-info-line">📍 Bole Rwanda Road, Addis Ababa, Ethiopia</p>
                    <p className="footer-info-line">🕒 Mon – Fri: 11:30 AM – 11:00 PM</p>
                    <p className="footer-info-line">🕒 Sat – Sun: 10:00 AM – Midnight</p>
                    <div className="ceremony-notice">
                      <span>☕</span>
                      <span>Daily Jebena Buna Ceremony: 4:00 PM &amp; 8:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="footer-figma__bottom">
                  <p>&copy; {new Date().getFullYear()} Mesob House Restaurant. Authentic Habesha Gastronomy.</p>
                  <p>Designed according to Figma Community Design · Eyasu Nigussie</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
