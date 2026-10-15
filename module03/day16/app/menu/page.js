/**
 * app/menu/page.js - Full Banquet Menu (Server Component)
 *
 * Section 4 (Server & Client Together):
 * 1. The Server Component reads ?page= from searchParams and loads the initial page
 *    of dishes directly via `getDishesPaginated` (fast, indexable, zero initial spinner).
 * 2. Seeds <PagedDishList> with `initialData` (fallbackData).
 * 3. Mounts <SearchBox> for live debounced search with conditional null key and keepPreviousData.
 * 4. Paging is driven by URL query string (?page=2), making all pages linkable and shareable.
 */

import { getDishesPaginated } from "@/lib/data";
import SearchBox from "./SearchBox";
import PagedDishList from "./PagedDishList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Full Banquet Menu | Mesob House - Authentic Habesha Cuisine",
  description: "Browse authentic Ethiopian dishes. Debounced live search, linkable pagination, and instant server-rendered catalog.",
};

export default async function MenuPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {};
  const pageParam = resolvedParams.page || "1";
  const initialPage = Math.max(1, parseInt(pageParam, 10) || 1);

  // Fetch initial page directly on the server to seed fallbackData
  const initialData = getDishesPaginated({ page: initialPage, limit: 4 });

  return (
    <main className="container" style={{ maxWidth: 1100, paddingBottom: "5rem" }}>
      {/* Hero Header */}
      <div className="section-header-centered" style={{ marginBottom: "2.5rem" }}>
        <span className="section-eyebrow">የምግብ ዝርዝር · SACRED RECIPES</span>
        <h1 className="section-title-large">Authentic Habesha Menu</h1>
        <p className="section-sub-centered">
          Every wat and sauté is prepared using stone-ground highland berbere, pure herb-infused niter kibbeh,
          and naturally fermented 100% teff grain sourdough injera.
        </p>
      </div>

      {/* Debounced Live Search Box (Exercise 5 & 6) */}
      <SearchBox />

      {/* Paged Dish List with Query String & keepPreviousData (Exercise 7) */}
      <PagedDishList initialData={initialData} />

      {/* Architectural Notice */}
      <div className="footer-notice" style={{ marginTop: "4rem" }}>
        <strong>SWR Architectural Pattern (Live Data in Addis Eats):</strong> Page one rendered on server for SEO and instant first paint. Subsequent page transitions and typing in search utilize SWR with <code>keepPreviousData: true</code>, ensuring zero flicker, debounced keystroke requests, and URL-synchronized state.
      </div>
    </main>
  );
}
