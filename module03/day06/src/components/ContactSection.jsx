import React, { useState } from 'react';
import { FiMapPin, FiClock, FiPhone, FiMail, FiSend, FiCheckCircle, FiCompass, FiAlertCircle } from 'react-icons/fi';
import { GiEnvelope } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { contactSchema } from '../utils/validationSchemas';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useCart();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) formattedErrors[err.path[0]] = err.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setSubmitted(true);
    setFieldErrors({});
    showToast('Inquiry received! Our concierge will contact you shortly.');
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }, 4000);
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
                <p>Thank you for reaching out to Mesob House. Our host will respond to {formData.email} within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row-2col">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="e.g. Almaz Bekele" 
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {fieldErrors.name && (
                      <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.name}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="almaz@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {fieldErrors.email && (
                      <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.email}</span>
                    )}
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label>Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="+251 9... / +1..." 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                    >
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
                    name="message" 
                    rows="5" 
                    placeholder="Describe your inquiry, event date, guest count, or questions..." 
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  {fieldErrors.message && (
                    <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.message}</span>
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
