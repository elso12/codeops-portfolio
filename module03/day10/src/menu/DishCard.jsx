import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useCart } from '../cart/CartContext';

export function DishCard({ dish }) {
  const { addToCart } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(dish, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 900);
  }

  // Emoji mapping for authentic visuals
  const getDishEmoji = (name) => {
    if (name.includes('Doro')) return '🍗';
    if (name.includes('Shiro')) return '🍲';
    if (name.includes('Kitfo')) return '🥩';
    if (name.includes('Tibs')) return '🥘';
    if (name.includes('Firfir')) return '🍳';
    if (name.includes('Beyaynetu')) return '🍱';
    if (name.includes('Misir')) return '🥣';
    if (name.includes('Gomen')) return '🥬';
    if (name.includes('Kinche')) return '🥣';
    if (name.includes('Buna')) return '☕';
    if (name.includes('Spris')) return '🥤';
    return '🍽️';
  };

  return (
    <article className="dish-card">
      <Link to={`/menu/${dish.id}`} aria-label={`View full details for ${dish.name}`}>
        <div className="dish-card-media">
          <span className="dish-emoji" role="img" aria-hidden="true">
            {getDishEmoji(dish.name)}
          </span>
          <div className="dish-card-badges">
            {dish.badge && <Badge variant="amber">{dish.badge}</Badge>}
            {dish.spicy && <Badge variant="berbere">Spicy 🔥</Badge>}
          </div>
          <div className="dish-card-price-pill">{dish.price} ETB</div>
        </div>
      </Link>

      <div className="dish-card-body">
        <Link to={`/menu/${dish.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="dish-card-title">{dish.name}</h3>
        </Link>
        <p className="dish-card-desc">{dish.description}</p>

        <div className="dish-card-meta">
          <span>⏱️ {dish.prepTime || '15 mins'}</span>
          <span>🔥 {dish.spicinessLevel || 'Mild'}</span>
          <span>⭐ {dish.rating || '4.8'}</span>
        </div>

        <div className="dish-card-actions">
          <Link to={`/menu/${dish.id}`} style={{ flex: 1 }}>
            <Button variant="secondary" size="sm" style={{ width: '100%' }}>
              Details
            </Button>
          </Link>
          <Button
            variant={addedAnimation ? 'outline' : 'primary'}
            size="sm"
            onClick={handleQuickAdd}
            aria-label={`Add ${dish.name} to order`}
          >
            {addedAnimation ? '✓ Added!' : '+ Add'}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default DishCard;
