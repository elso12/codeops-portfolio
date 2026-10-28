import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🍲</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
              Addis Eats
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px' }}>
            Crafting the finest slow-simmered wats, sizzling tibs, and vegan fasting feasts in Addis Ababa. Delivered piping hot to your table.
          </p>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--color-amber)', fontSize: '0.9rem' }}>
            Culinary Menu
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Link to="/menu" style={{ color: 'var(--color-text-secondary)' }}>All Dishes</Link>
            <Link to="/menu?category=Main" style={{ color: 'var(--color-text-secondary)' }}>Mains & Tibs</Link>
            <Link to="/menu?category=Vegetarian" style={{ color: 'var(--color-text-secondary)' }}>Fasting & Vegan</Link>
            <Link to="/menu?category=Breakfast" style={{ color: 'var(--color-text-secondary)' }}>Breakfast Firfir</Link>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--color-amber)', fontSize: '0.9rem' }}>
            Delivery Hubs
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            <div>📍 Bole (Medhanialem)</div>
            <div>📍 Kazanchis (UNECA)</div>
            <div>📍 Megenagna (Signal)</div>
            <div>📍 Piassa (Churchill Ave)</div>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--color-amber)', fontSize: '0.9rem' }}>
            Operating Hours
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <div>Monday – Sunday</div>
            <div style={{ color: 'var(--color-amber)', fontWeight: 600 }}>10:30 AM – 10:00 PM</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Telebirr & Cash Supported
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          &copy; {new Date().getFullYear()} Addis Eats Express. Built with React 19 & React Router 7.
        </div>
        <div>
          CodeOps Full Stack Software Development &bull; Module 3 Capstone Kickoff
        </div>
      </div>
    </footer>
  );
}

export default Footer;
