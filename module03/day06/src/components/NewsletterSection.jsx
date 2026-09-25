import React, { useState } from 'react';
import { FiMail, FiGift, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { GiCoffeeBeans } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { newsletterSchema } from '../utils/validationSchemas';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useCart();

  const handleSubscribe = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setErrorMsg(result.error.errors[0]?.message || 'Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setSubscribed(true);
    showToast('Welcome to the VIP Mesob Dining Club! 15% discount code sent.');
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          <div className="newsletter-content">
            <div className="badge-pill light">
              <GiCoffeeBeans className="badge-icon" />
              <span>VIP Hearth Club</span>
            </div>
            <h2 className="newsletter-title">Join Our VIP Circle for 15% Off Your First Feast</h2>
            <p className="newsletter-description">
              Receive secret seasonal chef recipes, invitations to rare wild honey wine tastings, and priority reservations for weekend Buna ceremonies.
            </p>

            {subscribed ? (
              <div className="subscription-success">
                <FiCheckCircle className="check-icon" />
                <div>
                  <strong>You are on the Guest List!</strong>
                  <p>Check your inbox for your 15% promo code: <code>MESOB15 VIP</code></p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="Enter your personal email address..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-accent subscribe-btn">
                  <FiGift /> Claim 15% Voucher (አስገባ)
                </button>
              </form>
            )}

            {errorMsg && (
              <div className="field-error-msg" style={{ color: '#FFD1D1', marginTop: '10px' }}>
                <FiAlertCircle /> {errorMsg}
              </div>
            )}

            <span className="privacy-note">
              🔒 We respect your privacy. No spam ever. Unsubscribe anytime.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
