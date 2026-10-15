/**
 * app/menu/[id]/page.js - Dish detail page (Server Component)
 *
 * Rendering strategy: STATIC via generateStaticParams
 * All dish ids are known at build time (in-memory data store).
 * Each page is pre-rendered once and served as static HTML.
 * Build output marker: ● (pre-rendered from params)
 *
 * notFound() is called for any id not in the data, rendering app/not-found.js.
 */
import { getDishById, getDishes } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

const EMOJI = { Main: "🍛", Breakfast: "🌅", Drinks: "☕" };

/** Tell Next.js which [id] segments to pre-render at build time */
export async function generateStaticParams() {
  const dishes = getDishes();
  return dishes.map((dish) => ({ id: dish.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return { title: "Dish not found - Addis Eats" };
  return {
    title: `${dish.name} - Addis Eats`,
    description: dish.description,
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = getDishById(id);

  // Triggers app/not-found.js — never crashes, always returns 404
  if (!dish) notFound();

  return (
    <main className="container" style={{ maxWidth: 700 }}>
      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: "2rem" }}>
        <ol style={{ display: "flex", gap: ".5rem", listStyle: "none", padding: 0, fontSize: ".875rem" }}>
          <li><Link href="/" style={{ color: "var(--color-text-dim)", textDecoration: "none" }}>Home</Link></li>
          <li style={{ color: "var(--color-text-dim)", opacity: .5 }}>/</li>
          <li><Link href="/menu" style={{ color: "var(--color-text-dim)", textDecoration: "none" }}>Menu</Link></li>
          <li style={{ color: "var(--color-text-dim)", opacity: .5 }}>/</li>
          <li style={{ color: "var(--color-accent)" }}>{dish.name}</li>
        </ol>
      </nav>

      <div className="card">
        <div className="card__img" style={{ fontSize: "5rem", height: 240 }} aria-hidden="true">
          {EMOJI[dish.category] ?? "🍽️"}
        </div>
        <div className="card__body">
          <span className="badge badge-category">{dish.category}</span>
          <h1 style={{ marginTop: "1rem", marginBottom: ".5rem" }}>{dish.name}</h1>
          <p style={{ fontSize: "1.05rem", marginBottom: "1.5rem" }}>{dish.description}</p>

          <div className="divider" />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginTop: "1.5rem" }}>
            <div>
              <div className="price" style={{ fontSize: "2rem" }}>
                {dish.price}<span className="price-currency">ETB</span>
              </div>
              <p style={{ marginTop: ".25rem", fontSize: ".85rem" }}>
                <span style={{ color: dish.available ? "var(--color-success)" : "var(--color-error)" }}>
                  {dish.available ? "✓ Available now" : "✗ Currently unavailable"}
                </span>
              </p>
            </div>
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <Link
                href={`/cart?add=${dish.id}`}
                className="btn btn-outline"
                id={`add-cart-${dish.id}`}
              >
                Add to Cart
              </Link>
              <Link
                href={`/checkout?dishId=${dish.id}`}
                className="btn btn-primary"
                id={`order-dish-${dish.id}`}
              >
                Order Now →
              </Link>
            </div>
          </div>

          <div className="divider" />
          <Link href="/menu" className="btn btn-outline btn-sm" style={{ display: "inline-flex" }}>
            ← Back to Menu
          </Link>
        </div>
      </div>

      <div className="notice" style={{ marginTop: "2rem" }}>
        <strong>Strategy: Static ●</strong> — built once via{" "}
        <code>generateStaticParams()</code> for all {getDishes().length} dishes.
        Unknown ids hit <code>notFound()</code> → 404, never a crash.
      </div>
    </main>
  );
}
