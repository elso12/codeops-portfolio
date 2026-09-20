import React from 'react';
import { FiMapPin, FiClock, FiPhone, FiMail, FiHeart } from 'react-icons/fi';
import { GiCookingPot, GiCoffeePot } from 'react-icons/gi';

export default function Footer({ onNavigate }) {
  const handleNav = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand & Ethos */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="brand-icon-box">
                <GiCookingPot className="brand-pot-icon" />
              </div>
              <div>
                <h3 className="footer-brand-title">MESOB HOUSE</h3>
                <span className="brand-amharic amharic-text">የሐበሻ ቤት • ADDIS EATS</span>
              </div>
            </div>
            <p className="footer-tagline">
              Celebrating the eternal warmth of Ethiopian and Eritrean culinary heritage through slow-simmered wats, stone-ground teff injera, and communal shared banquets.
            </p>
            <div className="buna-highlight-pill">
              <GiCoffeePot className="pill-coffee" />
              <span>Buna Ceremony 4:00 PM Daily</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Culinary Experience</h4>
            <ul className="footer-links">
              <li><button onClick={() => handleNav('specials')}>Chef's Today's Specials</button></li>
              <li><button onClick={() => handleNav('menu')}>Traditional Stews & Wat</button></li>
              <li><button onClick={() => handleNav('menu')}>Tibs & Pan-Charred Grills</button></li>
              <li><button onClick={() => handleNav('menu')}>Kitfo & Highland Delicacies</button></li>
              <li><button onClick={() => handleNav('menu')}>Fasting & Vegan (Tsom)</button></li>
              <li><button onClick={() => handleNav('menu')}>Wild Honey Tej & Beverages</button></li>
            </ul>
          </div>

          {/* Culture & Visit */}
          <div className="footer-col">
            <h4 className="footer-heading">Culture & Heritage</h4>
            <ul className="footer-links">
              <li><button onClick={() => handleNav('buna-ceremony')}>The Sacred Buna Ceremony</button></li>
              <li><button onClick={() => handleNav('heritage')}>Gursha: Dining Etiquette</button></li>
              <li><button onClick={() => handleNav('heritage')}>Hand-Woven Mesob Tradition</button></li>
              <li><button onClick={() => handleNav('heritage')}>100% Ancient Teff Grain</button></li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="footer-col">
            <h4 className="footer-heading">Find Our Hearth</h4>
            <div className="footer-contact-list">
              <div className="contact-row">
                <FiMapPin className="contact-icon" />
                <span>Bole Medhanialem, Behind Edna Mall, Addis Ababa, Ethiopia</span>
              </div>
              <div className="contact-row">
                <FiClock className="contact-icon" />
                <div>
                  <div>Monday – Friday: 11:30 AM – 11:00 PM</div>
                  <div>Saturday – Sunday: 11:00 AM – Midnight</div>
                </div>
              </div>
              <div className="contact-row">
                <FiPhone className="contact-icon" />
                <span>+251 91 123 4567 / +251 11 661 2345</span>
              </div>
              <div className="contact-row">
                <FiMail className="contact-icon" />
                <span>hearth@mesobhouse.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Mesob House (Addis Eats). All rights reserved.
          </div>
          <div className="footer-credit">
            <span>Prepared with</span>
            <FiHeart className="credit-heart" />
            <span>for authentic Habesha culinary heritage & communal love</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
