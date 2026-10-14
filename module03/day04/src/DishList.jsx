import PropTypes from 'prop-types';
import Dish from './Dish.jsx';

export default function DishList({
  dishes = [],
  loading = false,
  error = null,
  emptyMessage = 'No dishes found in this category.',
  onAddToOrder,
}) {
  // Step 3: Early returns for loading and error states before the list
  if (loading) {
    return <p className="loading">Loading the menu...</p>;
  }

  if (error) {
    return <p className="err">{error}</p>;
  }

  // Friendly empty state for empty category or search results
  if (!dishes || dishes.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <section className="menu-grid" aria-label="Dishes list">
      {dishes.map((dish) => (
        <Dish
          key={dish.id}
          name={dish.name}
          price={dish.price}
          category={dish.category}
          spicy={dish.spicy}
          onAdd={onAddToOrder ? () => onAddToOrder(dish) : undefined}
        />
      ))}
    </section>
  );
}

DishList.propTypes = {
  dishes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string,
      spicy: PropTypes.bool,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
  onAddToOrder: PropTypes.func,
};
