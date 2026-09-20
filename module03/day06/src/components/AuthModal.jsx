import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiX, FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiCheck, FiArrowRight, FiZap } from 'react-icons/fi';
import { GiCookingPot } from 'react-icons/gi';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authTab, 
    setAuthTab, 
    login, 
    loginDemoUser, 
    register,
    user,
    logout
  } = useAuth();

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('Bole Atlas, Addis Ababa');
  const [regPassword, setRegPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setErrorMsg('');
    register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
      password: regPassword
    });
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div 
        className="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn"
          onClick={closeAuthModal}
          aria-label="Close modal"
        >
          <FiX />
        </button>

        {/* Modal Header Branding */}
        <div className="auth-header">
          <div className="badge-hearth">
            <GiCookingPot />
            <span>ADDIS EATS ACCOUNT</span>
          </div>
          <h2>{user ? 'Your Mesob Profile' : 'Welcome to Mesob House'}</h2>
          <span className="amharic-sub amharic-text">
            {user ? 'የመለያዎ መረጃ' : 'እንኳን ደህና መጡ • የሐበሻ ማዕድ'}
          </span>
        </div>

        {user ? (
          /* Profile View when Logged In */
          <div className="auth-profile-view">
            <div className="cart-auth-banner logged-in" style={{ marginBottom: '20px' }}>
              <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                {user.avatar}
              </div>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{user.name}</strong>
                <p style={{ margin: '2px 0' }}>{user.email}</p>
                <small className="muted">{user.phone} • {user.address}</small>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-primary full-width-btn"
              onClick={() => { logout(); closeAuthModal(); }}
            >
              <span>Sign Out of Account (ውጣ)</span>
            </button>
          </div>
        ) : (
          <>
            {/* Tab Switcher */}
            <div className="auth-tab-bar">
              <button 
                className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthTab('login'); setErrorMsg(''); }}
              >
                <span>Sign In</span>
                <small className="amharic-text">መግቢያ</small>
              </button>
              <button 
                className={`auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthTab('register'); setErrorMsg(''); }}
              >
                <span>Create Account</span>
                <small className="amharic-text">አዲስ መለያ</small>
              </button>
            </div>

            {errorMsg && (
              <div className="auth-error-banner">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Demo Quick Sign-in Banner */}
            <div className="demo-quick-banner">
              <div className="demo-text">
                <FiZap className="zap-icon" />
                <span>Fast Presentation Mode:</span>
              </div>
              <button 
                type="button" 
                className="btn-demo-login"
                onClick={() => { setErrorMsg(''); loginDemoUser(); }}
              >
                <span>1-Click Demo Login (Abebe B.)</span>
                <FiArrowRight />
              </button>
            </div>

        {authTab === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label><FiMail /> Email Address or Phone</label>
              <input 
                type="text" 
                required 
                placeholder="abebe@addiseats.et or 0911223344"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><FiLock /> Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary full-width-btn">
              <span>Sign In to Your Account</span>
              <FiArrowRight />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label><FiUser /> Full Name *</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Abebe Bikila"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><FiMail /> Email Address *</label>
              <input 
                type="email" 
                required 
                placeholder="abebe@addiseats.et"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label><FiPhone /> Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="091 123 4567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><FiMapPin /> Delivery District</label>
                <select 
                  value={regAddress} 
                  onChange={(e) => setRegAddress(e.target.value)}
                >
                  <option value="Bole Atlas, Addis Ababa">Bole Atlas / Medhanialem</option>
                  <option value="Kazanchis, Addis Ababa">Kazanchis / UNECA</option>
                  <option value="Old Airport, Addis Ababa">Old Airport / Bisrate Gabriel</option>
                  <option value="Piassa, Addis Ababa">Piassa / Arat Kilo</option>
                  <option value="Sarbet, Addis Ababa">Sarbet / African Union</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label><FiLock /> Password *</label>
              <input 
                type="password" 
                required 
                placeholder="Create a strong password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary full-width-btn">
              <span>Create Account & Join Mesob</span>
              <FiCheck />
            </button>
          </form>
        )}
        </>
        )}

        <div className="auth-footer">
          <p>By signing in, you agree to Addis Eats Terms of Service & Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
