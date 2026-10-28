import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryBar from './CategoryBar';
import DishList from './DishList';
import { fetchDishes } from '../api/menu';
import { useFetch } from '../hooks/useFetch';
import { useDebounce } from '../hooks/useDebounce';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import Button from '../ui/Button';

export function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Sync category filter into the URL query string (Day 31 / Section 2)
  const handleSelectCategory = useCallback(
    (newCategory) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (!newCategory || newCategory === 'All') {
          next.delete('category');
        } else {
          next.set('category', newCategory);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  // Data fetching hook with cleanup and abort controller (Day 29 / Day 30)
  const fetcher = useCallback(
    ({ signal }) => {
      return fetchDishes({
        category: categoryParam,
        search: debouncedSearch,
        signal,
      });
    },
    [categoryParam, debouncedSearch]
  );

  const { data: dishes, loading, error, refetch } = useFetch(fetcher, [
    categoryParam,
    debouncedSearch,
  ]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Addis Ababa Culinary Menu
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '700px' }}>
          Explore our handcrafted Ethiopian heritage recipes. From slow-braised Doro Wat to wholesome fasting Beyaynetu, freshly prepared daily with authentic mountain herbs and injera.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="category-bar-header">
        <CategoryBar
          selectedCategory={categoryParam || 'All'}
          onSelectCategory={handleSelectCategory}
        />

        <div className="search-box">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="search-input"
            placeholder="Search wats, tibs, teff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search dishes by name or ingredients"
          />
        </div>
      </div>

      {/* Error State with Retry Button */}
      {error && (
        <Alert
          variant="error"
          title="Could Not Load Menu Dishes"
          action={
            <Button variant="secondary" size="sm" onClick={refetch}>
              Retry Fetch
            </Button>
          }
        >
          {error}. Please check your connection or turn off the Diagnostic Network Failure toggle.
        </Alert>
      )}

      {/* Loading Skeleton / Spinner State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Spinner size="lg" label="Simulating network load & fetching dishes..." />
          <div style={{ marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Retrieving freshly simmered dishes from Addis Eats catalog...
          </div>
        </div>
      )}

      {/* Loaded Dishes or Empty State */}
      {!loading && !error && (
        <DishList
          dishes={dishes || []}
          onResetFilter={() => {
            setSearchTerm('');
            handleSelectCategory('');
          }}
        />
      )}
    </div>
  );
}

export default Menu;
