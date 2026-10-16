import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/session";
import Link from "next/link";
import Script from "next/script";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Mesob House · Addis Eats | Traditional Habesha Hearth & Restaurant",
  description:
    "Communal Warmth, Slow-Cooked Heritage. Handcrafted wats, ancient stone-ground teff injera, velvety kitfo, and traditional jebena coffee ceremonies.",
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Next/font eliminates external font links, preconnects, and layout shifts */}
      </head>
      <body>
        {/* Third-party telemetry/analytics loaded via next/script with lazy strategy */}
        <Script
          id="addis-eats-telemetry"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.__MESOB_TELEMETRY__ = {
                appName: "Addis Eats / Mesob House",
                environment: "production",
                perfOptimized: true,
                loadedAt: Date.now()
              };
            `,
          }}
        />
        <Providers>
          <div className="app-shell">
            <Navbar session={session} />

            <main className="main-content">{children}</main>

            <footer className="footer-figma">
              <div className="footer-figma__inner">
                <div className="footer-figma__grid">
                  <div className="footer-figma__brand-col">
                    <div className="footer-brand-badge">መሶብ</div>
                    <h3 className="footer-title">Mesob House (መሶብ)</h3>
                    <p className="footer-desc">
                      Rooted in communal hospitality and the sacred culinary traditions of Ethiopia
                      and Eritrea. Gather around the woven mesob for handcrafted slow-simmered wats,
                      freshly baked teff sourdough, and authentic ceremonial Jebena Buna roasted
                      over charcoal.
                    </p>
                  </div>

                  <div className="footer-figma__links-col">
                    <h4 className="footer-heading">Culinary &amp; Security</h4>
                    <ul className="footer-links">
                      <li>
                        <Link href="/">Home &amp; Hearth</Link>
                      </li>
                      <li>
                        <Link href="/menu">Full Banquet Menu</Link>
                      </li>
                      <li>
                        <Link href="/orders">Live Order Tracking (Protected)</Link>
                      </li>
                      <li>
                        <Link href="/kitchen">Kitchen Expediter (Staff Only)</Link>
                      </li>
                      <li>
                        <Link href="/security-lab">Security Lab (The 3 Attacks)</Link>
                      </li>
                      <li>
                        <Link href="/checkout">Express Checkout (Protected)</Link>
                      </li>
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
                  <p>
                    &copy; {new Date().getFullYear()} Mesob House Restaurant. Authentic Habesha
                    Gastronomy.
                  </p>
                  <p>Module 3 · Day 43 Performance Optimization · CodeOps Full Stack</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
