import React from 'react';
import { useCart } from '../context/CartContext';
import { FiArrowDown, FiCoffee, FiPlus } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

export default function Hero({ onExploreSpecials, onExploreMenu, onExploreCeremony }) {
  const { addToCart, openDishModal } = useCart();

  const feastDish = {
    id: 'menu-feast',
    slug: 'great-mesob-feast',
    nameEn: 'Great Mesob Feast',
    nameAm: 'ታላቁ የሐበሻ ድልድል',
    category: 'Centerpiece Feasts',
    priceETB: 1650,
    spiceLevel: 'Chef Custom Selection',
    isFasting: false,
    isSpecial: true,
    description: 'The ultimate royal Habesha banquet for sharing. Hand-rolled 100% teff injera crowned with Doro Wat, Siga Wat, Prime Kitfo, Shiro Tegamino, Misir Wat, Ye’abesha Gomen, and fresh Ayib cheese.',
    ingredients: ['100% Teff Injera', 'Highland Chicken', 'Prime Beef', 'Herbal Niter Kibbeh', 'Berbere', 'Spiced Chickpeas', 'Ayib Cheese'],
    servings: 'Serves 3-4 Communally'
  };

  return (
    <section className="hero-section" id="hero">
      <div className="container hero-container">
        {/* Left Column: Typography & CTAs */}
        <div className="hero-content">
          {/* Authentic Hearth Badge */}
          <div className="badge-hearth">
            <span className="motif-bars">|||||||||</span>
            <span className="motif-bullet">•</span>
            <span>TRADITIONAL HABESHA HEARTH</span>
          </div>

          {/* Headline matching Figma */}
          <h1 className="hero-title">
            Communal Warmth,<br />
            <span className="hero-title-italic">Slow-Cooked Heritage.</span>
          </h1>

          {/* Body Text */}
          <p className="hero-description">
            Handcrafted wats, ancient stone-ground teff injera, and velvety kitfo simmered in 72–hour infused niter kibbeh and heirloom berbere harvested from the Ethiopian highlands.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions">
            <button 
              className="btn-primary hero-btn-main"
              onClick={onExploreSpecials}
            >
              <span>Explore Today's Specials</span>
              <FiArrowDown />
            </button>

            <button 
              className="btn-secondary"
              onClick={onExploreMenu}
            >
              <span>Full Banquet Menu</span>
            </button>

            <button 
              className="btn-accent hero-buna-badge"
              onClick={onExploreCeremony}
            >
              <FiCoffee />
              <span>Buna Ceremony 4:00 PM Daily</span>
            </button>
          </div>

          {/* Authentic Pillars & Stats */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <div className="stat-value red">100%</div>
              <div className="stat-label">Brown & White Teff</div>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat-item">
              <div className="stat-value gold">6+ Hours</div>
              <div className="stat-label">Slow Stew Caramels</div>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat-item">
              <div className="stat-value green">Gursha</div>
              <div className="stat-label">Hospitality Shared</div>
            </div>
          </div>
        </div>

        {/* Right Column: Centerpiece Feast Card matching Figma */}
        <div className="hero-visual">
          <div className="hero-card-wrapper">
            {/* Top Floating Badge */}
            <div className="hero-floating-badge">
              <div className="floating-badge-icon">
                <FaFire />
              </div>
              <div className="floating-badge-text">
                <strong>Stone Ground</strong>
                <span>Fresh Berbere Pepper</span>
              </div>
            </div>

            {/* Main Centerpiece Image */}
            <div className="hero-image-box" onClick={() => openDishModal(feastDish)}>
              <img 
                src="/hero-cover.png" 
                alt="Great Mesob Feast - Ethiopian communal banquet" 
                className="hero-main-img"
              />
              <div className="hero-image-overlay" />
            </div>

            {/* Bottom Card Banner */}
            <div className="hero-card-overlay">
              <div className="hero-card-meta">
                <span className="centerpiece-tag">CENTERPIECE</span>
                <h3 className="centerpiece-title">Great Mesob Feast</h3>
                <span className="amharic-sub amharic-text">ታላቁ የሐበሻ ድልድል</span>
              </div>
              <div className="hero-card-price-action">
                <div className="centerpiece-price">ETB 1,650</div>
                <button 
                  className="btn-primary add-feast-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(feastDish);
                  }}
                  title="Add Feast to Order"
                >
                  <FiPlus />
                  <span>Add Feast</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
