<div align="center">

  <h1>🍲 MESOB HOUSE (የሐበሻ ቤት)</h1>
  <p><strong>Authentic Habesha Culinary Heritage & Digital Dining Web Application</strong></p>

  <p>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Zustand-5.x-764ABC?style=for-the-badge" alt="Zustand 5" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Zod-3.x-3068B7?style=for-the-badge" alt="Zod 3" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/CSS3-Vanilla_Design-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="Vanilla CSS" /></a>
    <a href="https://www.figma.com/community/file/1679526791160944664/habesha-restaurant"><img src="https://img.shields.io/badge/Figma-Habesha_Restaurant-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma Design" /></a>
  </p>

  <p>
    <i>Experience slow-simmered wats, 100% stone-ground teff injera, prime kitfo, traditional Buna coffee ceremony, and communal Gursha dining.</i>
  </p>

  <br />

  <a href="https://www.figma.com/community/file/1679526791160944664/habesha-restaurant" target="_blank">
    <img src="https://s3-alpha.figma.com/hub/file/2397235313364318155/43a7669f-5c3c-4721-b852-a83279d39985-cover.png" alt="Habesha Restaurant Figma Design Cover" style="max-width: 100%; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);" />
  </a>
  <p><small>🎨 Design System Concept: <a href="https://www.figma.com/community/file/1679526791160944664/habesha-restaurant" target="_blank"><strong>Habesha-Restaurant on Figma Community</strong></a> by <strong>Eyasu Nigussie</strong></small></p>

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

- **UI/UX Design System Concept**: [Habesha-Restaurant on Figma Community](https://www.figma.com/community/file/1679526791160944664/habesha-restaurant) by **Eyasu Nigussie**.
- **Application Code & Implementation**: © 2026 **Mesob House (Addis Eats)**. Prepared with warmth for authentic Habesha culinary heritage and communal love.

---

## 🌳 Annotated Component Tree & Ownership

The application architecture follows a unidirectional data flow with dedicated component ownership:

```text
[App] (Root Controller: Global theme, fallback data hydration, master layout)
 ├── [ErrorBoundary] (Catches unhandled render failures; presents graceful recovery UI)
 ├── [AuthProvider] (Encapsulates user session, authentication modals, and notification toasts)
 ├── [CartProvider] (Encapsulates persistent shopping bag, dining mode, and checkout modals)
 │    │
 │    ├── [Header] (Owns: Mobile navigation toggle, search bar query forwarding)
 │    │    ├── [Logo] (Brand mark & cultural subtitle)
 │    │    ├── [SearchInput] (Controlled query input with instant debounce)
 │    │    ├── [CartTriggerBadge] (Reads: totalItems from useCart; triggers CartDrawer)
 │    │    └── [AuthTriggerButton] (Reads: currentUser from useAuth; triggers AuthModal)
 │    │
 │    ├── [Hero] (Presentational: Cultural banquet introduction, primary CTAs)
 │    │    ├── [CTAButtons] (Triggers: scroll to #menu, open ReservationModal)
 │    │    └── [HeroImageWithFallback] (Automatic fallback to CDN if local asset fails)
 │    │
 │    ├── [SpecialsSection] (Owns: Featured Chef banquet highlights and daily discount badges)
 │    │    └── [SpecialCard] (Receives: dish data; triggers instant cart addition)
 │    │
 │    ├── [MenuSection] (Owns: activeCategory filter, query matching, active modal selection)
 │    │    ├── [CategoryFilterTabs] (Toggles between Wats, Tibs, Kitfo, Tsom/Vegan, Drinks)
 │    │    └── [DishGrid] (Renders responsive 3-column banquet grid)
 │    │         └── [DishCard] (Owns: hover card animation; receives: dish item; passes onSelect)
 │    │
 │    ├── [BunaCeremony] (Presentational: 4:00 PM daily Habesha coffee roasting & ritual schedule)
 │    ├── [HeritageSection] (Educational: Traditional Gursha communal feeding etiquette)
 │    ├── [ReviewsSection] (Owns: Review submission form, 5-star interactive rating picker)
 │    ├── [FaqSection] (Owns: Searchable FAQ accordion expand/collapse state)
 │    ├── [ContactSection] (Owns: Direct guest inquiry form state and feedback toasts)
 │    ├── [NewsletterSection] (Owns: VIP 15% discount voucher email subscription state)
 │    ├── [Footer] (Presentational: Operating hours, social links, legal disclaimers)
 │    │
 │    └── [Modals & Drawers Layer] (Portal/Lazy-Loaded Floating UI)
 │         ├── [DishDetailModal] (Owns: Spice level selector, quantity stepper, custom notes)
 │         ├── [CartDrawer] (Owns: Dining mode switch [Dine-In, Delivery, Pickup], checkout submission)
 │         ├── [ReservationModal] (Owns: Table booking engine with Zod schema validation)
 │         ├── [OrderTrackerModal] (Owns: Order ID search, 5-step preparation status stepper)
 │         ├── [AuthModal] (Owns: Tab switch [Sign In / Sign Up], credential form validation)
 │         ├── [LegalModal] (Owns: Tab switch [Privacy Policy, Dining Terms, Allergen Sheet])
 │         └── [CookieConsent] (Owns: LocalStorage cookie preference memory)
```

---

## 📋 State-Placement Architecture Table

| State Variable | Data Type | Owning Component / Store | Passed Down To (Consumers) | Mutators / Triggers |
| :--- | :--- | :--- | :--- | :--- |
| `cart` | `Array<CartItem>` | `useCartStore` (Zustand + `localStorage`) | `CartDrawer`, `Header`, `MobileBottomNav` | `addToCart(dish, qty)`, `removeFromCart(id)`, `updateQuantity(id, qty)`, `clearCart()` |
| `isCartOpen` | `Boolean` (`false`) | `useCartStore` | `Header`, `CartDrawer` | `openCart()`, `closeCart()`, `toggleCart()` |
| `diningMode` | `'dine-in' \| 'delivery' \| 'pickup'` | `useCartStore` | `CartDrawer`, Checkout summary | `setDiningMode(mode)` |
| `user` | `UserObject \| null` | `useAuthStore` (Zustand + `localStorage`) | `Header`, `AuthModal`, `ReservationModal` | `login(credentials)`, `signup(data)`, `logout()` |
| `isAuthOpen` | `Boolean` (`false`) | `useAuthStore` | `Header`, `AuthModal` | `openAuth()`, `closeAuth()` |
| `activeCategory` | `String` (`'all'`) | `MenuSection` | `CategoryFilterTabs`, Filtered menu grid | `setActiveCategory(slug)` |
| `searchQuery` | `String` (`''`) | `MainApp` / `MenuSection` | `Header`, `MenuSection` | `setSearchQuery(e.target.value)` |
| `selectedDish` | `DishObject \| null` | `MainApp` | `DishDetailModal` | `setSelectedDish(dish)`, `closeModal()` |
| `isReservationOpen` | `Boolean` (`false`) | `useCartStore` | `Hero`, `Header`, `ReservationModal` | `openReservation()`, `closeReservation()` |
| `isTrackerOpen` | `Boolean` (`false`) | `useCartStore` | `Header`, `OrderTrackerModal` | `openTracker()`, `closeTracker()` |
| `trackedOrder` | `OrderRecord \| null` | `useCartStore` | `OrderTrackerModal` | `lookupOrder(orderId)` |

---

## 🛡️ Six Failure Checks & Accessibility Audits (Pass Report)

All 6 critical failure scenarios have been implemented with defensive programming and passed:

1. **Failure Check 1: Zero Search Results & Empty Filter Handling**
   - *Test*: Searching for non-existent items (e.g. `"xyz999"`).
   - *Expected & Actual*: UI does not collapse or show a broken grid; renders an authentic empty-state illustration (`🍽️ No culinary delicacies found matching your search`) with a one-click `"Reset Filters"` button.
   - *Result*: **PASS**.

2. **Failure Check 2: Empty Shopping Cart State**
   - *Test*: Opening cart drawer with 0 items.
   - *Expected & Actual*: Checkout button is disabled. Displays friendly message `"Your mesob is waiting to be filled"` and a primary CTA `"Explore Banquet Menu"` that scrolls directly to the menu.
   - *Result*: **PASS**.

3. **Failure Check 3: Network & API Server Failure**
   - *Test*: Simulating API downtime or blocking requests to `addis-eats-backend.onrender.com`.
   - *Expected & Actual*: `api.js` catches errors silently and falls back to `NORMALIZED_FALLBACK_MENU` and `NORMALIZED_FALLBACK_SPECIALS`. The user experiences zero interruption or blank screens.
   - *Result*: **PASS**.

4. **Failure Check 4: Form Validation & Malformed Input Handling**
   - *Test*: Submitting empty reservation, login, or invalid phone numbers.
   - *Expected & Actual*: Integrated **Zod** schemas and **React Hook Form** stop submission and display inline red error messages with ARIA live alerts (e.g., `"Please provide a valid 10-digit phone number"`).
   - *Result*: **PASS**.

5. **Failure Check 5: Missing / Broken Media Fallbacks**
   - *Test*: Passing an unresolvable image URL.
   - *Expected & Actual*: `onError` handlers on images dynamically substitute high-resolution fallback Ethiopian food photography (`/hero-cover.png` or Wikipedia/Unsplash food CDN), preventing broken image icons.
   - *Result*: **PASS**.

6. **Failure Check 6: Runtime Crash Isolation (Error Boundary)**
   - *Test*: Uncaught JavaScript exceptions inside deeply nested components.
   - *Expected & Actual*: `<ErrorBoundary>` wraps the app tree, preventing a white screen of death, and offers a `"Reload Experience"` button.
   - *Result*: **PASS**.

### Accessibility Passes
- **Keyboard Navigation Pass**:
  - All modals and drawers (`CartDrawer`, `ReservationModal`, `AuthModal`) support `Escape` key close.
  - Interactive elements have visible focus rings (`:focus-visible`).
  - Full tab traversal order flows logically from Header through Menu to Footer.
  - *Result*: **PASS**.
- **Greyscale High-Contrast Pass**:
  - Tested with OS greyscale color filter enabled (`Windows + Ctrl + C`).
  - Text, buttons, dietary badges (e.g., **Fasting / Tsom**, **Spicy 🌶️**), and spice indicators retain strong contrast ratios exceeding WCAG AA standards (4.5:1).
  - *Result*: **PASS**.

---

## 🗺️ Capstone Project Brief & Route Architecture

- **Project Title**: **Mesob House — Addis Eats Digital Dining Platform**
- **The Problem**: Traditional Ethiopian restaurant experiences suffer from lack of digitized communal table reservations, unclear dietary/allergen disclosures (such as 100% pure Teff vs. blended wheat injera for celiac diners), and no live status tracking for slow-simmered stews.
- **The Users**:
  1. *Communal & Banquet Diners*: Groups booking traditional hand-woven Mesob seating for shared Gursha dining.
  2. *Dietary-Conscious Customers*: Orthodox fasting (Tsom) vegans and gluten-sensitive guests seeking authentic, transparent ingredient manifests.
  3. *Foodies & Diaspora Visitors*: Customers wanting cultural discovery (Buna ceremony timings and authentic Habesha hospitality).
- **Five Primary Screens & Data Models**:
  1. **`/` (Home / Landing)**: `HeroBanner`, `FeaturedSpecials[]`, `BunaCeremonySchedule`, `PressReviews[]`.
  2. **`/menu` (Banquet Menu)**: `CategoryList[]`, `Dishes[]` (id, title, amharicTitle, priceETB, spiceLevel, isFasting, image).
  3. **`/dish/:id` (Dish Detail & Customizer)**: `dishItem`, `ingredients[]`, `spiceLevelPicker`, `teffTypeSelector`, `orderNotes`.
  4. **`/checkout` (Cart & Dining Mode Dispatcher)**: `cartItems[]`, `diningMode` (Dine-in / Delivery / Takeaway), `deliveryFee`, `totalETB`, `customerInfo`.
  5. **`/tracker` (Live Order & Table Tracker)**: `orderId`, `statusSteps` (Received -> Simmering -> Injera Packing -> Out for Delivery -> Delivered), `etaMinutes`.
