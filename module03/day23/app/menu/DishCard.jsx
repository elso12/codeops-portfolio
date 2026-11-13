import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

/**
 * app/menu/DishCard.jsx
 *
 * Implements the Next.js <Image> pipeline exactly as specified in Day 43 lecture:
 * - Explicit width & height (400x300) to reserve the 4:3 aspect-ratio box and prevent CLS.
 * - Honest `sizes` attribute so the browser downloads appropriately scaled WebP/AVIF variants.
 * - Meaningful, accessible alt text describing the culinary item.
 * - Default native lazy loading (no priority) to conserve initial bandwidth.
 */
export default function DishCard({ dish }) {
  return (
    <article className="card-figma" data-category={dish.category}>
      <div className="card-figma__image-wrap">
        <Image
          src={dish.image}
          alt={`${dish.name} - authentic Habesha ${dish.category}`}
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, 400px"
          className="card-figma__img"
        />
        <span className="card-figma__tag">{dish.category}</span>
      </div>
      <div className="card-figma__body">
        <div className="card-figma__header">
          <div>
            <h3 className="card-figma__title">{dish.name}</h3>
            <span
              className={`status-pill ${
                dish.available ? "status-pill--available" : "status-pill--soldout"
              }`}
            >
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
            <AddToCartButton
              dish={{
                id: dish.id,
                name: dish.name,
                price: dish.price,
                currency: dish.currency,
              }}
            />
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
  );
}
