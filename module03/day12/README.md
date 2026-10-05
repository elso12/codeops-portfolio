# Mesob House · Habesha Restaurant (Complete Next.js App)

Mesob House (መሶብ ሀውስ) is a premium Ethiopian and Eritrean culinary web application inspired by the Figma Community project [Habesha-Restaurant](https://www.figma.com/community/file/1679526791160944664/habesha-restaurant) by Eyasu Nigussie. Built with the Next.js App Router, it implements every screen from the design system while satisfying all Day 12 / Day 37 Layouts & Rendering Strategies requirements.

## Implemented Screens & App Routes

1. **Home Landing (`/`)**: Hero banner, culinary pillars (Communal Mesob, Berbere Spices, Jebena Buna), and chef's weekend special.
2. **Menu Experience (`/menu`)**: Nested layout with category sidebar, persistent state counter, ISR 60-second window, and Suspense streaming.
3. **Dish Detail Showcase (`/menu/[id]`)**: Pre-rendered via `generateStaticParams()` for all 6 dishes (`doro-wat`, `kitfo`, `beyaynetu`, `zilzil-tibs`, `shiro-tegabino`, `jebena-buna`) with preparation notes and sacred ingredients.
4. **Special Offers (`/offers`)**: Promotional discounts, coupon codes, and communal feast specials.
5. **Table Reservations (`/reservations`)**: Interactive mesob booking with seating styles (Traditional Mesob, Terrace, Jebena Lounge), guest count, and confirmation generator.
6. **Guest & Member Login (`/login`)**: Quick guest mobile access and Mesob Club loyalty portal.
7. **Active Cart & Checkout (`/checkout`)**: Interactive cart with quantity adjustments, extra teff add-on, 15% VAT, and dynamic server-side session resolution via `await cookies()`.

---

## Production Build Output

```bash
> day12@1.0.0 build
> next build

▲ Next.js 16.3.8 (Turbopack)
✓ Running next.config took 57ms

  Creating an optimized production build ...
✓ Compiled successfully in 9.9s
  Running TypeScript ...
  Finished TypeScript in 6ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/16) ...
  Generating static pages using 7 workers (4/16) 
  Generating static pages using 7 workers (8/16) 
  Generating static pages using 7 workers (12/16) 
✓ Generating static pages using 7 workers (16/16) in 6.0s
  Finalizing page optimization ...

Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ƒ /checkout
├ ○ /login
├ ○ /menu                      1h      1y
├   /menu/[id]
│ ├ ● /menu/doro-wat
│ ├ ● /menu/kitfo
│ ├ ● /menu/beyaynetu
│ └ ● [+3 more paths]
├ ○ /offers
├ ○ /register
└ ○ /reservations


○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## Verification & Self-Check

| Question | Verification Result |
| :--- | :--- |
| **Does the build output mark each route the way STRATEGY.md says?** | Yes: `/`, `/offers`, `/reservations`, `/login`, `/register`, `/cart` are `○`, `/menu` is `○ (1h revalidate)`, `/menu/[id]` is `● (SSG)`, and `/checkout` is `ƒ (Dynamic)`. |
| **Does a counter in the menu layout keep its value when you open a dish?** | Yes: `MenuCounter` in `app/menu/layout.js` persists during client-side navigation into any `/menu/[id]`. |
| **Did `generateStaticParams` produce one HTML file per dish?** | Yes: 6 static dish pages (`● (SSG)`). |
| **Can you name the exact line that makes the checkout dynamic?** | Line 13 in `app/checkout/page.js`: `const cookieStore = await cookies();`. |
| **Does the sidebar appear before the dishes on a throttled connection?** | Yes: Handled by `<Suspense fallback={<DishListSkeleton />}>` in `app/menu/page.js`. |
| **Can you justify every revalidate window in one sentence?** | Documented in `STRATEGY.md` and inline comments. |
