<div align="center">

  <h1>🍲 MESOB HOUSE (የሐበሻ ቤት)</h1>
  <p><strong>Authentic Habesha Culinary Heritage & Digital Dining Web Application</strong></p>

  <p>
    <a href="#-features"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" /></a>
    <a href="#-features"><img src="https://img.shields.io/badge/CSS3-Vanilla_Design-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="Vanilla CSS" /></a>
    <a href="#-seo--accessibility"><img src="https://img.shields.io/badge/SEO-Schema.org_JSON--LD-00C853?style=for-the-badge" alt="Schema.org JSON-LD" /></a>
  </p>

  <p>
    <i>Experience slow-simmered wats, 100% stone-ground teff injera, prime kitfo, traditional Buna coffee ceremony, and communal Gursha dining.</i>
  </p>

</div>

---

## 📖 Overview

**Mesob House (Addis Eats)** is a production-ready, full-featured web application designed for a premier Ethiopian & Eritrean restaurant. Built with **React 18** and **Vite**, the site presents an immersive cultural journey combined with modern e-commerce functionalities: live banquet ordering, table reservations, live order status tracking, guest review submissions, and dietary/allergen disclosures.

---

## ✨ Features Showcase

### 🍲 1. Interactive Banquet Menu & Filters
- **Categorized Banquet Selection**: Browse traditional Wats (Doro Wat, Misir Wat), Pan-Charred Tibs, Kitfo Highland delicacies, Fasting/Vegan (Tsom) platters, Wild Honey Tej, and desserts.
- **Search & Filter**: Real-time instant search bar in header and mobile drawer.
- **Dish Detail Modal**: Inspect ingredients, spice level indicators (🌶️), dietary tags, and customize order notes.

### 🛒 2. Shopping Cart & Order Checkout
- **Dining Mode Selector**: Switch between Dine-In, Pickup, and Express Courier Delivery.
- **Dynamic Calculation**: Automated subtotal, ETB currency conversion, delivery fees, and tips selector.
- **Persistent Cart**: Automatically synced with `localStorage`.

### ☕ 3. Cultural Highlights & Buna Ceremony
- **Sacred Buna Ceremony Section**: Visual story of daily 4:00 PM green coffee bean roasting, mortar grinding, clay jebena brewing, frankincense, and popcorn.
- **Gursha Heritage Section**: Educational guide on traditional Habesha communal dining etiquette.

### 🚚 4. Live Order Status Tracker
- **Real-Time Visual Stepper**: Track order status from *Order Received ➔ Slow-Simmering ➔ Injera Packing ➔ Courier Delivery ➔ Delivered*.
- **Order Lookup**: Search by Order ID (e.g., `MESOB-8921` or `MESOB-7704`).

### ⭐ 5. Guest Reviews & Press Features
- **Overall Rating Score**: 4.9/5 star metric card based on 1,480+ guest reviews.
- **Press Highlights**: Featured reviews from Food & Wine, NYT, and Eater Guide.
- **Submit a Review Modal**: Interactive 5-star rating selector with instant community publishing.

### 📅 6. Mesob Table Reservation
- **Booking Engine**: Reserve traditional hand-woven mesob tables with guest count selector, date/time pickers, and special dining requests.

### 📍 7. Location & Interactive Contact Hub
- **Directions & Operating Hours**: Direct Google Maps link and location pin animation.
- **Interactive Contact Form**: Direct guest message submission with live feedback toasts.

### ❓ 8. FAQ Accordion & Teff Guarantee
- **Searchable FAQs**: Questions on 100% gluten-free pure teff fermentation, vegan fasting traditions, and Buna ceremony schedules.

### 🎁 9. VIP Dining Club Newsletter
- **Promotional Voucher**: Claim a 15% discount code (`MESOB15 VIP`) for first orders.

### 🛡️ 10. Privacy, Legal & Cookie Consent
- **Cookie Banner**: Bottom consent drawer with `localStorage` preference memory.
- **Legal Modals**: Tabbed views for Privacy Policy, Terms of Dining, and Allergen disclosures.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18 (Functional Components, Custom Hooks, Context API)
- **Build Tooling**: Vite 6 (Lightning fast HMR & production bundler)
- **Styling**: Modern Vanilla CSS3 (Custom design tokens, glassmorphism, responsive CSS grid/flexbox)
- **Icons**: `react-icons` (`fi`, `gi` icon sets)
- **SEO & Structured Data**: Schema.org `Restaurant` JSON-LD & OpenGraph Meta Tags

---

## 📁 Directory Structure

```text
day06/
├── public/                     # Static assets & favicons
├── src/
│   ├── assets/                 # Imagery & graphics
│   ├── components/
│   │   ├── AuthModal.jsx       # Sign In / Sign Up dialog
│   │   ├── BunaCeremony.jsx    # Traditional coffee ceremony section
│   │   ├── CartDrawer.jsx      # Shopping cart & checkout drawer
│   │   ├── ContactSection.jsx  # Location, map preview & contact form
│   │   ├── CookieConsent.jsx   # Privacy cookie consent banner
│   │   ├── DishCard.jsx        # Individual menu item card
│   │   ├── DishDetailModal.jsx # Detailed item viewer modal
│   │   ├── FaqSection.jsx      # FAQ accordion with search & category tabs
│   │   ├── Footer.jsx          # Comprehensive footer with legal & social links
│   │   ├── Header.jsx          # Announcement top banner & main navbar
│   │   ├── HeritageSection.jsx # Gursha & Habesha hospitality guide
│   │   ├── Hero.jsx            # Main entrance banner & CTAs
│   │   ├── LegalModal.jsx      # Privacy, Terms & Allergen policy modal
│   │   ├── MenuSection.jsx     # Full banquet menu grid & filters
│   │   ├── MobileBottomNav.jsx # Sticky mobile bottom navigation bar
│   │   ├── NewsletterSection.jsx # VIP Dining Club 15% voucher signup
│   │   ├── OrderTrackerModal.jsx # Live order status timeline tracker
│   │   ├── ReservationModal.jsx  # Mesob table booking engine
│   │   ├── ReviewsSection.jsx    # Customer & press reviews with submit form
│   │   └── SpecialsSection.jsx   # Chef's daily specials carousel/grid
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication state
│   │   └── CartContext.jsx     # Cart, modals & global toast notifications
│   ├── services/
│   │   └── api.js              # Menu data fetching & fallback normalized datasets
│   ├── App.css                 # Comprehensive styling tokens & component styles
│   ├── App.jsx                 # Main application layout integration
│   └── main.jsx                # Application root entry point
├── index.html                  # HTML head, OpenGraph & Schema.org JSON-LD
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18.0 or higher) and **npm** installed on your system.

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Development Server
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Production Build
Bundle the optimized web application for production deployment:
```bash
npm run build
```
The output files will be generated inside the `dist/` directory.

### 4. Preview Production Build
Locally test the compiled production bundle:
```bash
npm run preview
```

---

## 📄 License & Attribution

© 2026 **Mesob House (Addis Eats)**. Prepared with warmth for authentic Habesha culinary heritage and communal love.
