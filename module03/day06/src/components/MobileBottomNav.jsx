import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiShoppingBag, FiCalendar, FiUser } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { GiCookingPot } from 'react-icons/gi';

export default function MobileBottomNav({ onNavigate }) {
  const { totalItems, openCart, openReservation } = useCart();
  const { user, openAuthModal } = useAuth();

  const handleNav = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="mobile-bottom-nav">
      <button className="bottom-nav-item" onClick={() => handleNav('hero')}>
        <FiHome />
        <span>Home</span>
      </button>

      <button className="bottom-nav-item" onClick={() => handleNav('specials')}>
        <FaFire />
        <span>Specials</span>
      </button>

      <button className="bottom-nav-item" onClick={() => handleNav('menu')}>
        <GiCookingPot />
        <span>Menu</span>
      </button>

      <button className="bottom-nav-item highlight-btn" onClick={openReservation}>
        <FiCalendar />
        <span>Book</span>
      </button>

      <button className="bottom-nav-item" onClick={() => openAuthModal('login')}>
        <FiUser />
        <span>{user ? user.avatar : 'Account'}</span>
      </button>

      <button className="bottom-nav-item cart-btn-mobile" onClick={openCart}>
        <div className="mobile-cart-icon-wrap">
          <FiShoppingBag />
          {totalItems > 0 && <span className="mobile-cart-count">{totalItems}</span>}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
}
