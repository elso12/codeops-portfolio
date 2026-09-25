import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getDishImage, DEFAULT_FALLBACK_IMAGE } from '../services/api';
import { 
  FiX, 
  FiPlus, 
  FiMinus, 
  FiUsers, 
  FiShoppingBag
} from 'react-icons/fi';
import { GiChiliPepper, GiPlantRoots } from 'react-icons/gi';

export default function DishDetailModal() {
  const { activeDishModal, closeDishModal, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState('');

  // Reset state when a new dish is selected
  useEffect(() => {
    if (activeDishModal) {
      setQuantity(1);
      setSpecialNote('');
    }
  }, [activeDishModal]);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!activeDishModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeDishModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDishModal, closeDishModal]);

  if (!activeDishModal) return null;

  const dish = activeDishModal;
  const imageUrl = getDishImage(dish);
  const itemTotal = dish.priceETB * quantity;

  const handleAdd = () => {
    addToCart(dish, quantity, specialNote);
    closeDishModal();
    setQuantity(1);
    setSpecialNote('');
  };

  return (
    <div className="modal-backdrop" onClick={closeDishModal} role="dialog" aria-modal="true">
      <div 
        className="dish-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="modal-close-btn"
          onClick={closeDishModal}
          aria-label="Close dialog"
        >
          <FiX />
        </button>

        {/* Modal Grid */}
        <div className="dish-modal-grid">
          {/* Left: Dish Visual */}
          <div className="dish-modal-image-col">
            <img 
              src={imageUrl} 
              alt={dish.nameEn} 
              className="dish-modal-img" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
              }}
            />
            <div className="dish-modal-badges">
              {dish.isFasting && (
                <span className="badge-fasting">
                  <GiPlantRoots /> Fasting / Tsom
                </span>
              )}
              {dish.isSpecial && (
                <span className="badge-special">
                  ★ Chef Special
                </span>
              )}
            </div>
          </div>

          {/* Right: Dish Specs & Action */}
          <div className="dish-modal-details-col">
            <div className="modal-category">{dish.category}</div>
            <h2 className="modal-title">{dish.nameEn}</h2>
            <div className="modal-amharic amharic-text">{dish.nameAm}</div>

            {dish.tagline && (
              <div className="modal-tagline">{dish.tagline}</div>
            )}

            <div className="modal-price-row">
              <div className="modal-price">
                <span className="currency">ETB</span>
                <span className="amount">{dish.priceETB.toLocaleString()}</span>
              </div>
              <div className="modal-spice-level">
                <GiChiliPepper className="chili-icon" />
                <span>{dish.spiceLevel}</span>
              </div>
            </div>

            <p className="modal-description">{dish.description}</p>

            {/* Servings Info */}
            {dish.servings && (
              <div className="modal-servings-box">
                <FiUsers className="servings-icon" />
                <span>{dish.servings}</span>
              </div>
            )}

            {/* Ingredients Tags */}
            {dish.ingredients && (Array.isArray(dish.ingredients) ? dish.ingredients.length > 0 : Boolean(dish.ingredients)) && (
              <div className="modal-ingredients-section">
                <span className="ingredients-label">Traditional Ingredients:</span>
                <div className="ingredients-tags">
                  {(Array.isArray(dish.ingredients) ? dish.ingredients : [dish.ingredients]).map((ing, idx) => (
                    <span key={idx} className="ingredient-tag">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Cooking Notes */}
            <div className="modal-notes-field">
              <label htmlFor="special-note">Special Instructions for Kitchen (Optional):</label>
              <input
                id="special-note"
                type="text"
                placeholder="e.g. Mild spice, extra Awaze on side, gluten allergy..."
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
              />
            </div>

            {/* Quantity Selector & Add Button */}
            <div className="modal-footer-actions">
              <div className="quantity-counter">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FiMinus />
                </button>
                <span className="qty-number">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <FiPlus />
                </button>
              </div>

              <button 
                className="btn-primary modal-add-btn"
                onClick={handleAdd}
              >
                <FiShoppingBag />
                <span>Add to Feast • ETB {itemTotal.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
