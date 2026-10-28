import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export function DispenseAudit() {
  const [searchParams] = useSearchParams();
  const initialRx = searchParams.get('rxId') || 'RX-9821';

  const [form, setForm] = useState({
    rxId: initialRx,
    batchLot: 'LOT-2026-ETH-492',
    dispensedQty: '30',
    allergyVerified: false,
    pharmacistPin: '8492',
    counselingNotes: 'Instructed patient: take after meals in the morning.',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.allergyVerified) {
      setError('Safety requirement: Pharmacist must verify patient allergies before dispensing.');
      return;
    }
    if (!form.batchLot || form.batchLot.length < 5) {
      setError('Please provide a valid manufacturer batch / lot number for audit.');
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Dispense Safety & Verification Audit</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Ministry of Health Pharmacovigilance & Batch Traceability Form &bull; Bole Health Center
        </p>
      </div>

      {submitted ? (
        <div className="capstone-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.5rem' }}>
            Dispense Logged Successfully
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Rx reference <strong>{form.rxId}</strong> with batch <strong>{form.batchLot}</strong> has been logged to the national clinical audit database.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Dispense Another Rx
            </button>
            <Link
              to="/prescriptions"
              style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Back to Queue
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="capstone-card">
          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '0.85rem', borderRadius: '8px', color: 'var(--danger)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Prescription Order ID
            </label>
            <input
              type="text"
              value={form.rxId}
              onChange={(e) => setForm({ ...form, rxId: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Manufacturer Batch / Lot Number
            </label>
            <input
              type="text"
              value={form.batchLot}
              onChange={(e) => setForm({ ...form, batchLot: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Dispensed Unit Quantity
            </label>
            <input
              type="text"
              value={form.dispensedQty}
              onChange={(e) => setForm({ ...form, dispensedQty: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem', background: 'var(--surface-raised)', padding: '1rem', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={form.allergyVerified}
                onChange={(e) => setForm({ ...form, allergyVerified: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <span>
                <strong>Cross-Allergy Clearance:</strong> I certify that patient clinical chart allergies have been cross-referenced with this medication formulation.
              </span>
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Patient Counseling Instructions
            </label>
            <textarea
              rows={3}
              value={form.counselingNotes}
              onChange={(e) => setForm({ ...form, counselingNotes: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.85rem',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Authorize & Log Dispense &rarr;
          </button>
        </form>
      )}
    </div>
  );
}

export default DispenseAudit;
