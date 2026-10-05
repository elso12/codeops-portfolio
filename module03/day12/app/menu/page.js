import Link from 'next/link';
import { Suspense } from 'react';
import { getDishes } from '../../lib/dishes';

// Revalidate the menu every 60 seconds (Incremental Static Regeneration)
// Justification: Menu items, prices, and daily specials change occasionally during business hours,
// so a 60-second window balances immediate cache hits with up-to-date daily kitchen offerings.
export const revalidate = 60;

async function DishList() {
  // Fetches dishes; streamed inside Suspense so layout and sidebar render with zero blocking
  const dishes = await getDishes();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Featured Selections</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {dishes.length} dishes available
        </span>
      </div>

      <div className="dish-grid">
        {dishes.map((dish) => (
          <article key={dish.id} className="dish-card">
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
                    <span key={tag} className="tag" style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-muted)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="dish-desc">{dish.description}</p>
            </div>
            <div className="dish-footer">
              <span className="dish-price">${dish.price.toFixed(2)}</span>
              <Link href={`/menu/${dish.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                View Dish &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function DishListSkeleton() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '200px', height: '1.75rem', background: 'var(--bg-card)', borderRadius: '6px' }} />
        <div style={{ width: '100px', height: '1rem', background: 'var(--bg-card)', borderRadius: '4px' }} />
      </div>

      <div className="dish-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="dish-card" style={{ minHeight: '220px', opacity: 0.6 }}>
            <div style={{ width: '60%', height: '1.5rem', background: 'var(--border-color)', borderRadius: '6px', marginBottom: '1rem' }} />
            <div style={{ width: '100%', height: '3.5rem', background: 'var(--border-color)', borderRadius: '6px', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem' }}>
              <div style={{ width: '50px', height: '1.5rem', background: 'var(--border-color)', borderRadius: '4px' }} />
              <div style={{ width: '90px', height: '2rem', background: 'var(--border-color)', borderRadius: '6px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    // Suspense boundary streaming the dish list behind the instantly rendered sidebar layout
    <Suspense fallback={<DishListSkeleton />}>
      <DishList />
    </Suspense>
  );
}
