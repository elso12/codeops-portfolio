/**
 * app/menu/page.js - Menu page (Server Component)
 *
 * Rendering strategy: ISR (3600 seconds)
 * The menu is fetched directly on the server without an unnecessary internal API hop.
 * The dish catalog revalidates every hour to keep availability and prices fresh.
 *
 * Server-Client Boundary:
 * MenuPage is a Server Component that fetches data.
 * Interactive category selection is handled by CategoryBar (client leaf)
 * which receives server-rendered dishes as `children`.
 */
import { getDishes } from "@/lib/data";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import CategoryBar from "@/components/CategoryBar";

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: "Full Banquet Menu | Mesob House - Authentic Habesha Cuisine",
  description: "Browse the full Mesob House menu. Slow-simmered wats, sizzling tibs, fasting beyaynetu, and fresh teff injera.",
};

export default async function MenuPage() {
  const dishes = getDishes();

  return (
    <main className="container">
      <div className="section-header-centered">
        <span className="section-eyebrow">የምግብ ዝርዝር · SACRED RECIPES</span>
        <h1 className="section-title-large">Authentic Habesha Menu</h1>
        <p className="section-sub-centered">
          Every wat and sauté is prepared using stone-ground highland berbere, pure herb-infused niter kibbeh,
          and naturally fermented 100% teff grain sourdough injera.
        </p>
      </div>

      {/* CategoryBar receives server-rendered children to preserve RSC boundary */}
      <CategoryBar>
        <div className="dish-grid">
          {dishes.map((dish) => (
            <article key={dish.id} className="card-figma" data-category={dish.category}>
              <div className="card-figma__image-wrap">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="card-figma__img"
                  loading="lazy"
                />
                <span className="card-figma__tag">{dish.category}</span>
              </div>
              <div className="card-figma__body">
                <div className="card-figma__header">
                  <div>
                    <h3 className="card-figma__title">{dish.name}</h3>
                    <span className={`status-pill ${dish.available ? "status-pill--available" : "status-pill--soldout"}`}>
                      {dish.available ? "● Available Fresh" : "○ Sold Out"}
                    </span>
                  </div>
                  <span className="card-figma__price">
                    {dish.price} <small>ETB</small>
                  </span>
                </div>
                <p className="card-figma__desc">{dish.description}</p>
                <div className="card-figma__footer">
                  <Link
                    href={`/menu/${dish.id}`}
                    className="btn-link"
                    id={`view-${dish.id}`}
                  >
                    Details &rarr;
                  </Link>
                  <div className="card-figma__actions">
                    <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price, currency: dish.currency }} />
                    <Link
                      href={`/checkout?dishId=${dish.id}`}
                      className="btn-figma btn-figma--primary btn-figma--sm"
                      id={`order-${dish.id}`}
                    >
                      Order
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </CategoryBar>

      <div className="footer-notice" style={{ marginTop: "3.5rem" }}>
        <strong>Strategy: ISR (Incremental Static Regeneration)</strong> — Statically generated with 3,600s revalidation. Menu data is loaded directly on the server without client JS overhead.
      </div>
    </main>
  );
}
