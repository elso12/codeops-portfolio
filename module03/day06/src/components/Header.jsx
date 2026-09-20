import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  FiShoppingBag, 
  FiSearch, 
  FiMenu, 
  FiX, 
  FiCalendar, 
  FiPhone, 
  FiClock,
  FiMapPin,
  FiUser,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import { GiCoffeePot, GiCookingPot } from 'react-icons/gi';

export default function Header({ searchQuery, setSearchQuery, onNavigate }) {
  const { totalItems, openCart, openReservation } = useCart();
  const { user, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Top Announcements & Hours Banner */}
      <div className="top-banner">
        <div className="container banner-inner">
          <div className="banner-item">
            <FiMapPin className="banner-icon" />
            <span>Bole Medhanialem, Addis Ababa</span>
          </div>
          <div className="banner-item">
            <FiClock className="banner-icon" />
            <span>Open Daily: 11:30 AM – 11:00 PM</span>
          </div>
          <div className="banner-item ceremony-alert">
            <GiCoffeePot className="banner-icon highlight" />
            <span><strong>Buna Ceremony</strong> at 4:00 PM Daily</span>
          </div>
          <div className="banner-item contact-item">
            <FiPhone className="banner-icon" />
            <span>+251 91 123 4567</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="navbar-header">
        <div className="container navbar-container">
          {/* Logo & Ethiopian Identity */}
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>
            <div className="brand-icon-box">
              <GiCookingPot className="brand-pot-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-title">MESOB HOUSE</span>
              <span className="brand-amharic amharic-text">የሐበሻ ቤት • ADDIS EATS</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <button className="nav-link" onClick={() => handleNavClick('specials')}>
              Today's Specials
            </button>
            <button className="nav-link" onClick={() => handleNavClick('menu')}>
              Banquet Menu
            </button>
            <button className="nav-link" onClick={() => handleNavClick('buna-ceremony')}>
              Buna Ceremony
            </button>
            <button className="nav-link" onClick={() => handleNavClick('heritage')}>
              Gursha & Heritage
            </button>
          </nav>

          {/* Right Controls */}
          <div className="navbar-actions">
            {/* Search Bar / Trigger */}
            <div className={`search-wrapper ${isSearchOpen ? 'expanded' : ''}`}>
              <button 
                className="icon-btn" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search Menu"
                title="Search Menu"
              >
                <FiSearch />
              </button>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search wats, kitfo, tibs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="navbar-search-input"
                  autoFocus
                />
              )}
            </div>

            {/* User Account / Auth Control */}
            {user ? (
              <div className="user-menu-wrapper">
                <button 
                  className="user-profile-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="User account menu"
                >
                  <div className="user-avatar">{user.avatar}</div>
                  <span className="user-name-label">{user.name.split(' ')[0]}</span>
                  <FiChevronDown className={`chevron-icon ${isUserMenuOpen ? 'open' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-header">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                      <span className="user-location-badge">📍 {user.address}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-item"
                      onClick={() => { setIsUserMenuOpen(false); logout(); }}
                    >
                      <FiLogOut />
                      <span>Sign Out (ውጣ)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="btn-auth-signin"
                onClick={() => openAuthModal('login')}
              >
                <FiUser />
                <span>Sign In</span>
              </button>
            )}

            {/* Table Booking */}
            <button 
              className="btn-accent nav-reserve-btn"
              onClick={openReservation}
            >
              <FiCalendar />
              <span>Book Mesob</span>
            </button>

            {/* Cart Button */}
            <button 
              className="cart-trigger-btn"
              onClick={openCart}
              aria-label={`Cart with ${totalItems} items`}
            >
              <FiShoppingBag className="cart-icon" />
              <span className="cart-badge">{totalItems}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-search-box">
              <FiSearch className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search wats, kitfo, vegan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <nav className="mobile-nav-links">
              {/* Mobile Auth Button */}
              {user ? (
                <div className="mobile-user-card">
                  <div className="user-avatar">{user.avatar}</div>
                  <div className="user-info">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <button className="mobile-logout-btn" onClick={() => { setMobileMenuOpen(false); logout(); }}>
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  className="mobile-auth-btn" 
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                >
                  <FiUser /> Sign In / Create Account (መግቢያ)
                </button>
              )}

              <button onClick={() => handleNavClick('specials')}>
                🔥 Today's Specials (የዕለቱ ልዩ)
              </button>
              <button onClick={() => handleNavClick('menu')}>
                🍲 Banquet Menu (የምግብ ዝርዝር)
              </button>
              <button onClick={() => handleNavClick('buna-ceremony')}>
                ☕ Buna Ceremony (የቡና ሥነ-ሥርዓት)
              </button>
              <button onClick={() => handleNavClick('heritage')}>
                🌿 Gursha & Culture (ባህልና እንግዳ ተቀባይነት)
              </button>
              <button className="mobile-reserve-link" onClick={() => { setMobileMenuOpen(false); openReservation(); }}>
                <FiCalendar /> Reserve a Traditional Mesob Table
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
