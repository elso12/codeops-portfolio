import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from './Card.jsx';

export default function Dish({ name, price, category, spicy, currency = 'ETB', onAdd }) {
  const [count, setCount] = useState(0);

  function handleAdd() {
    setCount((prev) => prev + 1);
    if (onAdd) {
      onAdd();
    }
  }

  return (
    <Card>
      <span className="dish-category">{category}</span>
      <h3 className="dish-title">
        {name} {spicy === true && <span style={{ fontSize: '0.85rem' }}>🌶️ Spicy</span>}
      </h3>
      <p className="dish-price">{price} {currency}</p>

      <button type="button" className="btn-add" onClick={handleAdd}>
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
