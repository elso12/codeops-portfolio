import React, { useState, useMemo } from 'react';
import DishCard from './DishCard';
import { 
  FiSearch, 
  FiCheck,
  FiRefreshCw
} from 'react-icons/fi';
import { GiPlantRoots, GiFireBowl, GiWineGlass, GiCookingPot, GiMeat } from 'react-icons/gi';

export default function MenuSection({ menu, loading, searchQuery, setSearchQuery }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [fastingOnly, setFastingOnly] = useState(false);
  const [specialsOnly, setSpecialsOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc'

  const categories = [
    { id: 'All', label: 'All Dishes', amharic: 'ሁሉንም', icon: GiCookingPot },
    { id: 'Traditional Stews & Wat', label: 'Traditional Stews', amharic: 'ወጦች', icon: GiCookingPot },
    { id: 'Tibs & Grills', label: 'Tibs & Grills', amharic: 'ጥብሶች', icon: GiMeat },
    { id: 'Raw & Cured Delicacies / Kitfo', label: 'Kitfo & Raw', amharic: 'ክትፎ', icon: GiFireBowl },
    { id: 'Fasting & Vegan / Tsom', label: 'Fasting & Vegan', amharic: 'የጾም', icon: GiPlantRoots },
    { id: 'Beverages & Tej', label: 'Beverages & Tej', amharic: 'መጠጦች', icon: GiWineGlass }
  ];

  // Filtered and Sorted dishes
  const filteredDishes = useMemo(() => {
    let result = [...menu];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Fasting (Tsom) filter
    if (fastingOnly) {
      result = result.filter((item) => item.isFasting);
    }

    // Specials filter
    if (specialsOnly) {
      result = result.filter((item) => item.isSpecial);
    }

    // Search query filter (matches English, Amharic, description, ingredients)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const matchEn = item.nameEn ? item.nameEn.toLowerCase().includes(q) : false;
        const matchAm = item.nameAm ? item.nameAm.includes(q) : false;
        const matchDesc = item.description ? item.description.toLowerCase().includes(q) : false;
        const matchCategory = item.category ? item.category.toLowerCase().includes(q) : false;
        const matchIngredients = item.ingredients 
          ? (Array.isArray(item.ingredients) 
              ? item.ingredients.some(ing => ing && ing.toLowerCase().includes(q))
              : String(item.ingredients).toLowerCase().includes(q))
          : false;
        return matchEn || matchAm || matchDesc || matchCategory || matchIngredients;
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.priceETB - b.priceETB);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.priceETB - a.priceETB);
    }

    return result;
  }, [menu, activeCategory, fastingOnly, specialsOnly, searchQuery, sortBy]);

  return (
    <section className="menu-section" id="menu">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="badge-hearth">
            <GiCookingPot />
            <span>AUTHENTIC HIGHLAND BANQUET</span>
          </div>
          <h2 className="section-title">
            The Complete <span className="title-highlight">Banquet Menu</span>
          </h2>
          <span className="section-amharic amharic-text">ሙሉ የሐበሻ የምግብ ዝርዝር</span>
          <p className="section-subtitle">
            Every dish is served on fresh 100% whole-grain Teff Injera, accompanied by house-made Ayib and hot Awaze paste.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs-wrapper">
          <div className="category-tabs">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon className="tab-icon" />
                  <span className="tab-label">{cat.label}</span>
                  <span className="tab-amharic amharic-text">{cat.amharic}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="menu-controls-bar">
          <div className="filter-toggles">
            {/* Fasting (Tsom) Toggle */}
            <button
              className={`filter-pill-btn ${fastingOnly ? 'active-forest' : ''}`}
              onClick={() => setFastingOnly(!fastingOnly)}
            >
              <GiPlantRoots />
              <span>Fasting / Vegan (የጾም)</span>
              {fastingOnly && <FiCheck className="check-icon" />}
            </button>

            {/* Specials Toggle */}
            <button
              className={`filter-pill-btn ${specialsOnly ? 'active-turmeric' : ''}`}
              onClick={() => setSpecialsOnly(!specialsOnly)}
            >
              <span>★ Chef Specials</span>
              {specialsOnly && <FiCheck className="check-icon" />}
            </button>
          </div>

          <div className="controls-right">
            {/* In-Menu Search Input */}
            <div className="menu-search-box">
              <FiSearch className="search-box-icon" />
              <input
                type="text"
                placeholder="Filter by ingredient or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-box">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                aria-label="Sort dishes"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Active Filter Tags */}
        <div className="filter-summary-row">
          <span className="results-count">
            Showing <strong>{filteredDishes.length}</strong> {filteredDishes.length === 1 ? 'dish' : 'dishes'}
          </span>
          {(activeCategory !== 'All' || fastingOnly || specialsOnly || searchQuery) && (
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setActiveCategory('All');
                setFastingOnly(false);
                setSpecialsOnly(false);
                setSearchQuery('');
                setSortBy('default');
              }}
            >
              <FiRefreshCw /> Reset All Filters
            </button>
          )}
        </div>

        {/* Dishes Grid */}
        {loading ? (
          <div className="menu-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="dish-card skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-line" style={{ width: '40%' }} />
                <div className="skeleton-line" style={{ width: '75%' }} />
                <div className="skeleton-line" style={{ width: '50%' }} />
              </div>
            ))}
          </div>
        ) : filteredDishes.length > 0 ? (
          <div className="menu-grid">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <div className="empty-menu-state">
            <GiCookingPot className="empty-state-pot" />
            <h3>No dishes match your current filter</h3>
            <p>Try clearing your search or switching to another category.</p>
            <button 
              className="btn-primary"
              onClick={() => {
                setActiveCategory('All');
                setFastingOnly(false);
                setSpecialsOnly(false);
                setSearchQuery('');
              }}
            >
              Show Full Banquet
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
