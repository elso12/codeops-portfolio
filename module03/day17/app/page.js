/**
 * app/page.js — Home / landing page (Server Component)
 * Designed strictly according to Mesob House Figma Community file:
 * https://www.figma.com/community/file/1679526791160944664
 */
import { getDishes } from "@/lib/data";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export const metadata = {
  title: "Mesob House · Addis Eats | Traditional Habesha Hearth & Dining",
  description:
    "Communal Warmth, Slow-Cooked Heritage. Handcrafted wats, ancient stone-ground teff injera, and velvety kitfo simmered in 72-hour infused niter kibbeh and heirloom berbere.",
};

export default function HomePage() {
  const featured = getDishes().slice(0, 4);

  return (
    <div className="container">
      {/* Figma Hero Section */}
      <section className="hero-figma">
        {/* Left Column: Copy & Actions */}
        <div className="hero-figma__content">
          <div className="hero-figma__badge">
            <span className="weave-icon" aria-hidden="true">
              <span></span><span></span><span></span><span></span><span></span>
              <span></span><span></span><span></span><span></span><span></span>
            </span>
            <span className="badge-dot">•</span>
            <span className="badge-text">TRADITIONAL HABESHA HEARTH</span>
          </div>

          <h1 className="hero-figma__title">
            Communal Warmth, <br />
            <span className="hero-figma__italic">Slow-Cooked Heritage.</span>
          </h1>

          <p className="hero-figma__desc">
            Handcrafted wats, ancient stone-ground teff injera, and velvety kitfo
            simmered in 72–hour infused niter kibbeh and heirloom berbere harvested
            from the Ethiopian highlands.
          </p>

          <div className="hero-figma__actions">
            <Link href="#specials" className="btn-figma btn-figma--primary">
              Explore Today&apos;s Specials &darr;
            </Link>
            <Link href="/menu" className="btn-figma btn-figma--sand">
              Full Banquet Menu
            </Link>
            <Link href="/reservations" className="btn-figma btn-figma--honey">
              <span className="coffee-icon">☕</span> Buna Ceremony 4:00 PM Daily
            </Link>
          </div>

          <div style={{ display: "flex", gap: "0.85rem", alignItems: "center", marginBottom: "2.25rem", fontSize: "0.92rem", flexWrap: "wrap" }}>
            <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Mesob Member?</span>
            <Link href="/login" style={{ color: "var(--color-paprika)", fontWeight: 700, textDecoration: "underline" }}>
              Sign In
            </Link>
            <span style={{ color: "var(--border-color)" }}>•</span>
            <Link href="/register" style={{ color: "var(--color-turmeric)", fontWeight: 700, textDecoration: "underline" }}>
              Register &amp; Earn Gursha Points &rarr;
            </Link>
          </div>

          {/* Stats Row */}
          <div className="hero-figma__stats">
            <div className="stat-item">
              <span className="stat-number stat-number--red">100%</span>
              <span className="stat-label">Brown &amp; White Teff</span>
            </div>
            <div className="stat-divider" aria-hidden="true"></div>
            <div className="stat-item">
              <span className="stat-number stat-number--gold">6+ Hours</span>
              <span className="stat-label">Slow Stew Caramels</span>
            </div>
            <div className="stat-divider" aria-hidden="true"></div>
            <div className="stat-item">
              <span className="stat-number stat-number--green">Gursha</span>
              <span className="stat-label">Hospitality Shared</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase Card */}
        <div className="hero-figma__visual">
          <div className="feast-card-wrapper">
            <div className="feast-card">
              <img
                src="/images/great-mesob-feast.png"
                alt="Great Mesob Feast centerpiece with doro wat, injera, and side wats"
                className="feast-card__image"
              />

              {/* Floating Top-Right Badge */}
              <div className="floating-badge-top">
                <div className="badge-flame-icon">🔥</div>
                <div className="badge-flame-text">
                  <strong>Stone Ground</strong>
                  <span>Fresh Berbere Pepper</span>
                </div>
              </div>

              {/* Floating Bottom Card */}
              <div className="floating-card-bottom">
                <div className="floating-card-meta">
                  <span className="meta-tag">CENTERPIECE</span>
                  <h3 className="meta-title">Great Mesob Feast</h3>
                </div>
                <div className="floating-card-price">
                  <span>ETB 1,650</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Pillars */}
      <section className="feature-strip">
        <div className="feature-box">
          <span className="feature-icon">🧺</span>
          <h3>Communal Mesob Dining</h3>
          <p>
            Centered around the iconic handcrafted straw mesob basket. In Habesha tradition,
            eating together from one platter fosters togetherness, conversation, and love (Gursha).
          </p>
        </div>

        <div className="feature-box">
          <span className="feature-icon">🌶️</span>
          <h3>Stone-Ground Berbere</h3>
          <p>
            Our master chefs sun-dry and stone-grind over 16 heirloom spices from the Ethiopian highlands
            to blend our signature berbere, mitmita, and herb-clarified niter kibbeh.
          </p>
        </div>

        <div className="feature-box">
          <span className="feature-icon">☕</span>
          <h3>Jebena Buna Ceremony</h3>
          <p>
            An unhurried ritual of hospitality. Single-origin Yirgacheffe beans pan-roasted over charcoal,
            ground tableside, and brewed in a blackened clay jebena accompanied by frankincense.
          </p>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="special-banner">
        <div className="special-banner__content">
          <span className="special-banner__eyebrow">
            CHEF&apos;S WEEKEND BANQUET · የሳምንቱ መጨረሻ ልዩ
          </span>
          <h2 className="special-banner__title">Grand Mesob Royal Feast for Two</h2>
          <p className="special-banner__desc">
            Experience our flagship combination: Royal Doro Wat with tender chicken and hard-boiled egg,
            sizzling Rib-Eye Tibs, Velvety Kitfo, and comforting Shiro Wat served over 100% teff sourdough injera.
          </p>
        </div>
        <div className="special-banner__actions">
          <Link href="/offers" className="btn-figma btn-figma--sand">
            View All Specials &rarr;
          </Link>
          <Link href="/checkout?dishId=dish_001" className="btn-figma btn-figma--primary">
            Order Banquet Feast
          </Link>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section id="specials" className="specials-section">
        <div className="section-header-flex">
          <div>
            <span className="section-eyebrow">FRESH FROM THE HEARTH</span>
            <h2 className="section-title">Featured Kitchen Specials</h2>
            <p className="section-sub">Hand-picked culinary staples prepared fresh each morning</p>
          </div>
          <Link href="/menu" className="btn-figma btn-figma--sand">
            View Entire Menu &rarr;
          </Link>
        </div>

        <div className="dish-grid">
          {featured.map((dish) => (
            <article key={dish.id} className="card-figma">
              <div className="card-figma__image-wrap">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="card-figma__img"
                  loading="lazy"
                />
                <span className="card-figma__tag">{dish.category}</span>
              </div>
              <div className="card-figma__body">
                <div className="card-figma__header">
                  <h3 className="card-figma__title">{dish.name}</h3>
                  <span className="card-figma__price">
                    {dish.price} <small>ETB</small>
                  </span>
                </div>
                <p className="card-figma__desc">{dish.description}</p>
                <div className="card-figma__footer">
                  <Link
                    href={`/menu/${dish.id}`}
                    className="btn-link"
                    id={`view-${dish.id}`}
                  >
                    Details &rarr;
                  </Link>
                  <div className="card-figma__actions">
                    <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price, currency: dish.currency }} />
                    <Link
                      href={`/checkout?dishId=${dish.id}`}
                      className="btn-figma btn-figma--primary btn-figma--sm"
                      id={`order-${dish.id}`}
                    >
                      Order
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Mesob Members & Gursha Club (Login & Register CTA Section) */}
      <section className="member-banner">
        <div className="member-banner__content">
          <span className="member-banner__eyebrow">
            የመሶብ አባልነት · MESOB MEMBERS &amp; GURSHA CLUB
          </span>
          <h2 className="member-banner__title">Join the Mesob Dining Family</h2>
          <p className="member-banner__desc">
            Sign in or create an account to track live orders across Addis Ababa, reserve priority ceremonial mesob seating,
            and earn Gursha reward points on every handcrafted feast.
          </p>
        </div>
        <div className="member-banner__actions">
          <Link href="/register" className="btn-figma btn-figma--primary">
            Create Free Account &rarr;
          </Link>
          <Link href="/login" className="btn-figma btn-figma--sand">
            Member Sign In
          </Link>
        </div>
      </section>

      {/* Architectural Guarantee Notice */}
      <div className="footer-notice">
        <strong>Server Component Architecture:</strong> Statically pre-rendered on the server with zero data fetching delay. Interactive basket leaves manage cart persistence, while direct ordering connects with secure server actions.
      </div>
    </div>
  );
}
