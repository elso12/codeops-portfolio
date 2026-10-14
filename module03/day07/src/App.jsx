import React, { useState, useEffect, lazy, Suspense } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchFullMenu, fetchSpecials, NORMALIZED_FALLBACK_MENU, NORMALIZED_FALLBACK_SPECIALS } from './services/api';
import ErrorBoundary from './components/ErrorBoundary';

import Header from './components/Header';
import Hero from './components/Hero';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';

import SpecialsSection from './components/SpecialsSection';
const MenuSection = lazy(() => import('./components/MenuSection'));
const BunaCeremony = lazy(() => import('./components/BunaCeremony'));
const HeritageSection = lazy(() => import('./components/HeritageSection'));
const ReviewsSection = lazy(() => import('./components/ReviewsSection'));
const FaqSection = lazy(() => import('./components/FaqSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const NewsletterSection = lazy(() => import('./components/NewsletterSection'));

// Lazy-loaded modals & drawers
const DishDetailModal = lazy(() => import('./components/DishDetailModal'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const ReservationModal = lazy(() => import('./components/ReservationModal'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const OrderTrackerModal = lazy(() => import('./components/OrderTrackerModal'));
const LegalModal = lazy(() => import('./components/LegalModal'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));

import './App.css';

// Section Loader Fallback Component
function SectionLoader() {
  return (
    <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
      <div className="dish-card skeleton-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '30px' }}>
        <div className="skeleton-line" style={{ width: '40%', margin: '0 auto 12px auto' }} />
        <div className="skeleton-line" style={{ width: '70%', margin: '0 auto 8px auto' }} />
        <div className="skeleton-line" style={{ width: '50%', margin: '0 auto' }} />
      </div>
    </div>
  );
}

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

      {/* Lazy Loaded Sections with Suspense */}
      <Suspense fallback={<SectionLoader />}>
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

        {/* Customer Reviews & Press Features */}
        <ReviewsSection />

        {/* FAQ & Teff Information */}
        <FaqSection />

        {/* Location, Contact & Interactive Form */}
        <ContactSection />

        {/* VIP Dining Club Newsletter */}
        <NewsletterSection />
      </Suspense>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Modals and Drawers with Suspense */}
      <Suspense fallback={null}>
        <DishDetailModal />
        <CartDrawer />
        <ReservationModal />
        <AuthModal />
        <OrderTrackerModal />
        <LegalModal />
        <CookieConsent />
      </Suspense>

      {/* Mobile Sticky Navigation */}
      <MobileBottomNav onNavigate={scrollToSection} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
