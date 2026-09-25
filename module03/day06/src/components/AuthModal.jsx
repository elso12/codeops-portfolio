import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authLoginSchema, authRegisterSchema } from '../utils/validationSchemas';
import { FiX, FiMail, FiLock, FiUser, FiPhone, FiGlobe, FiCheck, FiArrowRight, FiZap, FiAlertCircle } from 'react-icons/fi';
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
  const [fieldErrors, setFieldErrors] = useState({});

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});

    const formData = { email: loginEmail, password: loginPassword };
    const result = authLoginSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) formattedErrors[err.path[0]] = err.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setErrorMsg('');
    login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});

    const formData = {
      name: regName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
      password: regPassword
    };

    const result = authRegisterSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) formattedErrors[err.path[0]] = err.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setErrorMsg('');
    register(formData);
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal} role="dialog" aria-modal="true">
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
            <span>ADDIS EATS GLOBAL ACCOUNT</span>
          </div>
          <h2>{user ? 'Your Mesob Profile' : 'Welcome to Mesob House'}</h2>
          <span className="amharic-sub amharic-text">
            {user ? 'የመለያዎ መረጃ' : 'እንኳን ደህና መጡ • Global Habesha Feast'}
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
                <small className="muted">📞 {user.phone} • 📍 {user.address}</small>
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
                onClick={() => { setAuthTab('login'); setErrorMsg(''); setFieldErrors({}); }}
              >
                <span>Sign In</span>
                <small className="amharic-text">መግቢያ</small>
              </button>
              <button 
                className={`auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthTab('register'); setErrorMsg(''); setFieldErrors({}); }}
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
                <span>Fast Demo Access:</span>
              </div>
              <button 
                type="button" 
                className="btn-demo-login"
                onClick={() => { setErrorMsg(''); setFieldErrors({}); loginDemoUser(); }}
              >
                <span>1-Click Demo Sign In (Abebe B.)</span>
                <FiArrowRight />
              </button>
            </div>

        {authTab === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label><FiMail /> Email Address or Phone (Local or International)</label>
              <input 
                type="text" 
                placeholder="abebe@addiseats.et or +1 (555) 019-2834 / +251911223344"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              {fieldErrors.email && (
                <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label><FiLock /> Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              {fieldErrors.password && (
                <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.password}</span>
              )}
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
                placeholder="e.g. Abebe Bikila or Sarah Jenkins"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
              {fieldErrors.name && (
                <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label><FiMail /> Email Address *</label>
              <input 
                type="email" 
                placeholder="guest@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              {fieldErrors.email && (
                <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.email}</span>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label><FiPhone /> Phone (+ Country Code) *</label>
                <input 
                  type="tel" 
                  placeholder="+251 91 123 4567 or +1 555 019 2834"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
                {fieldErrors.phone && (
                  <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label><FiGlobe /> Location / Country District</label>
                <select 
                  value={regAddress} 
                  onChange={(e) => setRegAddress(e.target.value)}
                >
                  <option value="Bole Atlas, Addis Ababa">📍 Bole Atlas / Medhanialem (Addis)</option>
                  <option value="Kazanchis, Addis Ababa">📍 Kazanchis / UNECA (Addis)</option>
                  <option value="Old Airport, Addis Ababa">📍 Old Airport (Addis)</option>
                  <option value="Piassa, Addis Ababa">📍 Piassa / Arat Kilo (Addis)</option>
                  <option value="Washington DC, USA">🌍 Washington DC, USA (Diaspora Guest)</option>
                  <option value="London, United Kingdom">🌍 London, UK (International Guest)</option>
                  <option value="Frankfurt, Germany">🌍 Frankfurt, Germany (International Guest)</option>
                  <option value="Global Guest / Traveler">🌍 Other International City</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label><FiLock /> Password *</label>
              <input 
                type="password" 
                placeholder="Create a strong password (min 6 chars)"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              {fieldErrors.password && (
                <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.password}</span>
              )}
            </div>

            <button type="submit" className="btn-primary full-width-btn">
              <span>Create Account & Join VIP Mesob</span>
              <FiCheck />
            </button>
          </form>
        )}
        </>
        )}

        <div className="auth-footer">
          <p>By signing in, you agree to Addis Eats Terms of Service & Global Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
