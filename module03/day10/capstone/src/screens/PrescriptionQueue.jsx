import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_QUEUE = [
  { id: 'RX-9821', patientName: 'Almaz Mengistu', mrn: 'ETH-MED-8492', drug: 'Prednisolone 20mg Tab', qty: '30 tablets', doctor: 'Dr. Girma Wolde', priority: 'Stat Urgent', stockStatus: 'In Stock (420 tabs left)' },
  { id: 'RX-9822', patientName: 'Dawit Yohannes', mrn: 'ETH-MED-5104', drug: 'Cephalexin 500mg Caps', qty: '20 caps', doctor: 'Dr. Senait Bekele', priority: 'Standard', stockStatus: 'In Stock (180 caps left)' },
  { id: 'RX-9823', patientName: 'Kenenisa Bekele', mrn: 'ETH-MED-7341', drug: 'Metformin 850mg Tab', qty: '60 tablets', doctor: 'Dr. Girma Wolde', priority: 'Standard', stockStatus: 'Low Stock (45 tabs left)' },
];

export function PrescriptionQueue() {
  const [queue] = useState(INITIAL_QUEUE);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Pharmacy Dispense Queue</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time prescription orders submitted from outpatient consultation rooms.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {queue.map((item) => (
          <div key={item.id} className="capstone-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{item.id}</span>
                <span className={`capstone-badge ${item.priority.includes('Urgent') ? 'badge-emergency' : 'badge-standard'}`}>
                  {item.priority}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ordered by {item.doctor}</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {item.patientName} &bull; <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.mrn}</span>
              </h2>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Prescribed: <strong>{item.drug}</strong> &bull; Qty: {item.qty} &bull; <span style={{ color: 'var(--success)' }}>{item.stockStatus}</span>
              </div>
            </div>

            <Link
              to={`/dispense?rxId=${item.id}`}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.65rem 1.15rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Verify & Dispense &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrescriptionQueue;
