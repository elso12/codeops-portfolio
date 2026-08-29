import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../layout/Card.jsx';

// Step 1: Add a count state to Dish and an "Add" button that increases it.
export default function Dish({ name, price, category, spicy, currency = "ETB", onAdd }) {
  const [count, setCount] = useState(0);

  // Console-log state at the top of the component to understand re-rendering.
  console.log(`Dish "${name}" rendered — count: ${count}`);

  function handleAdd() {
    setCount((prev) => prev + 1);
    onAdd();
  }

  return (
    <Card>
      <span className="dish-category">{category}</span>
      <h3 className="dish-title">
        {name} {spicy === true && <span style={{ fontSize: "0.8rem" }}>🌶️ Spicy</span>}
      </h3>
      <p className="dish-price">{price} {currency}</p>

      <button className="btn-add" onClick={handleAdd}>
        Add {count > 0 && `(${count})`}
      </button>
    </Card>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
  onAdd: PropTypes.func,
};
