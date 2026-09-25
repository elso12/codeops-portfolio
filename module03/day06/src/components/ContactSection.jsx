import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiMapPin, FiClock, FiPhone, FiMail, FiSend, FiCheckCircle, FiCompass, FiAlertCircle } from 'react-icons/fi';
import { GiEnvelope } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { contactSchema } from '../utils/validationSchemas';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [lastEmail, setLastEmail] = useState('');
  const { showToast } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: 'General Inquiry',
      message: ''
    }
  });

  const onValidSubmit = (data) => {
    setLastEmail(data.email);
    setSubmitted(true);
    showToast('Inquiry received! Our concierge will contact you shortly.');
    reset();
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header-center">
          <div className="badge-pill">
            <GiEnvelope className="badge-icon" />
            <span>Connect & Find Us</span>
          </div>
          <h2 className="section-title">Visit Our Hearth & Get in Touch</h2>
          <p className="section-subtitle">
            Whether planning a private event, reserving a large family banquet, or asking dietary questions, we welcome you.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left: Contact Info & Interactive Map Card */}
          <div className="contact-info-card">
            <h3 className="card-heading">Hearth Location & Hours</h3>
            
            <div className="info-item">
              <div className="info-icon-box">
                <FiMapPin />
              </div>
              <div>
                <strong>Physical Address</strong>
                <p>Bole Medhanialem, Behind Edna Mall, Next to Atlas Hotel, Addis Ababa, Ethiopia</p>
                <a 
                  href="https://maps.google.com/?q=Bole+Medhanialem+Addis+Ababa" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="directions-link"
                >
                  <FiCompass /> Get Directions via Google Maps ↗
                </a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-box">
                <FiClock />
              </div>
              <div>
                <strong>Dining Hours</strong>
                <p>Mon – Fri: 11:30 AM – 11:00 PM</p>
                <p>Sat – Sun: 11:00 AM – Midnight</p>
                <p className="highlight-text">☕ Daily Buna Ceremony: 4:00 PM Sharp</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-box">
                <FiPhone />
              </div>
              <div>
                <strong>Direct Telephone</strong>
                <p>Banquet Line: +251 91 123 4567</p>
                <p>Front Desk: +251 11 661 2345</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-box">
                <FiMail />
              </div>
              <div>
                <strong>Electronic Mail</strong>
                <p>hearth@mesobhouse.com / events@mesobhouse.com</p>
              </div>
            </div>

            {/* Map Preview Container */}
            <div className="map-preview-card">
              <div className="map-placeholder">
                <div className="map-pin-pulse">
                  <FiMapPin className="pin-icon" />
                </div>
                <span className="map-label">Mesob House Hearth • Bole Medhanialem</span>
                <span className="map-sublabel">Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-card">
            <h3 className="card-heading">Send Us a Direct Message</h3>
            <p className="card-subtext">Have a special request or event planning query? Drop us a note.</p>

            {submitted ? (
              <div className="contact-success-state">
                <FiCheckCircle className="success-icon" />
                <h4>Message Received (እግዚአብሔር ይስጥልን)!</h4>
                <p>Thank you for reaching out to Mesob House. Our host will respond to {lastEmail || 'your email'} within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onValidSubmit)} className="contact-form" noValidate>
                <div className="form-row-2col">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Almaz Bekele" 
                      {...register('name')}
                    />
                    {errors.name && (
                      <span className="field-error-msg"><FiAlertCircle /> {errors.name.message}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="almaz@example.com" 
                      {...register('email')}
                    />
                    {errors.email && (
                      <span className="field-error-msg"><FiAlertCircle /> {errors.email.message}</span>
                    )}
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label>Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      placeholder="+251 9... / +1..." 
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <span className="field-error-msg"><FiAlertCircle /> {errors.phone.message}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select {...register('subject')}>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Private Dining & Events">Private Dining & Events</option>
                      <option value="Catering & Gursha Banquets">Catering & Banquets</option>
                      <option value="Dietary & Allergen Question">Dietary & Allergen Question</option>
                      <option value="Feedback">Guest Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea 
                    rows="5" 
                    placeholder="Describe your inquiry, event date, guest count, or questions..." 
                    {...register('message')}
                  ></textarea>
                  {errors.message && (
                    <span className="field-error-msg"><FiAlertCircle /> {errors.message.message}</span>
                  )}
                </div>

                <button type="submit" className="btn-primary contact-submit-btn">
                  <FiSend /> Send Message (መልእክት ላክ)
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
