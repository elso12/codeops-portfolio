'use client';

import { useState } from 'react';
import { useCart } from '../../lib/CartContext';

/**
 * AddToCartButton - Client Component Leaf
 * 
 * Mentioned in Reading Sheet Part 3 ("Addis Eats, sorted"):
 * "AddToCartButton | Client | onClick, and writes to the cart store"
 * 
 * Being an isolated leaf, it encapsulates the interactive event handler (onClick)
 * and cart context mutation without forcing its parent server components
 * (DishList or DishDetailPage) onto the client bundle.
 */
export default function AddToCartButton({ dish }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="btn btn-primary"
      style={{
        padding: '0.5rem 0.9rem',
        fontSize: '0.85rem',
        background: added ? 'var(--color-kale)' : undefined,
        borderColor: added ? 'var(--color-kale)' : undefined,
        transition: 'all 0.2s ease'
      }}
      aria-label={`Add ${dish.name} to cart`}
    >
      {added ? '✓ Added!' : 'Add +'}
    </button>
  );
}
