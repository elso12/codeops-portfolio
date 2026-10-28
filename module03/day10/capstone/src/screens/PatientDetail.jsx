import React from 'react';
import { useParams, Link } from 'react-router-dom';

const PATIENTS_MAP = {
  'ETH-MED-8492': {
    id: 'ETH-MED-8492',
    name: 'Almaz Mengistu',
    age: 46,
    sex: 'Female',
    phone: '+251911448822',
    address: 'Bole Subcity, Woreda 03, House 512',
    allergies: ['Penicillin G', 'Aspirin'],
    vitals: { bp: '138/86 mmHg', pulse: '88 bpm', temp: '37.1 C', spo2: '94%' },
    diagnosis: 'Moderate Acute Asthma Exacerbation',
    activeRx: [
      { drug: 'Salbutamol Inhaler 100mcg', sig: '2 puffs q4h PRN', status: 'Active' },
      { drug: 'Prednisolone 20mg Tab', sig: '1 tab PO daily x 5d', status: 'Pending Pharmacy Dispense' },
    ],
  },
};

export function PatientDetail() {
  const { id } = useParams();
  const patient = PATIENTS_MAP[id] || {
    id: id || 'ETH-MED-UNKNOWN',
    name: 'Standard Patient Record',
    age: 35,
    sex: 'Adult',
    phone: '+251911000000',
    address: 'Addis Ababa Outpatient Clinic',
    allergies: ['No Known Drug Allergies (NKDA)'],
    vitals: { bp: '120/80 mmHg', pulse: '72 bpm', temp: '36.8 C', spo2: '98%' },
    diagnosis: 'Routine Medical Checkup',
    activeRx: [{ drug: 'Multivitamin Formula B', sig: '1 cap daily', status: 'Dispensed' }],
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
        <Link to="/patients" style={{ color: 'var(--text-muted)' }}>&larr; Return to Patient Registry</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{patient.id}</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{patient.name}</h1>
          <div style={{ color: 'var(--text-secondary)' }}>
            {patient.age} years &bull; {patient.sex} &bull; {patient.phone} &bull; {patient.address}
          </div>
        </div>

        <Link
          to={`/dispense?patientId=${patient.id}`}
          style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 700,
          }}
        >
          Proceed to Dispense Verification &rarr;
        </Link>
      </div>

      {/* Allergies Alert Banner */}
      <div className="capstone-card" style={{ borderLeft: '4px solid var(--danger)', background: 'var(--danger-bg)' }}>
        <div style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: '0.4rem' }}>
          ⚠️ DOCUMENTED PHARMACEUTICAL ALLERGIES
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {patient.allergies.map((allergy) => (
            <span key={allergy} className="capstone-badge badge-emergency">
              {allergy}
            </span>
          ))}
        </div>
      </div>

      {/* Vitals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="capstone-card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Blood Pressure</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{patient.vitals.bp}</div>
        </div>
        <div className="capstone-card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Heart Rate</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{patient.vitals.pulse}</div>
        </div>
        <div className="capstone-card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Body Temperature</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{patient.vitals.temp}</div>
        </div>
        <div className="capstone-card" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>SpO2 Oxygen</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{patient.vitals.spo2}</div>
        </div>
      </div>

      {/* Active Prescription Regimen */}
      <div className="capstone-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Prescription Regimen (Doctor Orders)
        </h2>
        {patient.activeRx.map((rx, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{rx.drug}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instructions: {rx.sig}</div>
            </div>
            <span className="capstone-badge badge-urgent">{rx.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientDetail;
