import React, { useState, useEffect } from 'react';
import { FiShield, FiX, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const COOKIE_KEY = 'mesob_house_cookie_consent_v1';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { openLegal } = useCart();

  useEffect(() => {
    let timer;
    try {
      const consent = localStorage.getItem(COOKIE_KEY);
      if (!consent) {
        // Show after 1.5 seconds delay for natural user load
        timer = setTimeout(() => setIsVisible(true), 1500);
      }
    } catch {
      timer = setTimeout(() => setIsVisible(true), 1500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleAccept = (type = 'all') => {
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ choice: type, date: new Date().toISOString() }));
    } catch {
      // ignore storage errors
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-bar" role="dialog" aria-label="Cookie Privacy Preferences">
      <div className="container cookie-inner">
        <div className="cookie-text-box">
          <div className="cookie-icon-wrapper">
            <FiShield className="shield-icon" />
          </div>
          <div>
            <h4 className="cookie-title">We Value Your Privacy & Dining Experience</h4>
            <p className="cookie-desc">
              We use essential cookies to manage your active banquet cart, remember table reservations, and optimize site performance. By clicking "Accept All", you agree to our privacy policies.
            </p>
          </div>
        </div>

        <div className="cookie-actions">
          <button className="btn-cookie-link" onClick={() => openLegal('privacy')}>
            Privacy Policy
          </button>
          <button className="btn-cookie-secondary" onClick={() => handleAccept('necessary')}>
            Essential Only
          </button>
          <button className="btn-cookie-primary" onClick={() => handleAccept('all')}>
            <FiCheck /> Accept All (ተቀበል)
          </button>
          <button className="cookie-close-icon" onClick={() => setIsVisible(false)} aria-label="Close cookie banner">
            <FiX />
          </button>
        </div>
      </div>
    </div>
  );
}
