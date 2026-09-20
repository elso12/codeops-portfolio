import React from 'react';
import { useCart } from '../context/CartContext';
import { getDishImage, DEFAULT_FALLBACK_IMAGE } from '../services/api';
import { FiPlus, FiEye, FiUsers } from 'react-icons/fi';
import { GiChiliPepper, GiPlantRoots } from 'react-icons/gi';

export default function DishCard({ dish }) {
  const { addToCart, openDishModal } = useCart();
  const imageUrl = getDishImage(dish);

  // Spice level helper
  const getSpiceBadgeClass = (level = '') => {
    if (level.includes('3/3') || level.toLowerCase().includes('fiery') || level.toLowerCase().includes('extra hot')) {
      return 'spice-hot';
    }
    if (level.includes('2/3') || level.toLowerCase().includes('medium')) {
      return 'spice-medium';
    }
    return 'spice-mild';
  };

  return (
    <div className="dish-card" onClick={() => openDishModal(dish)}>
      {/* Top Image Container */}
      <div className="dish-image-wrapper">
        <img 
          src={imageUrl} 
          alt={dish.nameEn} 
          className="dish-thumbnail"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
          }}
        />
        
        {/* Floating Badges */}
        <div className="dish-badges">
          {dish.isFasting && (
            <span className="badge-fasting" title="Fasting / Vegan Dish">
              <GiPlantRoots />
              <span>Tsom (Vegan)</span>
            </span>
          )}
          {dish.isSpecial && (
            <span className="badge-special">
              ★ Chef Special
            </span>
          )}
        </div>

        {/* Quick View Hover overlay */}
        <div className="dish-hover-overlay">
          <button 
            className="view-details-pill"
            onClick={(e) => {
              e.stopPropagation();
              openDishModal(dish);
            }}
          >
            <FiEye /> View Dish
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="dish-info">
        <div className="dish-header">
          <span className="dish-category">{dish.category}</span>
          <span className={`spice-level-indicator ${getSpiceBadgeClass(dish.spiceLevel)}`}>
            <GiChiliPepper />
            <span>{dish.spiceLevel}</span>
          </span>
        </div>

        <h3 className="dish-title">{dish.nameEn}</h3>
        <span className="dish-amharic amharic-text">{dish.nameAm}</span>

        <p className="dish-description">
          {dish.description}
        </p>

        {dish.servings && (
          <div className="dish-servings">
            <FiUsers className="servings-icon" />
            <span>{dish.servings}</span>
          </div>
        )}

        {/* Card Footer: Price & Add Button */}
        <div className="dish-footer">
          <div className="dish-price">
            <span className="currency">ETB</span>
            <span className="amount">{dish.priceETB.toLocaleString()}</span>
          </div>
          <button 
            className="quick-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(dish);
            }}
            aria-label={`Add ${dish.nameEn} to cart`}
            title="Add to Feast"
          >
            <FiPlus />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
