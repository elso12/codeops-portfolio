import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import DishCard from '../menu/DishCard';
import { fetchDishes } from '../api/menu';

export function Home() {
  const [specials, setSpecials] = useState([]);

  useEffect(() => {
    fetchDishes().then((dishes) => {
      // Pick top 3 signature specials
      setSpecials(dishes.slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-subtitle">
            <span>✨</span> Authentic Ethiopian Gastronomy in Addis Ababa
          </div>
          <h1 className="hero-title">
            Heritage Recipes. <span>Wood-Fired Simmer.</span> Delivered to Your Door.
          </h1>
          <p className="hero-description">
            Experience timeless Addis culinary traditions. Hand-rolled 100% teff injera, fragrant clarified niter kibbeh butter, and 24-hour slow-cooked Doro Wat and Beyaynetu delivered across Bole, Kazanchis, Megenagna, and Piassa.
          </p>

          <div className="hero-cta">
            <Link to="/menu">
              <Button variant="primary" size="lg">
                Explore Full Menu &rarr;
              </Button>
            </Link>
            <Link to="/menu?category=Vegetarian">
              <Button variant="secondary" size="lg">
                🌱 Fasting / Vegan Specials
              </Button>
            </Link>
          </div>
        </div>

        <div className="hero-features">
          <div className="hero-feat-item">
            <div className="hero-feat-icon">🌾</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>100% Teff Injera</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Naturally fermented & gluten-free</div>
            </div>
          </div>

          <div className="hero-feat-item">
            <div className="hero-feat-icon">⚡</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Express Courier</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Hot dispatch in under 35 mins</div>
            </div>
          </div>

          <div className="hero-feat-item">
            <div className="hero-feat-icon">📱</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>TeleBirr Native</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Seamless 1-tap digital checkout</div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Chef Specials */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: 'var(--color-amber)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Handcrafted Today
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>
              Today&rsquo;s Signature Chef Specials
            </h2>
          </div>
          <Link to="/menu">
            <Button variant="outline" size="sm">
              View All 12 Dishes &rarr;
            </Button>
          </Link>
        </div>

        <div className="dish-grid">
          {specials.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </section>

      {/* Cultural Pillars Banner */}
      <section
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}
      >
        <div>
          <span style={{ fontSize: '2rem' }}>🌶️</span>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0.5rem 0' }}>
            Artisan Berbere & Mitmita
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Sun-dried red peppers, korarima cardamom, cloves, and rue seeds blended by traditional spice masters in Merkato for unmatched aroma.
          </p>
        </div>

        <div>
          <span style={{ fontSize: '2rem' }}>☕</span>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0.5rem 0' }}>
            Fresh Buna Roast Ceremony
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Every morning we roast highland Yirgacheffe coffee beans over olive wood coals, brewed in traditional clay jebenas with frankincense.
          </p>
        </div>

        <div>
          <span style={{ fontSize: '2rem' }}>🌿</span>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0.5rem 0' }}>
            Pure Vegan Fasting Platter
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Complete vegan options prepared in dedicated cookware during fasting seasons — rich red lentils, yellow split peas, and crisp collards.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
