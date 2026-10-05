# Mesob House · Habesha Restaurant (Layouts and Strategies)

Mesob House (መሶብ ሀውስ) is a premium Ethiopian and Eritrean restaurant web application designed for an elevated digital dining experience. Inspired by the Figma Community project [Habesha-Restaurant](https://www.figma.com/community/file/1679526791160944664/habesha-restaurant) by Eyasu Nigussie, it combines rich paprika reds, turmeric golds, deep forest greens, warm ivory, and dark espresso tones with modern Next.js App Router rendering strategies.

## Visual Design & Architecture Highlights

- **Visual Identity**: Warm, authentic Habesha brand identity featuring handcrafted mesob basket motifs, Ethiopian Amharic script typography, spice meter badges, and sacred ingredient checklists.
- **Root Layout Shell (`app/layout.js`)**: Owns `<html>` and `<body>` tags, imports the complete `globals.css` design system, and wraps all views in a sticky site header and communal footer.
- **Nested Menu Layout (`app/menu/layout.js`)**: Houses a category sidebar with active counts and an interactive **Layout State Counter** (`MenuCounter.js`) that persists across client navigation into dish detail pages without unmounting.
- **Incremental Static Regeneration (`app/menu/page.js`)**: Configured with `export const revalidate = 60;`, keeping responses static while updating daily kitchen specials every minute.
- **Static Generation (`app/menu/[id]/page.js`)**: Uses `generateStaticParams()` to compile dedicated static HTML pages for all 6 dishes (`doro-wat`, `kitfo`, `beyaynetu`, `zilzil-tibs`, `shiro-tegabino`, `jebena-buna`).
- **Dynamic Checkout (`app/checkout/page.js`)**: Dynamically reads incoming request cookies via `await cookies()` to resolve guest dining preferences and session tokens.
- **Streaming with Suspense (`app/menu/page.js`)**: Wraps `<DishList />` inside a `<Suspense>` boundary with a skeleton fallback so the category sidebar and layout paint instantly.

---

## Production Build Output

```bash
> day12@1.0.0 build
> next build

▲ Next.js 16.3.8 (Turbopack)
✓ Running next.config took 63ms

  Creating an optimized production build ...
✓ Compiled successfully in 1793ms
  Running TypeScript ...
  Finished TypeScript in 11ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/11) ...
  Generating static pages using 7 workers (2/11) 
  Generating static pages using 7 workers (5/11) 
  Generating static pages using 7 workers (8/11) 
✓ Generating static pages using 7 workers (11/11) in 3.7s
  Finalizing page optimization ...

Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /checkout
├ ○ /menu                      1m      1y
└   /menu/[id]
  ├ ● /menu/doro-wat
  ├ ● /menu/kitfo
  ├ ● /menu/beyaynetu
  └ ● [+3 more paths]


○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## Verification & Self-Check

| Question | Verification Result |
| :--- | :--- |
| **Does the build output mark each route the way STRATEGY.md says?** | Yes: `/` is `○`, `/menu` is `○ (1m revalidate)`, `/menu/[id]` is `● (SSG)`, and `/checkout` is `ƒ (Dynamic)`. |
| **Does a counter in the menu layout keep its value when you open a dish?** | Yes: `MenuCounter` state in `app/menu/layout.js` persists during client-side navigation to `/menu/[id]`. |
| **Did `generateStaticParams` produce one HTML file per dish?** | Yes: Pre-rendered 6 static dish pages (`● (SSG)`). |
| **Can you name the exact line that makes the checkout dynamic?** | Line 13 in `app/checkout/page.js`: `const cookieStore = await cookies();`. |
| **Does the sidebar appear before the dishes on a throttled connection?** | Yes: Handled by `<Suspense fallback={<DishListSkeleton />}>` in `app/menu/page.js`. |
| **Can you justify every revalidate window in one sentence?** | Documented in `STRATEGY.md` and inline comments. |
