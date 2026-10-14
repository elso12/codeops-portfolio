import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DishList from './DishList.jsx';
import CategoryBar from './CategoryBar.jsx';
import { loadDishes } from './api.js';

export default function Menu({ onAddToOrder }) {
  const [category, setCategory] = useState('All');
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Step 7: useRef to target the search input DOM element
  const searchRef = useRef(null);

  const categories = ['All', 'Main', 'Vegetarian', 'Breakfast', 'Drinks'];

  /**
   * Step 7: Focus a search input on mount with useRef.
   *
   * WHY THE FOCUS CALL HAS TO BE INSIDE AN EFFECT:
   * 1. DOM Timing: During rendering, React creates the virtual representation of elements.
   *    The actual browser DOM node does NOT exist yet, so searchRef.current is null.
   * 2. Component Purity: Calling .focus() is an imperative side effect that alters browser
   *    focus state, which must never occur during pure component render calculations.
   * 3. Effect Guarantees: useEffect runs strictly AFTER the DOM is mounted and painted to
   *    the screen, where searchRef.current is guaranteed to hold the live <input> element.
   */
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Step 5 & 6: Category-driven fetching with AbortController cancellation in cleanup
  useEffect(() => {
    const ctrl = new AbortController();

    loadDishes(category, ctrl.signal, setDishes, setLoading, setError);

    // Step 6: Abort previous in-flight request when category changes or component unmounts
    return () => {
      ctrl.abort();
    };
  }, [category]);

  // Filter loaded dishes by search query
  const displayedDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Step 1: Set document.title to number of dishes currently shown
  useEffect(() => {
    const count = displayedDishes.length;
    document.title = `${count} dish${count === 1 ? '' : 'es'} shown – Addis Eats`;
  }, [displayedDishes]);

  const emptyMessage = searchTerm
    ? `No dishes matching "${searchTerm}" found in the "${category}" category.`
    : `No dishes found in the "${category}" category.`;

  return (
    <div className="menu-container">
      {/* Step 7: Auto-focused search input on mount */}
      <div className="search-container">
        <label htmlFor="dish-search" className="search-label">
          Search Menu
        </label>
        <input
          id="dish-search"
          ref={searchRef}
          type="search"
          className="search-input"
          placeholder="Filter dishes by name (e.g. Doro, Tibs, Shiro)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <CategoryBar
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />

      <div className="menu-header-row">
        <h2>Menu ({category})</h2>
        <span className="dish-counter">
          {displayedDishes.length} {displayedDishes.length === 1 ? 'dish' : 'dishes'} shown
        </span>
      </div>

      {/* Step 3: Render loading and error state with early returns before the list */}
      <DishList
        dishes={displayedDishes}
        loading={loading}
        error={error}
        emptyMessage={emptyMessage}
        onAddToOrder={onAddToOrder}
      />
    </div>
  );
}

Menu.propTypes = {
  onAddToOrder: PropTypes.func,
};
