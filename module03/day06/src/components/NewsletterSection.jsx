import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiMail, FiGift, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { GiCoffeeBeans } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { newsletterSchema } from '../utils/validationSchemas';

export default function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' }
  });

  const onValidSubmit = () => {
    setSubscribed(true);
    showToast('Welcome to the VIP Mesob Dining Club! 15% discount code sent.');
    reset();
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
              <form onSubmit={handleSubmit(onValidSubmit)} className="newsletter-form" noValidate>
                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="Enter your personal email address..." 
                    {...register('email')}
                  />
                </div>
                <button type="submit" className="btn-accent subscribe-btn">
                  <FiGift /> Claim 15% Voucher (አስገባ)
                </button>
              </form>
            )}

            {errors.email && (
              <div className="field-error-msg" style={{ color: '#FFD1D1', marginTop: '10px' }}>
                <FiAlertCircle /> {errors.email.message}
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
