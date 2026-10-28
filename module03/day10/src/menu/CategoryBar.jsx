import React from 'react';

const CATEGORIES = ['All', 'Main', 'Vegetarian', 'Breakfast', 'Beverages'];

export function CategoryBar({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-bar-wrapper">
      <div className="category-chips" role="tablist" aria-label="Filter menu by cuisine category">
        {CATEGORIES.map((cat) => {
          const isActive =
            selectedCategory.toLowerCase() === cat.toLowerCase() ||
            (!selectedCategory && cat === 'All');

          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat === 'All' ? '' : cat)}
            >
              {cat === 'All' ? '🌟 All Dishes' : cat === 'Main' ? '🥩 Mains & Tibs' : cat === 'Vegetarian' ? '🌱 Vegan Fasting' : cat === 'Breakfast' ? '☕ Breakfast' : '🍹 Beverages'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryBar;
