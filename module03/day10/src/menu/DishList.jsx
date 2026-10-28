import React from 'react';
import DishCard from './DishCard';
import Button from '../ui/Button';

export function DishList({ dishes, onResetFilter }) {
  if (!dishes || dishes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🌾</div>
        <h3 className="empty-state-title">No Dishes Found</h3>
        <p className="empty-state-text">
          No traditional dishes match your selected filter or search term. Try switching categories or clearing search keywords.
        </p>
        {onResetFilter && (
          <Button variant="secondary" onClick={onResetFilter}>
            Show All Dishes
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}

export default DishList;
