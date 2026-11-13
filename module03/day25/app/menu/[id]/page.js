/**
 * app/menu/[id]/page.js - Dish detail page (Server Component)
 *
 * Rendering strategy: STATIC via generateStaticParams
 * All dish ids are known at build time (in-memory data store).
 * Each page is pre-rendered once and served as static HTML.
 *
 * notFound() is called for any id not in the data, rendering app/not-found.js.
 */
import { getDishById, getDishes } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

/** Tell Next.js which [id] segments to pre-render at build time */
export async function generateStaticParams() {
  const dishes = getDishes();
  return dishes.map((dish) => ({ id: dish.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return { title: "Dish not found" };

  const description = `${dish.name} — ${dish.price} ETB. ${dish.description}`;

  return {
    title: dish.name,
    description,
    alternates: {
      canonical: `/menu/${dish.id}`,
    },
    openGraph: {
      title: `${dish.name} · Addis Eats`,
      description,
      type: "website",
      locale: "en_ET",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dish.name} · Addis Eats`,
      description,
    },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = getDishById(id);

  // Triggers app/not-found.js — never crashes, always returns 404
  if (!dish) notFound();

  // Structured Data (JSON-LD) generated from the exact same dish record rendered on page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: `https://addiseats.et${dish.image}`,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: dish.currency || "ETB",
      availability: dish.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceValidUntil: "2027-12-31",
      seller: {
        "@type": "Restaurant",
        name: "Mesob House · Addis Eats",
        telephone: "+251-11-661-2345",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Bole Rwanda Road",
          addressLocality: "Addis Ababa",
          addressCountry: "ET",
        },
      },
    },
    menuAddOn: {
      "@type": "MenuItem",
      name: "Naturally Fermented Teff Sourdough Injera",
    },
    suitableForDiet:
      dish.category === "Fasting" ? "https://schema.org/VeganDiet" : undefined,
  };

  return (
    <main className="container" style={{ maxWidth: 840 }}>
      {/* Schema.org MenuItem Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb-list">
          <li><Link href="/" className="breadcrumb-link">Home</Link></li>
          <li className="breadcrumb-sep">/</li>
          <li><Link href="/menu" className="breadcrumb-link">Banquet Menu</Link></li>
          <li className="breadcrumb-sep">/</li>
          <li className="breadcrumb-active">{dish.name}</li>
        </ol>
      </nav>

      <div className="detail-card">
        <div className="detail-card__img-wrap">
          <Image
            src={dish.image}
            alt={`Freshly prepared ${dish.name} - authentic Habesha ${dish.category}`}
            width={840}
            height={400}
            sizes="(max-width: 840px) 100vw, 840px"
            priority
            className="detail-card__img"
          />
          <div className="detail-card__badge-overlay">
            <span className="card-figma__tag">{dish.category}</span>
          </div>
        </div>

        <div className="detail-card__body">
          <div className="detail-card__top">
            <div>
              <span className="section-eyebrow">TRADITIONAL HEARTH RECIPE</span>
              <h1 className="detail-card__title">{dish.name}</h1>
            </div>
            <span className={`status-pill ${dish.available ? "status-pill--available" : "status-pill--soldout"}`}>
              {dish.available ? "✓ Available Fresh in Kitchen" : "✗ Sold Out Today"}
            </span>
          </div>

          <p className="detail-card__desc">
            {dish.description}
          </p>

          <div className="detail-card__highlight">
            <div className="highlight-icon">🌿</div>
            <div>
              <h4>Culinary Heritage &amp; Slow Cooking</h4>
              <p>
                Simmered with stone-ground highland berbere spices, aromatic herbs, and 72-hour infused niter kibbeh clarified butter. Accompanied by naturally fermented teff injera.
              </p>
            </div>
          </div>

          <div className="detail-card__footer">
            <div className="detail-price-box">
              <span className="price-label">Price per Platter</span>
              <div className="price-val">
                {dish.price} <small>ETB</small>
              </div>
            </div>

            <div className="detail-actions">
              <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price, currency: dish.currency }} />
              <Link
                href={`/checkout?dishId=${dish.id}`}
                className="btn-figma btn-figma--primary"
                id={`order-${dish.id}`}
              >
                Direct Checkout &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-notice" style={{ marginTop: "2.5rem" }}>
        <strong>Static Site Generation (SSG):</strong> Built statically from <code>generateStaticParams()</code>. Zero runtime DB lookup delay for ultra-fast performance.
      </div>
    </main>
  );
}
