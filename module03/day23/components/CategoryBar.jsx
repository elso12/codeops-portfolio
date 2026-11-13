"use client";
import { useState } from "react";

export default function CategoryBar({ children }) {
  const [selected, setSelected] = useState("All");

  const categories = [
    { label: "All Dishes", value: "All", icon: "🧺" },
    { label: "Main Dishes", value: "Main", icon: "🥘" },
    { label: "Breakfast", value: "Breakfast", icon: "🍳" },
    { label: "Drinks", value: "Drinks", icon: "☕" },
  ];

  return (
    <div className="category-filter-wrapper">
      {/* Category Pills Bar */}
      <nav aria-label="Menu categories" className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelected(cat.value)}
            className={`category-pill ${selected === cat.value ? "category-pill--active" : ""}`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </nav>

      {/* Children container with active category selector */}
      <div className="filtered-dishes-area" data-active-category={selected}>
        {children}
      </div>
    </div>
  );
}
