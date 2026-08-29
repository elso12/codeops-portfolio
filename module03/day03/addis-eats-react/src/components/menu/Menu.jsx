import { useState } from 'react';
import PropTypes from 'prop-types';
import Dish from './Dish.jsx';
import CategoryBar from './CategoryBar.jsx';
import { menuData } from '../../data/data.js';

// Step 2: Lift a category state into Menu and pass it to CategoryBar and DishList.
// Holds the lifted category state and derives the filtered list.
// Step 3: Render the category chips from an array, highlighting the selected one.
// Step 4: Keep a running order total and show it in ETB as dishes are added.
export default function Menu({ onAddToOrder }) {
  // Lifted category state — shared between CategoryBar and the filtered DishList.
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Console-log state at the top of the component to understand re-rendering.
  console.log("Menu rendered — category:", selectedCategory);

  // Derive unique categories from data, prepend "All".
  const categories = ["All", ...new Set(menuData.map((d) => d.category))];

  // Filter dishes based on the selected category.
  const filteredMenu =
    selectedCategory === "All"
      ? menuData
      : menuData.filter((dish) => dish.category === selectedCategory);

  return (
    <>
      {/* Step 3: Category chips from an array, highlighting the selected one. */}
      <CategoryBar
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <h2>Menu ({selectedCategory})</h2>

      {/* Filtered dish list */}
      {filteredMenu.length === 0 ? (
        <p className="empty-state">
          No dishes found in the &quot;{selectedCategory}&quot; category.
        </p>
      ) : (
        <section className="menu-grid">
          {filteredMenu.map((dish) => (
            <Dish
              key={dish.id}
              name={dish.name}
              price={dish.price}
              category={dish.category}
              spicy={dish.spicy}
              onAdd={() => onAddToOrder(dish)}
            />
          ))}
        </section>
      )}
    </>
  );
}

Menu.propTypes = {
  onAddToOrder: PropTypes.func.isRequired,
};
