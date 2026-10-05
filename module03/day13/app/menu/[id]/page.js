import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDishById, getDishes } from '../../../lib/dishes';
import AddToCartButton from '../AddToCartButton';

// Pre-generate static HTML pages for all known dishes at build time (Requirement 5)
export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((dish) => ({
    id: dish.id,
  }));
}

export default async function DishDetailPage({ params }) {
  const { id } = await params;
  const dish = await getDishById(id);

  if (!dish) {
    notFound();
  }

  return (
    <div className="dish-detail-container">
      <Link href="/menu" className="back-link">
        &larr; Back to full Habesha menu
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-turmeric)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {dish.category}
          </span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginTop: '0.2rem', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>
            {dish.name}
          </h1>
          <span style={{ fontSize: '1.35rem', color: 'var(--color-turmeric)', fontWeight: 600 }}>
            {dish.amharic}
          </span>
        </div>
        <div style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: 'var(--color-turmeric)',
          background: 'rgba(229, 169, 60, 0.1)',
          padding: '0.5rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid rgba(229, 169, 60, 0.25)'
        }}>
          ${dish.price.toFixed(2)}
        </div>
      </div>

      <div className="detail-badge-group">
        <span className="tag tag-spice">{dish.spiceLevel}</span>
        {dish.dietary?.map((diet) => (
          <span key={diet} className="tag tag-category">
            ✓ {diet}
          </span>
        ))}
      </div>

      <p style={{ fontSize: '1.15rem', lineHeight: '1.75', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {dish.description}
      </p>

      {/* Culinary Preparation Note */}
      {dish.preparation && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderLeft: '4px solid var(--color-paprika)',
          padding: '1.2rem 1.5rem',
          borderRadius: '0 10px 10px 0',
          marginBottom: '2rem',
          border: '1px solid var(--border-color)',
          borderLeftColor: 'var(--color-paprika)'
        }}>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🥘</span> Traditional Preparation
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            {dish.preparation}
          </p>
        </div>
      )}

      {/* Ingredients Section */}
      <div className="detail-section">
        <h3>Sacred Ingredients &amp; Accompaniments</h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {dish.ingredients.map((ing) => (
            <li key={ing} style={{
              background: 'var(--bg-secondary)',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)'
            }}>
              ✓ {ing}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <AddToCartButton dish={dish} />
        <Link href="/checkout" className="btn btn-primary" style={{ padding: '0.9rem 1.8rem', fontSize: '0.95rem' }}>
          Proceed to Checkout &rarr;
        </Link>
        <Link href="/menu" className="btn btn-secondary" style={{ padding: '0.9rem 1.5rem', fontSize: '0.95rem' }}>
          Browse Menu
        </Link>
      </div>
    </div>
  );
}
