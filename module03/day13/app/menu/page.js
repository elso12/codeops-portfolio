import { getDishes } from '../../lib/dishes';
import DishList from './DishList';
import FilterShell from './FilterShell';

export const metadata = {
  title: 'Addis Eats Menu | Mesob House Traditional Delicacies',
  description: 'Authentic Ethiopian menu with royal wats, sizzling tibs, fasting beyaynetu, and claypot shiro.',
};

// Incremental Static Regeneration window
export const revalidate = 3600;

/**
 * MenuPage - Async Server Component
 * 
 * Requirements 1 & 2:
 * - Direct async server component awaiting dishes
 * - Zero useFetch hook, zero client-side loading or error states
 * 
 * Requirement 6:
 * - Wraps server DishList inside client FilterShell via `children` rather than an import
 * - No callback props passed from server component to client component
 */
export default async function MenuPage() {
  const dishes = await getDishes();
  const categories = ['All', ...new Set(dishes.map((d) => d.category))];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Selections</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Handcrafted with authentic spices, fresh niter kibbeh, and 100% teff injera
          </p>
        </div>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--color-turmeric)',
          background: 'rgba(229, 169, 60, 0.1)',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          border: '1px solid rgba(229, 169, 60, 0.25)',
          fontWeight: 600
        }}>
          {dishes.length} dishes available
        </span>
      </div>

      {/* 
        Wrap the server DishList inside client FilterShell using children.
        DishList runs and renders entirely on the server.
      */}
      <FilterShell categories={categories} totalDishes={dishes.length}>
        <DishList dishes={dishes} />
      </FilterShell>
    </div>
  );
}
