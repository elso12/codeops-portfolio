import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';

/**
 * DishCard — individual dish tile.
 *
 * Exercise 2: accepts a `shouldCrash` prop.  When true it deliberately throws
 * during render so the wrapping ErrorBoundary catches it and the rest of the
 * screen (header, cart) continues working.
 *
 * Exercise 7: the Details modal is declared *inside* .dish-card which has
 * overflow:hidden.  Without createPortal the modal would be clipped by the card.
 * Modal.jsx uses createPortal so it escapes into #modal-root.
 *
 * Wrapped in React.memo so it only re-renders when its own props change
 * (Exercise 6 — remove unnecessary re-renders).
 */
function DishCard({ dish, onAdd, shouldCrash }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* Exercise 2 — deliberate render error in one dish. */
  if (shouldCrash) {
    throw new Error(
      `Simulated render failure in "${dish.name}" — proves the Menu boundary catches this while the Header and Cart remain intact.`
    );
  }

  return (
    <article className="dish-card" data-dish-id={dish.id}>
      <div className="dish-card-body">
        <div className="dish-card-top">
          <span className="dish-category">{dish.category}</span>
          {dish.spicy && <span className="dish-spicy">🌶 Spicy</span>}
        </div>

        <h3 className="dish-name">{dish.name}</h3>
        <p className="dish-desc">{dish.description}</p>

        <div className="dish-meta">
          <span>⏱ {dish.prepTime}</span>
          <span>🔥 {dish.calories}</span>
        </div>

        <div className="dish-actions">
          <button
            type="button"
            className="btn-outline"
            onClick={() => setIsModalOpen(true)}
            aria-haspopup="dialog"
            aria-label={`View details for ${dish.name}`}
          >
            Details
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => onAdd(dish)}
            aria-label={`Add ${dish.name} to order – ${dish.price} ETB`}
          >
            + Add  {dish.price} ETB
          </button>
        </div>
      </div>

      {/*
        Exercise 7 — Modal is written INSIDE .dish-card (overflow:hidden).
        createPortal in Modal.jsx teleports it into #modal-root in index.html,
        escaping the clipping context while staying in the React tree so
        CartContext and events still work normally.
      */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={dish.name}
      >
        <div className="modal-dish-content">
          <p className="modal-dish-desc">{dish.description}</p>

          <dl className="modal-dish-details">
            <div><dt>Category</dt>    <dd>{dish.category}</dd></div>
            <div><dt>Prep time</dt>   <dd>{dish.prepTime}</dd></div>
            <div><dt>Calories</dt>    <dd>{dish.calories}</dd></div>
            <div><dt>Price</dt>       <dd>{dish.price} ETB</dd></div>
            {dish.spicinessLevel != null && (
              <div><dt>Spiciness</dt><dd>{dish.spicinessLevel} / 5</dd></div>
            )}
          </dl>

          {dish.allergens && dish.allergens.length > 0 && (
            <div className="modal-allergens">
              <h4>Allergens</h4>
              <ul>
                {dish.allergens.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
          )}

          <button
            type="button"
            className="btn-primary modal-add-btn"
            onClick={() => { onAdd(dish); setIsModalOpen(false); }}
          >
            Add to Order — {dish.price} ETB
          </button>
        </div>
      </Modal>
    </article>
  );
}

/*
 * Exercise 6 — React.memo skips a re-render when every prop is referentially
 * equal to last time.  Combined with the stable useCallback in Menu.jsx this
 * means clicking "Add" on one dish no longer re-renders all ten cards.
 */
export default React.memo(DishCard);
