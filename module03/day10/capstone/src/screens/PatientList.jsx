import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_PATIENTS = [
  { id: 'ETH-MED-8492', name: 'Almaz Mengistu', age: 46, sex: 'F', priority: 'Emergency', chiefComplaint: 'Acute Asthma Exacerbation', phone: '+251911448822' },
  { id: 'ETH-MED-5104', name: 'Dawit Yohannes', age: 31, sex: 'M', priority: 'Urgent', chiefComplaint: 'Laceration forearm', phone: '+251912993311' },
  { id: 'ETH-MED-9218', name: 'Hiwot Tadesse', age: 24, sex: 'F', priority: 'Standard', chiefComplaint: 'Routine antenatal check', phone: '+251910557766' },
  { id: 'ETH-MED-7341', name: 'Kenenisa Bekele', age: 62, sex: 'M', priority: 'Urgent', chiefComplaint: 'Type 2 Diabetes follow-up', phone: '+251911883344' },
];

export function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filtered = MOCK_PATIENTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === 'All' || p.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Patient Master Directory</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Search active patients by name, MRN, or triage urgency level.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="search"
            placeholder="Search Name or MRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--surface-color)',
              color: 'var(--text-primary)',
            }}
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--surface-color)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="All">All Triage</option>
            <option value="Emergency">Emergency</option>
            <option value="Urgent">Urgent</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
      </div>

      <div className="capstone-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.85rem 1rem' }}>MRN ID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Patient Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Age / Sex</th>
              <th style={{ padding: '0.85rem 1rem' }}>Priority</th>
              <th style={{ padding: '0.85rem 1rem' }}>Chief Complaint</th>
              <th style={{ padding: '0.85rem 1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient) => (
              <tr key={patient.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--primary)' }}>
                  {patient.id}
                </td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{patient.name}</td>
                <td style={{ padding: '1rem' }}>{patient.age}y &bull; {patient.sex}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`capstone-badge badge-${patient.priority.toLowerCase()}`}>
                    {patient.priority}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  {patient.chiefComplaint}
                </td>
                <td style={{ padding: '1rem' }}>
                  <Link
                    to={`/patients/${patient.id}`}
                    style={{
                      color: 'var(--primary)',
                      fontWeight: 600,
                      textDecoration: 'underline',
                    }}
                  >
                    Open Chart &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientList;
