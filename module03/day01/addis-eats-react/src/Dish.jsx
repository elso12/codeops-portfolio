export default function Dish({ name, price, category, spicy, onAdd }) {
  return (
    <article className="dish-card">
      <span className="dish-category">{category}</span>
      <h3 className="dish-title">
        {name} {spicy ? "🌶️" : ""}
      </h3>
      <p className="dish-price">{price} ETB</p>
      
      <button className="btn-add" onClick={onAdd}>
        Add
      </button>
    </article>
  );
}