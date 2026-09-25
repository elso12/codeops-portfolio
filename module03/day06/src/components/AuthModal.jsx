import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

  // Login Form via react-hook-form & zodResolver
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm
  } = useForm({
    resolver: zodResolver(authLoginSchema),
    defaultValues: { email: '', password: '' }
  });

  // Register Form via react-hook-form & zodResolver
  const {
    register: registerReg,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors },
    reset: resetRegForm
  } = useForm({
    resolver: zodResolver(authRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: 'Bole Atlas, Addis Ababa',
      password: ''
    }
  });

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

  const onLoginValid = (data) => {
    login(data.email, data.password);
    resetLoginForm();
  };

  const onRegisterValid = (data) => {
    register(data);
    resetRegForm();
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
                type="button"
                className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => setAuthTab('login')}
              >
                <span>Sign In</span>
                <small className="amharic-text">መግቢያ</small>
              </button>
              <button 
                type="button"
                className={`auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => setAuthTab('register')}
              >
                <span>Create Account</span>
                <small className="amharic-text">አዲስ መለያ</small>
              </button>
            </div>

            {/* Demo Quick Sign-in Banner */}
            <div className="demo-quick-banner">
              <div className="demo-text">
                <FiZap className="zap-icon" />
                <span>Fast Demo Access:</span>
              </div>
              <button 
                type="button" 
                className="btn-demo-login"
                onClick={() => loginDemoUser()}
              >
                <span>1-Click Demo Sign In (Abebe B.)</span>
                <FiArrowRight />
              </button>
            </div>

            {authTab === 'login' ? (
              /* Login Form */
              <form onSubmit={handleLoginSubmit(onLoginValid)} className="auth-form" noValidate>
                <div className="form-group">
                  <label><FiMail /> Email Address or Phone (Local or International)</label>
                  <input 
                    type="text" 
                    placeholder="abebe@addiseats.et or +1 (555) 019-2834 / +251911223344"
                    {...registerLogin('email')}
                  />
                  {loginErrors.email && (
                    <span className="field-error-msg"><FiAlertCircle /> {loginErrors.email.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label><FiLock /> Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    {...registerLogin('password')}
                  />
                  {loginErrors.password && (
                    <span className="field-error-msg"><FiAlertCircle /> {loginErrors.password.message}</span>
                  )}
                </div>

                <button type="submit" className="btn-primary full-width-btn">
                  <span>Sign In to Your Account</span>
                  <FiArrowRight />
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit(onRegisterValid)} className="auth-form" noValidate>
                <div className="form-group">
                  <label><FiUser /> Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Abebe Bikila or Sarah Jenkins"
                    {...registerReg('name')}
                  />
                  {regErrors.name && (
                    <span className="field-error-msg"><FiAlertCircle /> {regErrors.name.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label><FiMail /> Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="guest@example.com"
                    {...registerReg('email')}
                  />
                  {regErrors.email && (
                    <span className="field-error-msg"><FiAlertCircle /> {regErrors.email.message}</span>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label><FiPhone /> Phone (+ Country Code) *</label>
                    <input 
                      type="tel" 
                      placeholder="+251 91 123 4567 or +1 555 019 2834"
                      {...registerReg('phone')}
                    />
                    {regErrors.phone && (
                      <span className="field-error-msg"><FiAlertCircle /> {regErrors.phone.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label><FiGlobe /> Location / Country District</label>
                    <select {...registerReg('address')}>
                      <option value="Bole Atlas, Addis Ababa">📍 Bole Atlas / Medhanialem (Addis)</option>
                      <option value="Kazanchis, Addis Ababa">📍 Kazanchis / UNECA (Addis)</option>
                      <option value="Old Airport, Addis Ababa">📍 Old Airport (Addis)</option>
                      <option value="Piassa, Addis Ababa">📍 Piassa / Arat Kilo (Addis)</option>
                      <option value="Washington DC, USA">🌍 Washington DC, USA (Diaspora Guest)</option>
                      <option value="London, United Kingdom">🌍 London, UK (International Guest)</option>
                      <option value="Frankfurt, Germany">🌍 Frankfurt, Germany (International Guest)</option>
                      <option value="Global Guest / Traveler">🌍 Other International City</option>
                    </select>
                    {regErrors.address && (
                      <span className="field-error-msg"><FiAlertCircle /> {regErrors.address.message}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label><FiLock /> Password *</label>
                  <input 
                    type="password" 
                    placeholder="Create a strong password (min 6 chars)"
                    {...registerReg('password')}
                  />
                  {regErrors.password && (
                    <span className="field-error-msg"><FiAlertCircle /> {regErrors.password.message}</span>
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
