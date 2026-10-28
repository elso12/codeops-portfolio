import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchDishById } from '../api/menu';
import { useCart } from '../cart/CartContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

export function DishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchDishById(id, { signal: controller.signal })
      .then((data) => {
        if (!active) return;
        if (!data) {
          setError(`No dish found with reference #${id}.`);
        } else {
          setDish(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Unable to retrieve dish details.');
        setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  function handleAddToCart() {
    if (!dish) return;
    addToCart(dish, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  }

  const getDishEmoji = (name = '') => {
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <Spinner size="lg" label="Loading authentic dish recipe..." />
        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
          Retrieving recipe specifications & culinary history...
        </p>
      </div>
    );
  }

  // Failure path testing: Unknown dish id
  if (error || !dish) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <Alert
          variant="error"
          title="Dish Reference Not Found"
          action={
            <Button variant="secondary" size="sm" onClick={() => navigate('/menu')}>
              Return to Menu
            </Button>
          }
        >
          {error || `We could not locate dish reference #${id} in our Addis Ababa kitchens.`}
        </Alert>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/menu">
            <Button variant="primary">Browse Full Addis Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <Link to="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
        <span style={{ margin: '0 0.5rem', color: 'var(--color-border)' }}>/</span>
        <Link to="/menu" style={{ color: 'var(--color-text-muted)' }}>Menu</Link>
        <span style={{ margin: '0 0.5rem', color: 'var(--color-border)' }}>/</span>
        <span style={{ color: 'var(--color-amber)' }}>{dish.name}</span>
      </nav>

      {addedNotice && (
        <Alert variant="success" title="Added to Order!">
          {quantity} &times; {dish.name} added to your cart ({dish.price * quantity} ETB).{' '}
          <Link to="/cart" style={{ textDecoration: 'underline', fontWeight: 700 }}>
            View Cart & Checkout &rarr;
          </Link>
        </Alert>
      )}

      <div className="dish-detail-container">
        {/* Visual Media Column */}
        <div className="dish-detail-media">
          <span className="dish-detail-emoji" role="img" aria-label={dish.name}>
            {getDishEmoji(dish.name)}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Badge variant="amber">{dish.category}</Badge>
            {dish.badge && <Badge variant="neutral">{dish.badge}</Badge>}
            {dish.spicy && <Badge variant="berbere">Spicy Mitmita / Berbere</Badge>}
          </div>
        </div>

        {/* Content Column */}
        <div className="dish-detail-content">
          <h1 className="dish-detail-title">{dish.name}</h1>
          <div className="dish-detail-price">{dish.price} ETB</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {dish.description}
          </p>

          <div className="detail-section-title">Ingredients & Origins</div>
          <div className="ingredients-list">
            {(dish.ingredients || ['Authentic Highland Herbs', 'Niter Kibbeh', 'Pure Teff Injera']).map((ing) => (
              <span key={ing} className="ingredient-chip">
                {ing}
              </span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: 'var(--color-surface-raised)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Prep Time</div>
              <div style={{ fontWeight: 700 }}>{dish.prepTime || '20 mins'}</div>
            </div>
            <div style={{ background: 'var(--color-surface-raised)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Spice Level</div>
              <div style={{ fontWeight: 700, color: dish.spicy ? 'var(--color-berbere)' : 'var(--color-text-primary)' }}>
                {dish.spicinessLevel || 'Mild'}
              </div>
            </div>
            <div style={{ background: 'var(--color-surface-raised)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Allergens</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                {dish.allergens && dish.allergens.length > 0 ? dish.allergens.join(', ') : 'None'}
              </div>
            </div>
          </div>

          {/* Stepper and Add to Cart */}
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div className="quantity-stepper">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="stepper-value" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className="stepper-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              style={{ flex: 1, minWidth: '220px' }}
              onClick={handleAddToCart}
            >
              Add to Order &bull; {dish.price * quantity} ETB
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DishDetail;
