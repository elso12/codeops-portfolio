import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DishCard from './DishCard.jsx';
import { useCart } from '../cart/CartContext.jsx';

/**
 * Menu — dish catalogue with category filter and search.
 *
 * Exercise 5 & 6: useCallback on handleAdd gives DishCard a stable function
 * reference every render.  Combined with React.memo on DishCard, cart updates
 * no longer re-render dishes whose props did not change.
 *
 * Exercise 2: forwards `shouldCrash` to whichever dish id matches `crashedId`.
 */
export default function Menu({
  isDishCrashed = false,
  crashedDishId = 3,
  crashedId = null,
  useMemoization = true,
}) {
  const [dishes,   setDishes]  = useState([]);
  const [loading,  setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);
  const [category, setCategory] = useState('All');
  const [query,    setQuery]    = useState('');

  const { addToCart } = useCart();

  /*
   * Exercise 6 — stable callback reference so React.memo on DishCard is effective.
   * When useMemoization is false, creating a fresh function each render busts React.memo
   * so we can measure the unoptimized render time in Exercise 5.
   */
  const handleAddMemo = useCallback((dish) => addToCart(dish), [addToCart]);
  const handleAddFresh = (dish) => addToCart(dish);
  const handleAdd = useMemoization ? handleAddMemo : handleAddFresh;

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const res  = await fetch('/menu.json', { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) { setDishes(data); setFetchErr(null); }
      } catch (err) {
        if (err.name !== 'AbortError' && alive) setFetchErr(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; ctrl.abort(); };
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(dishes.map((d) => d.category))],
    [dishes]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return dishes.filter((d) => {
      const matchCat  = category === 'All' || d.category === category;
      const matchText = d.name.toLowerCase().includes(q) ||
                        d.description.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [dishes, category, query]);

  if (loading) {
    return (
      <div className="menu-loading" aria-busy="true">
        <div className="spinner" />
        <p>Loading kitchen menu…</p>
      </div>
    );
  }

  if (fetchErr) {
    return (
      <div className="menu-error" role="alert">
        <p>Could not load menu: {fetchErr}</p>
        <button className="btn-outline" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="menu-section" aria-labelledby="menu-heading">
      <div className="menu-controls">
        <div>
          <h2 id="menu-heading" className="section-title">
            Ethiopian Kitchen
          </h2>
          <p className="section-subtitle">
            Slow-cooked wats · kitfo · tibs · vegan platters
          </p>
        </div>

        <div className="filter-bar">
          <div role="radiogroup" aria-label="Filter by category" className="chip-group">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={category === cat}
                className={`chip ${category === cat ? 'chip--active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="search"
            className="search-input"
            placeholder="Search dish or ingredient…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search dishes"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No dishes match your filter.</p>
      ) : (
        <div className="dish-grid">
          {filtered.map((dish) => {
            const isTarget = (isDishCrashed && dish.id === crashedDishId) || (dish.id === crashedId);
            return (
              <DishCard
                key={dish.id}
                dish={dish}
                onAdd={handleAdd}
                shouldCrash={Boolean(isTarget)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
