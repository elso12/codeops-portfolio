import React from 'react';
import { FiX, FiShield, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function LegalModal() {
  const { legalModalState, closeLegal, openLegal } = useCart();

  if (!legalModalState.open) return null;

  const currentTab = legalModalState.type || 'privacy';

  return (
    <div className="modal-backdrop">
      <div className="modal-card legal-modal">
        <button className="modal-close-btn" onClick={closeLegal} aria-label="Close Modal">
          <FiX />
        </button>

        {/* Modal Navigation Tabs */}
        <div className="legal-tabs-header">
          <button 
            className={`legal-tab-btn ${currentTab === 'privacy' ? 'active' : ''}`}
            onClick={() => openLegal('privacy')}
          >
            <FiShield /> Privacy Policy
          </button>
          <button 
            className={`legal-tab-btn ${currentTab === 'terms' ? 'active' : ''}`}
            onClick={() => openLegal('terms')}
          >
            <FiFileText /> Terms of Dining
          </button>
          <button 
            className={`legal-tab-btn ${currentTab === 'allergens' ? 'active' : ''}`}
            onClick={() => openLegal('allergens')}
          >
            <FiAlertCircle /> Allergen & Teff Policy
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="legal-content-body">
          {currentTab === 'privacy' && (
            <div className="legal-article">
              <h3>Privacy & Guest Data Policy</h3>
              <p className="effective-date">Effective Date: January 1, 2026</p>

              <p>
                At Mesob House (Addis Eats), we are dedicated to preserving guest privacy and protecting personal information collected online and in-person.
              </p>

              <h4>1. Information We Collect</h4>
              <p>
                We collect information provided when placing online banquet orders, reserving a Mesob table, subscribing to our VIP Buna circle, or submitting feedback. This includes name, email, telephone number, delivery address, and payment preferences.
              </p>

              <h4>2. How Information is Used</h4>
              <p>
                - Fulfilling takeout, dine-in reservations, and delivery orders.<br />
                - Sending order confirmation status updates and live courier tracking notifications.<br />
                - Inviting members to exclusive Buna coffee ceremony events and seasonal menus.
              </p>

              <h4>3. Data Security & Payment Protection</h4>
              <p>
                All digital transactions are encrypted via SSL/TLS protocol standards. We do not store full credit card information on our local servers.
              </p>
            </div>
          )}

          {currentTab === 'terms' && (
            <div className="legal-article">
              <h3>Terms of Dining & Banquet Reservations</h3>
              <p className="effective-date">Effective Date: January 1, 2026</p>

              <p>
                Welcome to Mesob House. By utilizing our online reservation system or ordering food online, you agree to these standard terms.
              </p>

              <h4>1. Reservation Holds & Grace Periods</h4>
              <p>
                Table reservations are held for 15 minutes past the reserved time. If running late, please inform our front desk at +251 91 123 4567.
              </p>

              <h4>2. Communal Dining & Gursha Tradition</h4>
              <p>
                Mesob House serves banquets on traditional woven mesob tables designed for communal sharing. Hand-washing basins (koso) are provided before each banquet.
              </p>

              <h4>3. Cancellation & Refunds</h4>
              <p>
                Online delivery orders cancelled prior to kitchen preparation will receive 100% refund. Once wats are simmered, cancellations cannot be refunded.
              </p>
            </div>
          )}

          {currentTab === 'allergens' && (
            <div className="legal-article">
              <h3>Allergen Disclosures & Teff Guarantee</h3>
              <p className="effective-date">Effective Date: January 1, 2026</p>

              <div className="allergen-callout-box">
                <strong>🌾 100% Teff Gluten-Free Guarantee</strong>
                <p>Our traditional injera is prepared exclusively with 100% ancient pure teff grain and pure water. We never mix wheat flour or additives into our sourdough ferment.</p>
              </div>

              <h4>1. Spice Blend & Clarified Butter (Niter Kibbeh)</h4>
              <p>
                - <strong>Berbere & Korarima:</strong> Contains traditional highland spices including dried chili, garlic, ginger, rue, and sacred Ethiopian herbs.<br />
                - <strong>Niter Kibbeh:</strong> Traditional clarified butter infused with koseret and fenugreek. Vegan items (Tsom) are cooked exclusively with pure vegetable oil.
              </p>

              <h4>2. Nut-Free Kitchen Standard</h4>
              <p>
                Our core savory dishes do not utilize peanut or tree nut oils. However, if you have severe anaphylactic allergies, please inform your server or note it in your order.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer-right">
          <button className="btn-primary" onClick={closeLegal}>
            I Understand & Agree (ተስማምቻለሁ)
          </button>
        </div>
      </div>
    </div>
  );
}
