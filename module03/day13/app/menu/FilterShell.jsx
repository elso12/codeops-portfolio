'use client';

import { useState } from 'react';
import CategoryBar from './CategoryBar';

/**
 * FilterShell - Client Component
 * 
 * Requirement 6: Wrap the server DishList in a client FilterShell using children
 * rather than an import.
 * 
 * By receiving the server-rendered content as `children`, FilterShell does NOT
 * import DishList. Consequently, DishList remains on the server side and its
 * template and code are never bundled into the client JavaScript bundle.
 * 
 * Notice: No callback props are passed across the boundary from the server component.
 */
export default function FilterShell({ categories = [], totalDishes = 6, children }) {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="filter-shell-container">
      {/* Interactive Category Filter Bar */}
      <div className="filter-header-bar">
        <CategoryBar
          categories={categories}
          selected={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="filter-counter-badge">
          <span>Active Filter: </span>
          <strong style={{ color: 'var(--color-turmeric)' }}>{activeCategory}</strong>
        </div>
      </div>

      {/* 
        Server-rendered children are rendered inside a shell with data-active-category.
        CSS selectors filter the server-rendered dish articles without needing 
        DishList to be shipped in the client JavaScript bundle.
      */}
      <div className="filter-content-area" data-active-category={activeCategory}>
        {children}
      </div>
    </div>
  );
}
