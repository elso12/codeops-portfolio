/**
 * app/page.js — Home / landing page (Server Component)
 * Reads top dishes directly — no fetch, no endpoint needed.
 */
import { getDishes } from "@/lib/data";
import Link from "next/link";

export const metadata = {
  title: "Addis Eats — Authentic Ethiopian Food Delivery",
  description: "Order Doro Wat, Tibs, Shiro and more. Fresh from Addis kitchens to your door.",
};

const EMOJI = {
  Main: "🍲",
  Breakfast: "☕",
  Drinks: "🫖",
};

export default function HomePage() {
  const featured = getDishes().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <span className="hero__eyebrow">🇪🇹 Addis Ababa · Est. 2024</span>
        <h1 className="hero__title">
          Authentic <span className="accent">Ethiopian</span> Food,<br />
          Delivered Fast
        </h1>
        <p className="hero__subtitle">
          Doro Wat, Tibs, Shiro, Kitfo — real dishes from real kitchens,
          brought to your door anywhere in Addis.
        </p>
        <div className="hero__cta">
          <Link href="/menu" className="btn btn-primary">Browse the Menu →</Link>
          <Link href="/checkout" className="btn btn-outline">Place an Order</Link>
        </div>
      </section>

      {/* Featured dishes */}
      <main className="container">
        <div className="section-header">
          <h2>Featured Dishes</h2>
          <p>Hand-picked favourites from today's menu</p>
        </div>

        <div className="dish-grid">
          {featured.map((dish) => (
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
                  <Link
                    href={`/checkout?dishId=${dish.id}`}
                    className="btn btn-primary btn-sm"
                    id={`order-${dish.id}`}
                  >
                    Order
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/menu" className="btn btn-outline">View All Dishes</Link>
        </div>

        {/* What's happening under the hood */}
        <div className="divider" />
        <div className="notice">
          <strong>Day 39 — API Routes &amp; Server Actions:</strong>{" "}
          This page is a <strong>server component</strong> — it reads dishes directly with no fetch call.
          The <strong>checkout form</strong> uses a server action (<code>placeOrder</code>).
          Hit <code>GET /api/dishes</code>, <code>POST /api/orders</code> or{" "}
          <code>GET /api/orders</code> directly with curl to test the endpoints.
        </div>
      </main>
    </>
  );
}
