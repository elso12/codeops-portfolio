import PropTypes from 'prop-types';

export default function Header({ orderTotal }) {
  return (
    <header>
      <div className="header-content">
        <h1>Addis Eats</h1>
        <p className="header-subtitle">The Menu That Loads Itself</p>
      </div>
      {orderTotal > 0 && (
        <span className="header-total">Running Total: {orderTotal} ETB</span>
      )}
    </header>
  );
}

Header.propTypes = {
  orderTotal: PropTypes.number.isRequired,
};
