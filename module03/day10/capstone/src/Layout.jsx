import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="capstone-layout">
      <header className="capstone-header">
        <Link to="/" className="capstone-brand">
          <span style={{ fontSize: '1.5rem' }}>🏥</span>
          <span>MedAddis Clinic & Rx</span>
        </Link>

        <nav className="capstone-nav" aria-label="Clinical Navigation">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
            Dashboard
          </NavLink>
          <NavLink to="/patients" className={({ isActive }) => (isActive ? 'active' : '')}>
            Patients
          </NavLink>
          <NavLink to="/prescriptions" className={({ isActive }) => (isActive ? 'active' : '')}>
            Rx Queue
          </NavLink>
          <NavLink to="/dispense" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dispense Audit
          </NavLink>
        </nav>

        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Staff: <strong>R. Tadesse, RPh</strong> (Bole Health Center)
        </div>
      </header>

      <main className="capstone-main">
        <Outlet />
      </main>

      <footer className="capstone-footer">
        MedAddis Healthcare Frontend &bull; CodeOps Full Stack Software Development Capstone Scaffold &bull; IBT College Canada
      </footer>
    </div>
  );
}

export default Layout;
