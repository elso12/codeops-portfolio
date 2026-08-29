import PropTypes from 'prop-types';

export default function Header({ orderTotal }) {
  return (
    <header>
      <h1>Addis Eats</h1>
      {orderTotal > 0 && (
        <span className="header-total">Running Total: {orderTotal} ETB</span>
      )}
    </header>
  );
}

Header.propTypes = {
  orderTotal: PropTypes.number.isRequired,
};
