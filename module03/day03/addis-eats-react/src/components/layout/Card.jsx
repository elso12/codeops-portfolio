import PropTypes from 'prop-types';

export default function Card({ children }) {
  return (
    <article className="dish-card">
      {children}
    </article>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
};
