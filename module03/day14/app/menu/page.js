/**
 * app/menu/page.js - Menu page (Server Component)
 *
 * Rendering strategy: ISR
 * The menu is fetched and cached, revalidating every hour to ensure 
 * prices and availability stay fresh without rebuilding the whole site.
 */
import { getDishes } from "@/lib/data";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: "Menu - Mesob House",
  description: "Browse the full Mesob House menu. Mains, breakfast, drinks - all authentic Ethiopian.",
};

const EMOJI = { Main: "🍛", Breakfast: "🌅", Drinks: "☕" };
const CATEGORIES = ["All", "Main", "Breakfast", "Drinks"];

// Note: To keep the page ISR (static + revalidate), we should avoid using searchParams on the server
// unless we use generateStaticParams for the category routes too. Since we don't have separate routes,
// we will just display all dishes and use client-side filtering if needed (or simply list them all).
export default async function MenuPage() {
  const dishes = getDishes(); // Fetch all

  return (
    <main className="container">
      <div className="section-header">
        <h1>Our Menu</h1>
        <p>Everything made fresh - {dishes.length} dishes available today</p>
      </div>

      <div className="dish-grid">
        {dishes.map((dish) => (
          <article key={dish.id} className="card">
            <div className="card__img" aria-hidden="true">
              {EMOJI[dish.category] ?? "🍽️"}
            </div>
            <div className="card__body">
              <span className="badge badge-category">{dish.category}</span>
              <h3 style={{ marginTop: ".75rem", marginBottom: ".4rem" }}>{dish.name}</h3>
              <p style={{ fontSize: ".9rem", marginBottom: "1rem" }}>{dish.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="price">
                  {dish.price}<span className="price-currency">ETB</span>
                </span>
                <div style={{ display: "flex", gap: ".5rem" }}>
                  <Link
                    href={`/menu/${dish.id}`}
                    className="btn btn-outline btn-sm"
                    id={`view-${dish.id}`}
                  >
                    Details
                  </Link>
                  <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price, currency: dish.currency }} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="notice" style={{ marginTop: "2rem" }}>
        <strong>Strategy: ISR (Incremental Static Regeneration)</strong> — this page is statically generated at build time, but automatically revalidates every 3600 seconds. No searchParams are read on the server to ensure it stays static/ISR.
      </div>
    </main>
  );
}
