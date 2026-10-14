import PropTypes from 'prop-types';

export default function CategoryBar({ categories, selected, onSelect }) {
  return (
    <nav className="category-bar" aria-label="Menu categories">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`category-chip ${cat === selected ? 'active' : ''}`}
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
