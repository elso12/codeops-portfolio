<div align="center">

  <h1>🍲 MESOB HOUSE (የሐበሻ ቤት)</h1>
  <p><strong>Authentic Habesha Culinary Heritage & Digital Dining Web Application</strong></p>

  <p>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Zustand-5.x-764ABC?style=for-the-badge" alt="Zustand 5" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Zod-3.x-3068B7?style=for-the-badge" alt="Zod 3" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/CSS3-Vanilla_Design-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="Vanilla CSS" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/SEO-Schema.org_JSON--LD-00C853?style=for-the-badge" alt="Schema.org JSON-LD" /></a>
  </p>

  <p>
    <i>Experience slow-simmered wats, 100% stone-ground teff injera, prime kitfo, traditional Buna coffee ceremony, and communal Gursha dining.</i>
  </p>

</div>

---

## 📖 Overview

**Mesob House (Addis Eats)** is a production-ready, full-featured web application designed for a premier Ethiopian & Eritrean restaurant. Built with **React 19**, **Vite 6**, **Zustand**, and **React Hook Form + Zod**, the application merges authentic Habesha cultural heritage with modern digital dining features: real-time banquet ordering, table reservations, live order status tracking, community review publishing, and dietary/allergen disclosures.

---

## ✨ Features Showcase

### 🍲 1. Interactive Banquet Menu & Smart Filters
- **Categorized Banquet Selection**: Browse traditional Wats (Doro Wat, Misir Wat), Pan-Charred Tibs, Kitfo Highland Delicacies, Fasting/Vegan (Tsom) platters, Wild Honey Tej, and Spiced Jebena Coffee.
- **Search & Sort**: Real-time instant search bar in header, mobile drawer, and menu section.
- **Dish Detail Modal**: Inspect ingredients, spice level indicators (🌶️), dietary badges, and customize order notes.

### 🛒 2. Shopping Cart & Checkout Engine
- **Dining Options**:
  | Dining Mode | Description | Delivery Fee |
  | :--- | :--- | :--- |
  | 🏠 **Dine-In Table** | Reserve a traditional hand-woven mesob circle | ETB 0 |
  | 🚚 **Addis Delivery** | Express door delivery across Addis Ababa | ETB 100 |
  | ☕ **Takeaway Pickup** | Fast pickup at our Bole Medhanialem hearth | ETB 0 |

- **Dynamic Calculations**: Automated subtotal, ETB currency formatting, delivery fees, and tax inclusions.
- **Persistent Cart & State**: Powered by Zustand stores synced with `localStorage`.

### ☕ 3. Cultural Highlights & Buna Ceremony
- **Sacred Buna Ceremony**: Visual story of daily 4:00 PM green coffee bean roasting, mortar grinding, clay *Jebena* brewing, frankincense, and popcorn.
- **Gursha Heritage Section**: Educational guide on traditional Habesha communal dining etiquette.

### 🚚 4. Live Order Status Tracker
- **Real-Time Visual Stepper**: Track order status from *Order Received ➔ Slow-Simmering Wat ➔ Injera Packing ➔ Courier Delivery ➔ Delivered with Love*.
- **Order Lookup**: Search by unique Order Reference ID (e.g., `MH-892104` or `MESOB-8921`).

### ⭐ 5. Guest Reviews & Press Highlights
- **Overall Rating Score**: 4.9/5 star metric card based on 1,480+ guest reviews.
- **Press Features**: Highlights from Food & Wine, NYT, and Eater Guide 2026.
- **Submit a Review Modal**: Interactive 5-star rating picker with instant community publishing.

### 📅 6. Mesob Table Reservation
- **Booking Engine**: Reserve traditional hand-woven mesob tables with guest count selector, date/time pickers, seating preferences, and special dining requests.

### 📍 7. Location & Interactive Contact Hub
- **Directions & Operating Hours**: Direct Google Maps link and animated hearth location preview pin.
- **Interactive Contact Form**: Direct guest message submission with live feedback toasts.

### ❓ 8. FAQ Accordion & Teff Guarantee
- **Searchable FAQs**: Questions on 100% gluten-free pure teff fermentation, vegan fasting traditions, and Buna ceremony schedules.

### 🎁 9. VIP Dining Club Newsletter
- **Promotional Voucher**: Claim a 15% discount code (`MESOB15 VIP`) for first orders.

### 🛡️ 10. Privacy, Legal & Cookie Consent
- **Cookie Banner**: Bottom consent drawer with `localStorage` preference memory.
- **Legal Modals**: Tabbed views for Privacy Policy, Terms of Dining, and Allergen disclosures.

---

## 🛠️ Architecture & Tech Stack

```text
  React 19 Core ───► Vite 6 Build Engine ───► Zustand 5 Global State
        │                     │                        │
        ▼                     ▼                        ▼
React Hook Form + Zod    Vanilla CSS Tokens      Oxlint Linter
```

- **Frontend Framework**: React 19 (Functional Components, Custom Hooks, Context API)
- **Build Tooling**: Vite 6 (Lightning fast HMR & production bundler)
- **State Management**: Zustand 5 with persistent state middleware (`useCartStore`, `useAuthStore`)
- **Form Validation**: React Hook Form 7 integrated with Zod 3 schemas (`validationSchemas.js`)
- **Styling**: Modern Vanilla CSS3 (Custom design tokens, glassmorphism, responsive CSS Grid & Flexbox)
- **Icons**: `react-icons` (`fi`, `gi`, `fa` icon sets)
- **Code Quality**: Oxlint static analyzer (`npm run lint`)
- **SEO & Structured Data**: Schema.org `Restaurant` JSON-LD & OpenGraph Meta Tags

---

## 📁 Directory Structure

```text
day06/
├── public/                     # Static assets & dish photos
│   └── dishes/                 # High-resolution local dish imagery
├── src/
│   ├── assets/                 # Graphics & static assets
│   ├── components/
│   │   ├── AuthModal.jsx       # Sign In / Sign Up dialog
│   │   ├── BunaCeremony.jsx    # Traditional coffee ceremony section
│   │   ├── CartDrawer.jsx      # Shopping cart & checkout drawer
│   │   ├── ContactSection.jsx  # Location, map preview & contact form
│   │   ├── CookieConsent.jsx   # Privacy cookie consent banner
│   │   ├── DishCard.jsx        # Individual menu item card
│   │   ├── DishDetailModal.jsx # Detailed item viewer modal
│   │   ├── ErrorBoundary.jsx   # Application error boundary
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
│   │   └── SpecialsSection.jsx   # Chef's daily specials grid
│   ├── context/
│   │   ├── AuthContext.jsx     # Auth state context provider wrapper
│   │   └── CartContext.jsx     # Cart state context provider wrapper
│   ├── services/
│   │   └── api.js              # Menu API fetching & local fallback dataset
│   ├── store/
│   │   ├── useAuthStore.js     # Zustand store for user session state
│   │   └── useCartStore.js     # Zustand store for cart, modals & tracker
│   ├── utils/
│   │   └── validationSchemas.js # Zod validation schemas for forms
│   ├── App.css                 # Comprehensive design system & component styles
│   ├── App.jsx                 # Application root layout integration
│   ├── index.css               # Global CSS variables & resets
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
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Development Server
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Code Quality & Linting
Run the fast Oxlint linter to verify code quality:
```bash
npm run lint
```

### 4. Production Build
Compile and bundle the production build:
```bash
npm run build
```

### 5. Preview Production Build
Locally test the compiled production build:
```bash
npm run preview
```

---

## 📄 License & Attribution

© 2026 **Mesob House (Addis Eats)**. Prepared with warmth for authentic Habesha culinary heritage and communal love.
