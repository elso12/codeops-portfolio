'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReservationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('MESOB-4192');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '4',
    date: '2026-10-10',
    time: '19:00',
    seating: 'Traditional Handcrafted Mesob (Low Seating)',
    culturalNotes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmationCode(`MESOB-${Math.floor(1000 + Math.random() * 9000)}`);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--color-turmeric)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-turmeric)', letterSpacing: '1px', textTransform: 'uppercase' }}>
          ጠረጴዛዎ ተይዟል · Table Confirmed
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem', color: '#fff' }}>
          Mesob Reserved for {formData.name}!
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          We look forward to welcoming you and your party of <strong>{formData.guests}</strong> on{' '}
          <strong>{formData.date} at {formData.time}</strong> for an unforgettable Habesha dining experience.
        </p>

        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          textAlign: 'left',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          <div><strong>Seating Style:</strong> <span style={{ color: 'var(--color-turmeric)' }}>{formData.seating}</span></div>
          <div style={{ marginTop: '0.4rem' }}><strong>Confirmation Code:</strong> <code style={{ color: '#fff' }}>{confirmationCode}</code></div>
          {formData.culturalNotes && (
            <div style={{ marginTop: '0.4rem' }}><strong>Special Request:</strong> <span>{formData.culturalNotes}</span></div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/menu" className="btn btn-primary">
            Explore Menu Offerings &rarr;
          </Link>
          <button
            onClick={() => setSubmitted(false)}
            className="btn btn-secondary"
          >
            Modify Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '20px',
      padding: '2.5rem',
      maxWidth: '680px',
      margin: '0 auto',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Full Name *
          </label>
          <input
            type="text"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Eyasu Nigussie"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: '#fff',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Phone Number *
          </label>
          <input
            type="tel"
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+251 91 123 4567"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: '#fff',
              fontSize: '0.95rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Date *
          </label>
          <input
            type="date"
            required
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: '#fff',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Time *
          </label>
          <input
            type="time"
            required
            name="time"
            value={formData.time}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: '#fff',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Guests (Mesob size)
          </label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: '#fff',
              fontSize: '0.95rem'
            }}
          >
            <option value="2">2 Guests (Couple)</option>
            <option value="4">4 Guests (Family Mesob)</option>
            <option value="6">6 Guests (Banquet Mesob)</option>
            <option value="8">8 Guests (Large Celebration)</option>
            <option value="12">12+ Guests (Private Lounge)</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Seating Preference
        </label>
        <select
          name="seating"
          value={formData.seating}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: '#fff',
            fontSize: '0.95rem'
          }}
        >
          <option value="Traditional Handcrafted Mesob (Low Seating)">Traditional Handcrafted Mesob (Low woven seating)</option>
          <option value="Highland View Terrace">Highland View Outdoor Terrace</option>
          <option value="Jebena Buna Cultural Lounge">Jebena Buna Cultural Coffee Lounge</option>
          <option value="Standard Modern Dining Table">Standard Elevated Dining Table</option>
        </select>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Special Requests &amp; Dietary Preferences
        </label>
        <textarea
          name="culturalNotes"
          value={formData.culturalNotes}
          onChange={handleChange}
          rows={3}
          placeholder="e.g. Strict vegan fasting feast, celebration gursha assistance, window table requested..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: '#fff',
            fontSize: '0.95rem',
            resize: 'vertical'
          }}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.95rem', fontSize: '1.05rem' }}>
        Confirm Table Reservation &rarr;
      </button>
    </form>
  );
}
