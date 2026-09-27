# Capstone Project Brief: Addis Eats (Mesob House)
**Project Title**: Mesob House — Authentic Habesha Culinary Heritage & Digital Dining Platform  
**Author / Developer**: Callie Monsur (elso12)  
**Date**: September 2026  
**Stack**: React 19, Vite, React Router v7, Vanilla CSS Design System, React Icons  

---

## 1. The Problem Statement
Traditional Ethiopian dining is inherently communal, tactile, and ceremonial, centered around shared *Mesobs* (woven straw dining tables), slow-simmered *Wats*, hand-poured *Tej*, and the sacred daily *Buna* coffee ritual. However, existing modern food delivery and restaurant booking platforms fail this rich culinary heritage:
1. **Lack of Communal & Banquet Customization**: Standard apps treat dishes as single-serve portions without accommodating traditional multi-person Mesob platters or communal Gursha sharing.
2. **Dietary & Allergen Ambiguity**: Ethiopian Orthodox fasting (*Tsom*) necessitates strict vegan food preparation, while celiac diners require certified 100% stone-ground Teff injera rather than cost-cutting wheat-blended substitutes. Current digital menus lack granular verification.
3. **Disconnected Cultural Experience**: Dining at an Ethiopian restaurant is a sensory ritual. Traditional platforms omit cultural timing (such as the 4:00 PM daily coffee bean roasting and frankincense ceremony) and offer no visibility into slow-simmering stew preparation times.

---

## 2. The Target Users & Personas
- **Primary Persona: Bethlehem & The Family / Group Banquet (Communal Diners)**  
  *Context*: Booking weekend family lunches or corporate dinners. Needs to reserve a traditional hand-woven Mesob circle, customize large mixed platters (*Beyaynetu* and *Doro Wat*), and specify seating preferences.
- **Secondary Persona: Dawit the Fasting / Health Conscious Diner (Strict Vegan & Celiac)**  
  *Context*: Observes Ethiopian Orthodox fasting periods or requires gluten-free meals. Needs instant category filtering for 100% plant-based *Tsom* platters, verified unadulterated Teff grain injera, and transparent berbere spice scales.
- **Tertiary Persona: Cultural Explorer & Diaspora Visitor (Tourists & Foodies)**  
  *Context*: Visiting Addis Ababa or exploring Habesha gastronomy for the first time. Seeks guidance on *Gursha* etiquette, live updates on the daily Buna ceremony, and seamless door-to-door delivery across Addis Ababa.

---

## 3. Five Primary Screens & Data Models

### Screen 1: Home / Cultural Landing (`/`)
- **Purpose**: Immersive welcome highlighting authentic culinary heritage, chef daily specials, and Buna ceremony schedules.
- **Data Model**:
  - `HeroBanner`: `{ title, amharicTitle, subtitle, ctaLinks[] }`
  - `ChefSpecials[]`: `Array<{ id, title, priceETB, badge, image, description }>`
  - `BunaCeremony`: `{ scheduleTime, steps[], roastType, significance }`
  - `GurshaEtiquette[]`: `Array<{ ruleNumber, title, description }>`

### Screen 2: Interactive Banquet Menu (`/menu`)
- **Purpose**: Searchable, categorizable catalog of authentic dishes with real-time category filtering and dietary badges.
- **Data Model**:
  - `Categories[]`: `Array<{ id, label, amharic, icon }>` (Wats, Tibs, Kitfo, Tsom/Vegan, Drinks)
  - `Dishes[]`: `Array<{ id, slug, title, amharic, category, priceETB, spiceLevel, isFasting, isGlutenFree, image, description }>`
  - `FilterState`: `{ activeCategory: string, searchQuery: string, fastingOnly: boolean }`

### Screen 3: Dish Detail & Ingredient Customizer (`/dish/:id`)
- **Purpose**: Granular customization screen for individual or communal dishes before adding to the banquet bag.
- **Data Model**:
  - `DishDetail`: Full dish schema with extended `ingredients[]` array and cultural background notes.
  - `CustomizerState`: `{ spiceChoice: 'Mild' | 'Medium' | 'Habesha Fire', injeraType: '100% Pure Teff' | 'Traditional Blend', orderNotes: string, quantity: number }`

### Screen 4: Cart & Dining Mode Checkout (`/checkout`)
- **Purpose**: Multi-mode fulfillment engine calculating subtotals, delivery fees, and capturing customer contact and dining specifications.
- **Data Model**:
  - `CartItems[]`: `Array<{ dishId, title, priceETB, quantity, selectedSpice, selectedInjera, lineTotal }>`
  - `DiningMode`: `'dine-in' | 'delivery' | 'pickup'`
  - `OrderCalculation`: `{ subtotalETB, deliveryFeeETB, taxIncludedETB, totalETB }`
  - `CustomerProfile`: `{ fullName, phone, addressOrTableNumber, paymentMethod }`

### Screen 5: Live Order & Mesob Stepper Tracker (`/tracker` & `/tracker/:orderId`)
- **Purpose**: Real-time status lookup visualizing the step-by-step preparation and courier dispatch of an order.
- **Data Model**:
  - `OrderRecord`: `{ orderId, placedAt, customerName, diningMode, totalETB, etaMinutes, currentStepIndex: 1..5 }`
  - `StatusSteps[]`: `[ 'Order Received', 'Clay Pot Simmering', 'Fresh Teff Injera Rolling', 'Courier Dispatch', 'Delivered at Mesob' ]`

---

## 4. Route Map Architecture
```text
           [ App Root (<Layout />) ]
                      │
   ┌──────────┬───────┴───────┬───────────┬──────────────┐
   │          │               │           │              │
   ▼          ▼               ▼           ▼              ▼
[/]        [/menu]      [/dish/:id]   [/checkout]   [/tracker/:id?]
Home       Banquet      Ingredient    Cart & Dining  Live Status
Landing    Catalog      Customizer    Mode Dispatch  Stepper
```

---

## 5. Verification & Failure Checks
- **Empty States**: Both `/menu` (unmatched search queries) and `/checkout` (empty bag) render friendly recovery callouts with quick-links.
- **Defensive Routing**: Dynamic route `/dish/:id` safely handles invalid or missing IDs by rendering a 404 Dish Not Found card with a return button.
- **Keyboard & Screen Contrast**: Full `:focus-visible` focus ring management across navigation links, interactive tab filters, and checkout buttons.
