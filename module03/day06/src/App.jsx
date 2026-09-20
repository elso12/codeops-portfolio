import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchFullMenu, fetchSpecials, NORMALIZED_FALLBACK_MENU, NORMALIZED_FALLBACK_SPECIALS } from './services/api';

import Header from './components/Header';
import Hero from './components/Hero';
import SpecialsSection from './components/SpecialsSection';
import MenuSection from './components/MenuSection';
import BunaCeremony from './components/BunaCeremony';
import HeritageSection from './components/HeritageSection';
import Footer from './components/Footer';
import DishDetailModal from './components/DishDetailModal';
import CartDrawer from './components/CartDrawer';
import ReservationModal from './components/ReservationModal';
import AuthModal from './components/AuthModal';
import MobileBottomNav from './components/MobileBottomNav';

import './App.css';

function MainApp() {
  const [menu, setMenu] = useState(NORMALIZED_FALLBACK_MENU);
  const [specials, setSpecials] = useState(NORMALIZED_FALLBACK_SPECIALS);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingSpecials, setLoadingSpecials] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { orderToast } = useCart();
  const { authToast } = useAuth();

  useEffect(() => {
    // Load live menu & specials from Render backend
    async function loadData() {
      try {
        const [menuData, specialsData] = await Promise.all([
          fetchFullMenu(),
          fetchSpecials()
        ]);
        if (menuData && menuData.length > 0) setMenu(menuData);
        if (specialsData && specialsData.length > 0) setSpecials(specialsData);
      } catch (err) {
        console.error('Error fetching Addis Eats backend API:', err);
      } finally {
        setLoadingMenu(false);
        setLoadingSpecials(false);
      }
    }

    loadData();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeToast = orderToast || authToast;

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {activeToast && (
        <div className="toast-notification">
          <span>{activeToast}</span>
        </div>
      )}

      {/* Navigation Bar & Top Header */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigate={scrollToSection}
      />

      {/* Hero Section */}
      <Hero 
        onExploreSpecials={() => scrollToSection('specials')}
        onExploreMenu={() => scrollToSection('menu')}
        onExploreCeremony={() => scrollToSection('buna-ceremony')}
      />

      {/* Chef Specials */}
      <SpecialsSection 
        specials={specials}
        loading={loadingSpecials}
      />

      {/* Full Banquet Menu & Filters */}
      <MenuSection 
        menu={menu}
        loading={loadingMenu}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Traditional Buna Coffee Ceremony */}
      <BunaCeremony />

      {/* Gursha & Ethiopian Hospitality Heritage */}
      <HeritageSection />

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Modals and Drawers */}
      <DishDetailModal />
      <CartDrawer />
      <ReservationModal />
      <AuthModal />

      {/* Mobile Sticky Navigation */}
      <MobileBottomNav onNavigate={scrollToSection} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
