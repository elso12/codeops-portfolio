# Addis Eats & MedAddis Capstone Kickoff (Day 10 · Module 3 · Day 35)

> **React Mini-Project & Capstone Kickoff**  
> **Course:** CodeOps Full Stack Software Development · IBT College Canada  
> **Instructor / Curriculum Design:** Mehran Dasgar  

---

## 🌟 Executive Summary

This repository delivers the **Day 35 Mini-Project ("Addis Eats")** and the **Capstone Kickoff ("MedAddis Clinic & Pharmacy")**, synthesizing the entire two weeks of React foundations into two production-grade, hardened applications:

1. **Addis Eats (`./`):** A food-ordering web application for Addis Ababa featuring authentic Ethiopian gastronomy, category filtering synchronized with the browser URL query string, dynamic dish details, a persistent cart with ETB running totals, a guarded checkout with pure phone/subcity validation, `React.lazy` chunk-splitting, `ErrorBoundary` fault containment, and an interactive **Diagnostic Verification HUD**.
2. **MedAddis Capstone Scaffold (`./capstone`):** A healthcare outpatient clinic and pharmacy dispensing frontend with a one-page brief, user persona (Rahel Tadesse, RPh), route map, and running Vite scaffold across five reachable screens (`/`, `/patients`, `/patients/:id`, `/prescriptions`, `/dispense`).

---

## 🏗️ Folder Structure (Grouped by Feature)

```text
day10/
├── BRIEF.md                 # Full requirements, rubric, component tree, and check-yourself answers
├── README.md                # Comprehensive project documentation and test runbook
├── package.json             # Root scripts and dependencies (React 19, React Router DOM 7, Vite 6)
├── vite.config.js           # Vite dev and build pipeline
├── index.html               # Main entry HTML with Google Fonts & #modal-root portal container
├── public/
│   └── menu.json            # 12 authentic Ethiopian dishes with metadata, allergens, prep times
├── src/
│   ├── api/
│   │   ├── menu.js          # Menu data fetcher with AbortSignal & diagnostic throttling/fault injection
│   │   └── orders.js        # Order submission and receipt generation service
│   ├── hooks/
│   │   ├── useFetch.js      # Generic data fetching hook with AbortController cleanup (Day 29/30)
│   │   └── useDebounce.js   # Live search debouncing hook (Day 30)
│   ├── ui/                  # Strictly generic primitives without business logic (Section 2)
│   │   ├── Button.jsx       # Accessible button (primary, secondary, danger, outline, loading)
│   │   ├── Modal.jsx        # Dialog rendered via createPortal into #modal-root with escape trap
│   │   ├── Spinner.jsx      # Animated SVG loading spinner with aria-status
│   │   ├── Badge.jsx        # Status and category badges (amber, berbere, success, neutral)
│   │   └── Alert.jsx        # Accessible alert banner (error, success, info)
│   ├── cart/
│   │   ├── CartContext.jsx  # Cart store persisted to localStorage with ETB calculations
│   │   ├── CartBadge.jsx    # Header cart icon with animated count badge and subtotal
│   │   └── CartPage.jsx     # Full cart view with quantity steppers and empty state
│   ├── menu/
│   │   ├── Menu.jsx         # Menu view orchestrating search, URL category params, and fetch
│   │   ├── CategoryBar.jsx  # Category selector chips (All, Main, Vegetarian, Breakfast, Beverages)
│   │   ├── DishList.jsx     # Responsive grid of dishes or friendly empty note
│   │   ├── DishCard.jsx     # Individual card with emoji media, spice indicators, and quick add
│   │   └── DishDetail.jsx   # Dynamic route (/menu/:id) with allergen breakdown and portion stepper
│   ├── checkout/
│   │   ├── Checkout.jsx     # Lazy-loaded controlled checkout form with real-time error cues
│   │   ├── Field.jsx        # Accessible field wrapper (aria-invalid, aria-describedby)
│   │   └── validate.js      # Pure validation rules ((form) => errors) with Telebirr patterns
│   ├── auth/
│   │   ├── AuthContext.jsx  # Authentication state (user, login, logout, session persistence)
│   │   ├── RequireAuth.jsx  # Route Guard: redirects unauthenticated users to /login with state.from
│   │   └── LoginPage.jsx    # Sign-in screen with one-click demo examiner shortcuts
│   ├── orders/
│   │   └── Receipt.jsx      # Lazy-loaded order confirmation with Ethiopian dispatch ref & ETA
│   ├── components/
│   │   ├── Header.jsx       # Sticky header with nav, auth status, and Diagnostic Verification HUD
│   │   ├── Footer.jsx       # Cultural Ethiopian footer with delivery hubs (Bole, Kazanchis, etc.)
│   │   ├── Home.jsx         # Landing page with hero banner and Today's Chef Specials
│   │   ├── NotFound.jsx     # 404 route for unmatched URLs
│   │   └── RouteSkeleton.jsx# Shimmer placeholder rendered during Suspense chunk downloads
│   ├── App.jsx              # Master router with nested Layout, ErrorBoundary, and Route Guards
│   ├── Layout.jsx           # Layout shell with header, main content container, and footer
│   ├── ErrorBoundary.jsx    # Production error boundary catching render crashes with reset button
│   ├── index.css            # Addis Eats Ethiopian Gourmet Dark Theme (Jakarta Sans & Playfair Display)
│   └── main.jsx             # React DOM root entry point
└── capstone/                # Capstone Subproject (Section 4)
    ├── README.md            # One-page written brief, persona, 5 screens, and route map
    ├── package.json         # Capstone dependencies and scripts
    ├── vite.config.js       # Capstone Vite configuration
    ├── index.html           # Capstone entry HTML
    └── src/
        ├── App.jsx          # Layout + 5 reachable core routes + catch-all 404
        ├── Layout.jsx       # Clinical layout with medical branding and navigation
        ├── index.css        # Clinical theme styles
        ├── main.jsx         # Entry point
        └── screens/
            ├── Dashboard.jsx        # Screen 1: Triage counts and waiting metrics (/)
            ├── PatientList.jsx      # Screen 2: Searchable patient registry (/patients)
            ├── PatientDetail.jsx    # Screen 3: Clinical chart, allergies, vitals (/patients/:id)
            ├── PrescriptionQueue.jsx# Screen 4: Real-time pharmacy queue (/prescriptions)
            ├── DispenseAudit.jsx    # Screen 5: Controlled validation form (/dispense)
            └── NotFound.jsx         # Catch-all 404 screen
```

---

## 🚀 Running the Projects Locally

### Addis Eats (Main Mini-Project)
```bash
# Navigate to the project root
cd day10

# Start development server
npm run dev

# Build production bundle (tests bundle & lazy chunk splitting)
npm run build
```

### MedAddis (Capstone Scaffold)
```bash
# Navigate to the capstone directory
cd day10/capstone

# Start capstone dev server
npm run dev

# Build capstone bundle
npm run build
```

---

## 🧪 Testing the 6 Failure Paths & Accessibility

A live **Diagnostic Verification HUD** is embedded at the top of the Addis Eats application to allow examiners to test failure handling in real time:

1. **Slow 3G Latency Simulation:**
   - Click **`⏳ Throttle Slow 3G`** on the top toolbar.
   - Navigate to `/menu`.
   - *Result:* An accessible SVG spinner and loading indicator appears; zero blank screen.
2. **Network / Server Gateway Failure:**
   - Click **`💥 Simulate Fetch Error`** on the top toolbar.
   - Navigate to `/menu` or refresh.
   - *Result:* An `<Alert variant="error">` renders with the message `503 Service Unavailable: Addis Eats Central Kitchen Gateway Timeout` alongside an interactive **Retry Fetch** button.
3. **Empty Category / Search Miss:**
   - On the menu screen, type a nonsense term into the search box (e.g. `xyz123`).
   - *Result:* An empty state card with an Ethiopian grain icon displays `"No Dishes Found"` with a button to `"Show All Dishes"`.
4. **Nonsense URL (404 Routing):**
   - Navigate directly to `http://localhost:5173/bad-route-test`.
   - *Result:* The custom Ethiopian 404 screen renders with links to return home or browse the menu.
5. **Guarded Route & Return Redirect:**
   - Ensure you are signed out (click "Sign Out" in the header if needed).
   - Click on "Checkout" or navigate to `/checkout`.
   - *Result:* Instantly redirected to `/login` with `from: /checkout` stored in location state.
   - Click **"Instant Sign-In as Abebe Bikila"**.
   - *Result:* Automatically returned straight to `/checkout`.
6. **Error Boundary Render Crash Containment:**
   - Click **`⚡ Test Error Boundary`** on the diagnostic toolbar.
   - *Result:* The screen's error boundary intercepts the crash, displaying an isolated recovery UI and a **Try Again / Reset Component** button without crashing the overall layout or losing navigation.
7. **Greyscale Accessibility Verification:**
   - Click **`👁️ Greyscale Test`** on the diagnostic toolbar.
   - *Result:* The entire interface applies a 100% greyscale filter, validating that buttons, status badges, and typography remain legible through contrast and typography rather than color alone.
