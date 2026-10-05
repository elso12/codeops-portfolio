'use client';

/**
 * CategoryBar - Client Component
 * 
 * Interactive category selector bar for Addis Eats menu.
 * When placed inside or alongside FilterShell, it manages the active category selection
 * without requiring DishList or the Menu Page to be client components.
 */
export default function CategoryBar({ categories = [], selected = 'All', onSelect }) {
  return (
    <div className="filter-pills" role="tablist" aria-label="Dish Categories">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={selected === cat}
          className={`filter-pill ${selected === cat ? 'active' : ''}`}
          onClick={() => onSelect && onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
