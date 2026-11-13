"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function ReservationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const [confirmationCode, setConfirmationCode] = useState("MESOB-4192");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    guests: "4",
    date: "2026-10-10",
    time: "19:00",
    seating: "Traditional Handcrafted Mesob (Low Seating)",
    culturalNotes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submittingRef.current || loading) return;
    submittingRef.current = true;
    setLoading(true);

    setConfirmationCode(`MESOB-${Math.floor(1000 + Math.random() * 9000)}`);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      submittingRef.current = false;
    }, 400);
  };

  if (submitted) {
    return (
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-gold)",
        borderRadius: "var(--radius-xl)",
        padding: "3.5rem 2rem",
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
        boxShadow: "var(--shadow-hover)"
      }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-paprika)", letterSpacing: "1.2px", textTransform: "uppercase" }}>
          ጠረጴዛዎ ተይዟል · Table Confirmed
        </span>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 800, marginTop: "0.5rem", marginBottom: "1rem", color: "var(--text-main)" }}>
          Mesob Reserved for {formData.name}!
        </h2>
        <p style={{ color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "1.75rem", fontSize: "1.05rem" }}>
          We look forward to welcoming you and your party of <strong>{formData.guests}</strong> on{" "}
          <strong>{formData.date} at {formData.time}</strong> for an authentic Habesha dining ceremony.
        </p>

        <div style={{
          background: "var(--bg-surface-sand)",
          padding: "1.5rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid #ebd9ca",
          textAlign: "left",
          marginBottom: "2.25rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.65rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Confirmation Code:</span>
            <strong style={{ color: "var(--color-paprika)", fontFamily: "monospace", fontSize: "1.1rem" }}>{confirmationCode}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.65rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Seating Style:</span>
            <span style={{ color: "var(--text-main)", fontWeight: 600, fontSize: "0.9rem" }}>{formData.seating}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Contact:</span>
            <span style={{ color: "var(--text-main)", fontWeight: 600, fontSize: "0.9rem" }}>{formData.phone}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setSubmitted(false)} className="btn-figma btn-figma--sand">
            Book Another Table
          </button>
          <Link href="/menu" className="btn-figma btn-figma--primary">
            Explore Menu &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Abebe Bikila"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="0911223344"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="guest@mesobhouse.et"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="guests">Number of Guests</label>
          <select id="guests" name="guests" value={formData.guests} onChange={handleChange}>
            <option value="1">1 Person (Solo Dining)</option>
            <option value="2">2 Persons (Couple Mesob)</option>
            <option value="4">4 Persons (Family Basket)</option>
            <option value="6">6 Persons (Communal Feast)</option>
            <option value="8+">8+ Persons (Grand Banquet)</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div className="form-group">
          <label htmlFor="date">Reservation Date</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
          <select id="time" name="time" value={formData.time} onChange={handleChange}>
            <option value="12:00">12:00 PM (Lunch)</option>
            <option value="13:30">1:30 PM (Lunch)</option>
            <option value="18:00">6:00 PM (Dinner &amp; Buna)</option>
            <option value="19:30">7:30 PM (Peak Dinner)</option>
            <option value="21:00">9:00 PM (Late Dining)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="seating">Preferred Dining Arrangement</label>
        <select id="seating" name="seating" value={formData.seating} onChange={handleChange}>
          <option value="Traditional Handcrafted Mesob (Low Seating)">
            Traditional Handcrafted Mesob (Low Seating with Stools)
          </option>
          <option value="Standard Table Seating">
            Standard Table Dining (High Chairs &amp; Large Center Mesob)
          </option>
          <option value="VIP Buna Ceremony Alcove">
            VIP Buna Ceremony Alcove (Private Traditional Lounge)
          </option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="culturalNotes">Special Cultural Notes or Dietary Requests (optional)</label>
        <textarea
          id="culturalNotes"
          name="culturalNotes"
          rows={3}
          placeholder="e.g. Celebrating an anniversary, strict Orthodox fasting (Tsom), mild berbere spice preference..."
          value={formData.culturalNotes}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="btn-figma btn-figma--primary"
        style={{ width: "100%", justifyContent: "center", fontSize: "1.05rem", padding: "0.9rem", minHeight: "48px" }}
        disabled={loading}
      >
        {loading ? (
          <><span className="spinner" aria-hidden="true" /> Reserving Mesob Table…</>
        ) : (
          "Confirm Mesob Reservation →"
        )}
      </button>
    </form>
  );
}
