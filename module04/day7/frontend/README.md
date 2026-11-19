# Campus Events Discovery Platform - Frontend

A modern, responsive university event discovery and management web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and the native **JavaScript Fetch API**. The application connects seamlessly to the existing NestJS backend REST API without external HTTP client libraries.

---

## 🚀 Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type checking)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Responsive mobile, tablet, and desktop design)
- **Data Fetching**: Native JavaScript **Fetch API** with `cache: "no-store"`
- **Architecture**: Modular service-layer pattern (`src/services/`) and strong TypeScript domain models (`src/types/`)

### Strict Constraints Adherence
- **Zero Axios**: Native JavaScript `fetch` is used for all HTTP communication.
- **Zero React Router**: Native Next.js App Router (`next/navigation`, `next/link`) handles all routing, query parameters, and dynamic segments.
- **Backend Integrity**: Connects directly to the existing NestJS backend API without modifying or recreating backend services.

---

## 📋 Features Overview

### 1. Shared Layout & Navigation
- **Responsive Navbar**: Brand title ("CAMPUS EVENTS") with calendar icon, active link highlighting (`usePathname()`), and a collapsible mobile navigation drawer.
- **Academic Portal Footer**: Quick navigation links, API connection status indicator, and university copyright metadata.
- **Unified Layout**: Centered, responsive container (`max-w-7xl`) across mobile, tablet, and desktop viewports.

### 2. Page 1 — Home / Dashboard (`/`)
- **Welcome Hero Section**: Engaging header introducing Campus Events with a direct **"Explore Events"** action button.
- **Upcoming Events Grid**: Dynamically displays upcoming events via `getUpcomingEvents()` (`GET /api/events/upcoming`).
- **Complete State Handling**:
  - Reusable spinner while loading.
  - Connection error card with **"Retry Connection"** button if backend is offline.
  - Empty state (*"No events found. Check back later!"*) with quick action links.

### 3. Page 2 — All Events Directory (`/events`)
- **Paginated Event Listings**: Fetches data from `getEvents()` (`GET /api/events`).
- **Backend Query Controls**:
  - **Category Filter**: Filter by `technology`, `career`, `sports`, `arts`, `academic`, or all.
  - **Location Filter**: Venue search input.
  - **Publication Status**: Filter by `All`, `Published Only`, or `Drafts Only`.
  - **Sorting**: Sort by `eventDate` or `title` in `asc` (earliest/A-Z) or `desc` (latest/Z-A) order.
  - *Note: Modifying any filter automatically resets pagination to page 1.*
- **Pagination Controls**: Uses `page` and `totalPages` from the backend response with Previous/Next buttons and page counts.
- **Instant Frontend-Only Title Search**: Instant, in-memory filtering by title on the currently loaded page without issuing unnecessary backend requests.
- **Filter Tags**: Active chips displaying active filter parameters with one-click clear.

### 4. Page 3 — Event Details (`/events/[id]`)
- **Dynamic Routing**: Reads `[id]` from route params via `useParams()`.
- **Comprehensive Event Display**: Category badge, publication status badge (`Published` / `Draft`), event title, formatted date & time, location/room, and full description.
- **Session Agenda Grid**: Fetches and renders all scheduled agenda sessions via `getEventSessions(id)` (`GET /api/events/:id/sessions`).
- **Graceful States**:
  - Centered Loading spinner.
  - Dedicated **"Event Not Found"** view with return link when ID is missing or invalid.
  - API error banner with retry mechanism.

### 5. Page 4 — Session Details Modal
- **Interactive Session Inspection**: Clicking **"View Session Details"** on any session card calls `getSessionById(eventId, sessionId)` (`GET /api/events/:id/sessions/:sessionId`).
- **Accessible Modal Dialog**:
  - Session title
  - **Related event title**
  - Formatted Start and End timestamps
  - Calculated session duration
  - Room / venue allocation
  - Session and Event ID reference numbers
  - Close button (`✕`), backdrop click dismiss, and footer close action.

### 6. Page 5 — Create Event Form (`/create-event`)
- **Interactive Form**:
  - `Title`: Required text input.
  - `Category`: Required select dropdown.
  - `Location`: Required venue text input.
  - `Event Date`: Required `datetime-local` input, converted to ISO 8601 string on submit.
  - `Publication Status`: Toggle for immediate publication or draft status.
  - `Description`: Required multi-line textarea.
- **Validation**: Client-side validation ensuring no required fields are blank before submission.
- **POST Submission**: Calls `createEvent()` (`POST /api/events`).
- **Navigation**: Displays success feedback, refreshes the Next.js router cache (`router.refresh()`), and automatically redirects to the new event details page (`/events/[id]`).

---

## 🛠️ Project Structure

```text
frontend/
├── .env.example                # Template for environment variables
├── .env.local                  # Local environment configuration (API URL)
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── public/                     # Static media and icons
└── src/
    ├── app/
    │   ├── globals.css         # Tailwind CSS imports and global styling
    │   ├── layout.tsx          # Root layout with Navbar and Footer
    │   ├── page.tsx            # Page 1: Home / Dashboard
    │   ├── events/
    │   │   ├── page.tsx        # Page 2: All Events Directory
    │   │   └── [id]/
    │   │       └── page.tsx    # Page 3 & 4: Event Details & Session Modal
    │   └── create-event/
    │       └── page.tsx        # Page 5: Create Event Form
    ├── components/
    │   ├── Navbar.tsx          # Responsive navigation bar with mobile menu
    │   ├── EventCard.tsx       # Reusable event card with badges & actions
    │   └── Loading.tsx         # Reusable loading spinner component
    ├── services/
    │   └── eventService.ts     # Native fetch API layer with cache: "no-store"
    └── types/
        └── event.ts            # TypeScript interfaces (Event, Session, etc.)
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm**: v9+ or v10+
- Existing NestJS Campus Events API running on `http://localhost:3000` (or `3001`).

### 1. Clone & Navigate
```bash
cd module04/day7/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Verify or create `.env.local` in the `frontend/` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

*(If your backend runs on port 3001, update the URL to `http://localhost:3001/api`).*

### 4. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your terminal) to explore the application.

### 5. Production Build & Verification
To test TypeScript compilation and build production assets:

```bash
# Type-check
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm run start
```

---

## 📡 API Service Reference

All API calls are centralized in [`src/services/eventService.ts`](src/services/eventService.ts):

| Function | Method & Endpoint | Description |
| :--- | :--- | :--- |
| `getEvents(params)` | `GET /api/events` | Paginated event list with category, location, isPublished, and sorting query parameters |
| `getUpcomingEvents()` | `GET /api/events/upcoming` | Array of upcoming events |
| `getEventById(id)` | `GET /api/events/:id` | Single event details by ID |
| `getEventSessions(id)` | `GET /api/events/:id/sessions` | All sessions belonging to a specific event |
| `getSessionById(eventId, sessionId)` | `GET /api/events/:id/sessions/:sessionId` | Specific session details within an event |
| `createEvent(event)` | `POST /api/events` | Creates and publishes a new campus event |

All network requests include `cache: "no-store"` and throw descriptive errors on `!response.ok` responses.
