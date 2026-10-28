import React from 'react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Clinic Triage & Dispensary Operations
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Bole Subcity Community Health Center &bull; Operational shift for <strong>Rahel Tadesse</strong>
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="capstone-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Triage Waiting</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.4rem 0' }}>14 Patients</div>
          <span className="capstone-badge badge-emergency">2 Emergency</span>
        </div>

        <div className="capstone-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pharmacy Dispense Queue</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.4rem 0' }}>8 Prescriptions</div>
          <span className="capstone-badge badge-urgent">3 Priority Stat</span>
        </div>

        <div className="capstone-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Dispensed Today</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.4rem 0' }}>62 Orders</div>
          <span className="capstone-badge badge-standard">100% Audit Verified</span>
        </div>

        <div className="capstone-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Inventory Stock Status</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.4rem 0' }}>96.4%</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Amoxicillin low stock</span>
        </div>
      </div>

      {/* Quick Launchpad */}
      <div className="capstone-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Quick Triage Launchpad
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/patients"
            style={{
              background: 'var(--primary)',
              color: '#fff',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            📋 Search Patient Registry &rarr;
          </Link>
          <Link
            to="/prescriptions"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            💊 Open Pharmacy Queue (8) &rarr;
          </Link>
          <Link
            to="/dispense"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            📝 Dispense Audit Form &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
