import PropTypes from 'prop-types';

// Step 3: Stateless chips calling the onSelect handler from props.
// Renders category chips from an array, highlighting the selected one.
export default function CategoryBar({ categories, selected, onSelect }) {
  // Console-log state at the top of the component to understand re-rendering.
  console.log("CategoryBar rendered — selected:", selected);

  return (
    <nav className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-chip ${cat === selected ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}

CategoryBar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
