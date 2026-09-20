import React from 'react';
import DishCard from './DishCard';
import { FaFire } from 'react-icons/fa';

export default function SpecialsSection({ specials, loading }) {
  return (
    <section className="specials-section" id="specials">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="badge-hearth">
            <FaFire className="flame-icon" />
            <span>CHEF EYASU'S SIGNATURE CRAFT</span>
          </div>
          <h2 className="section-title">
            Today's <span className="title-highlight">Chef Specials</span>
          </h2>
          <span className="section-amharic amharic-text">የዕለቱ የክብር ምግቦች</span>
          <p className="section-subtitle">
            Curated daily from the morning spice markets in Merkato and prime pasture-raised highland meats.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="specials-loading-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="dish-card skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-line" style={{ width: '40%' }} />
                <div className="skeleton-line" style={{ width: '80%' }} />
                <div className="skeleton-line" style={{ width: '60%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="specials-grid">
            {specials.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
