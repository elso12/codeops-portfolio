import PropTypes from 'prop-types';
import Card from './Card.jsx';

export default function Dish({ name, price, category, spicy, currency = "ETB", onAdd }) {
  return (
    <Card>
      <span className="dish-category">{category}</span>
      <h3 className="dish-title">
        {name} {spicy === true && <span style={{ fontSize: "0.8rem" }}>🌶️ Spicy</span>}
      </h3>
      <p className="dish-price">{price} {currency}</p>
      
      <button className="btn-add" onClick={onAdd}>
        Add
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
  onAdd: PropTypes.func
};