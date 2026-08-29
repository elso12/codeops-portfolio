import Dish from './Dish.jsx';
import { menuData } from './data.js';

export default function Menu({ categoryFilter, onAddToCart }) {
  const filteredMenu = categoryFilter === "All" 
    ? menuData 
    : menuData.filter(dish => dish.category === categoryFilter);

  if (filteredMenu.length === 0) {
    return (
      <div style={{ padding: "2rem", color: "#64748b", fontStyle: "italic" }}>
        No dishes found in the "{categoryFilter}" category.
      </div>
    );
  }

  return (
    <section className="menu-grid">
      {filteredMenu.map(dish => (
        <Dish 
          key={dish.id} 
          name={dish.name} 
          price={dish.price}
          category={dish.category}
          spicy={dish.spicy}
          onAdd={() => onAddToCart(dish)}
        />
      ))}
    </section>
  );
}