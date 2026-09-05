import { useState } from 'react';
import useFetch from './hooks/useFetch.js';
import { useCart } from './cart/CartProvider.jsx';
import Menu from './Menu.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';

function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0); // Header Badge logic

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>Addis Eats</h1>
      <div style={{ backgroundColor: 'white', color: '#2E8B57', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
        🛒 Cart ({itemCount})
      </div>
    </header>
  );
}

export default function App() {
  // Using the custom hook to fetch from our public folder
  const { data: menuData, loading, error } = useFetch('/menu.json');
  const [activeCategory, setActiveCategory] = useState('All'); 

  return (
    <div className="app-container">
      <Header />
      
      <div className="layout-grid">
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Menu ({activeCategory})</h2>
            <select onChange={(e) => setActiveCategory(e.target.value)} style={{ padding: '0.5rem' }}>
              <option value="All">All</option>
              <option value="Main">Main</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Breakfast">Breakfast</option>
            </select>
          </div>

          {loading && <p>Loading menu...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!loading && !error && (
            <Menu categoryFilter={activeCategory} menuData={menuData} />
          )}
        </main>
        
        <Sidebar />
      </div>

      <Footer />
    </div>
  )
}