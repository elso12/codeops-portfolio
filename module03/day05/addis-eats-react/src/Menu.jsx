import { useMemo } from 'react';
import Dish from './Dish.jsx';
import { useCart } from './cart/CartProvider.jsx';

export default function Menu({ categoryFilter, menuData }) {
  const { dispatch } = useCart();

  // Memoize the filtering logic as requested
  const filteredMenu = useMemo(() => {
    if (!menuData) return [];
    return categoryFilter === "All" 
      ? menuData 
      : menuData.filter(dish => dish.category === categoryFilter);
  }, [categoryFilter, menuData]);

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
          onAdd={() => dispatch({ type: 'ADD', payload: dish })}
        />
      ))}
    </section>
  );
}