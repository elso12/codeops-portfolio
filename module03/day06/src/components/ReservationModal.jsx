import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { reservationSchema } from '../utils/validationSchemas';
import { FiX, FiCalendar, FiClock, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { GiCookingPot } from 'react-icons/gi';

export default function ReservationModal() {
  const { isReservationOpen, closeReservation } = useCart();
  const [partySize, setPartySize] = useState('4');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [seatingPreference, setSeatingPreference] = useState('traditional-mesob');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!isReservationOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReservationOpen]);

  if (!isReservationOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      partySize,
      date,
      time,
      seatingPreference,
      name,
      phone,
      specialNotes
    };

    const validationResult = reservationSchema.safeParse(formData);
    if (!validationResult.success) {
      const formattedErrors = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) formattedErrors[err.path[0]] = err.message;
      });
      setValidationErrors(formattedErrors);
      return;
    }

    setValidationErrors({});
    setConfirmed(true);
  };

  const handleClose = () => {
    setConfirmed(false);
    setValidationErrors({});
    closeReservation();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div 
        className="reservation-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <FiX />
        </button>

        {!confirmed ? (
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="res-header">
              <div className="badge-hearth">
                <GiCookingPot />
                <span>BOLE MEDHANIALEM, ADDIS ABABA</span>
              </div>
              <h2>Reserve a Traditional Mesob Table</h2>
              <span className="amharic-sub amharic-text">ቦታ ያስይዙ • International & Local Guests</span>
              <p>Join us for communal dining, fresh stone-ground injera, and daily Buna ceremony.</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label><FiUsers /> Party Size</label>
                <select value={partySize} onChange={(e) => setPartySize(e.target.value)}>
                  <option value="2">2 Guests (Couple Mesob)</option>
                  <option value="4">4 Guests (Family Mesob)</option>
                  <option value="6">6 Guests (Communal Circle)</option>
                  <option value="8">8 Guests (Large Banquet)</option>
                  <option value="12">10-14 Guests (Royal Hall)</option>
                </select>
                {validationErrors.partySize && (
                  <span className="field-error-msg"><FiAlertCircle /> {validationErrors.partySize}</span>
                )}
              </div>

              <div className="form-group">
                <label><FiCalendar /> Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
                {validationErrors.date && (
                  <span className="field-error-msg"><FiAlertCircle /> {validationErrors.date}</span>
                )}
              </div>

              <div className="form-group">
                <label><FiClock /> Time</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="12:00">12:00 PM (Lunch Banquet)</option>
                  <option value="13:30">1:30 PM (Lunch)</option>
                  <option value="16:00">4:00 PM (Coffee Ceremony & Late Lunch)</option>
                  <option value="18:30">6:30 PM (Evening Dinner)</option>
                  <option value="20:00">8:00 PM (Prime Dinner)</option>
                  <option value="21:30">9:30 PM (Late Night Tej Feast)</option>
                </select>
                {validationErrors.time && (
                  <span className="field-error-msg"><FiAlertCircle /> {validationErrors.time}</span>
                )}
              </div>

              <div className="form-group">
                <label>Seating Preference</label>
                <select 
                  value={seatingPreference} 
                  onChange={(e) => setSeatingPreference(e.target.value)}
                >
                  <option value="traditional-mesob">Traditional Woven Mesob with Low Stools</option>
                  <option value="modern-table">Elevated Dining Table</option>
                  <option value="hearth-view">Ceremonial Buna Hearth View</option>
                  <option value="terrace">Open-Air Addis Terrace</option>
                </select>
              </div>

              <div className="form-group">
                <label>Contact Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dawit Haile or Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {validationErrors.name && (
                  <span className="field-error-msg"><FiAlertCircle /> {validationErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number (Local or International) *</label>
                <input 
                  type="tel" 
                  placeholder="+251 91 123 4567 or +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {validationErrors.phone && (
                  <span className="field-error-msg"><FiAlertCircle /> {validationErrors.phone}</span>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Special Occasion or Dietary Preferences</label>
              <textarea 
                rows="2"
                placeholder="e.g. Birthday celebration, strict fasting (vegan) group, extra tej..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary full-width-btn">
              <span>Confirm Table Reservation</span>
            </button>
          </form>
        ) : (
          <div className="order-success-view">
            <div className="success-icon-box">
              <FiCheckCircle />
            </div>
            <span className="badge-hearth">RESERVATION BOOKED</span>
            <h2>We Look Forward to Welcoming You!</h2>
            <span className="amharic-sub amharic-text">እንኳን በደህና መጡ!</span>

            <div className="order-ref-card">
              <p>
                A table for <strong>{partySize} guests</strong> has been reserved for <strong>{name}</strong> on <strong>{date || 'Today'}</strong> at <strong>{time}</strong>.
              </p>
              <p>A confirmation SMS has been sent to <strong>{phone}</strong>.</p>
            </div>

            <button className="btn-primary" onClick={handleClose}>
              Close & View Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
