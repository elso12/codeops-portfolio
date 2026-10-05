import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

/**
 * DishList - React Server Component (RSC)
 * 
 * Notice: This file does NOT contain "use client".
 * It is rendered entirely on the server into HTML/RSC payload.
 * It is never imported by a client component, but instead passed
 * as `children` into FilterShell, ensuring its code and template
 * are excluded from the client JavaScript bundle.
 */
export default function DishList({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        color: 'var(--text-muted)'
      }}>
        <p>No dishes found matching this category.</p>
      </div>
    );
  }

  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <article
          key={dish.id}
          className="dish-card"
          data-category={dish.category}
        >
          <div>
            <div className="dish-header">
              <div className="dish-name">
                <span>{dish.name}</span>
                <span className="dish-amharic">{dish.amharic}</span>
              </div>
              <div className="tag-row">
                <span className="tag tag-category">{dish.category}</span>
                <span className="tag tag-spice">{dish.spiceLevel}</span>
                {dish.dietary?.map((tag) => (
                  <span
                    key={tag}
                    className="tag"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="dish-desc">{dish.description}</p>
          </div>
          <div className="dish-footer" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="dish-price">${dish.price.toFixed(2)}</span>
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
              <AddToCartButton dish={dish} />
              <Link
                href={`/menu/${dish.id}`}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              >
                Details &rarr;
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
