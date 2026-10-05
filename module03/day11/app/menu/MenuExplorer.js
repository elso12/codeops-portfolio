"use client";

import { useState } from "react";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

export default function MenuExplorer({ initialDishes }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(initialDishes.map((d) => d.category))];

  const filteredDishes =
    selectedCategory === "All"
      ? initialDishes
      : initialDishes.filter((dish) => dish.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Selection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-3">
        <CategoryBar
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <div className="text-xs text-stone-400 font-mono whitespace-nowrap">
          Showing <span className="text-amber-400 font-bold">{filteredDishes.length}</span> of {initialDishes.length} dishes
        </div>
      </div>

      {/* Render DishList */}
      <DishList dishes={filteredDishes} />
    </div>
  );
}
