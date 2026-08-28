import { useState } from 'react';
import Menu from './Menu.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';

function Header() {
  return (
    <header>

      <h1>Addis Eats</h1>
    </header>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  
  // Static filter as requested by the slide instructions. 
  // Change this string to "Main", "Vegetarian", or "Unknown" to test the filter and empty state.
  const activeCategory = "All"; 

  function addToCart(selectedDish) {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.name === selectedDish.name);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.name === selectedDish.name
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prevCart, { ...selectedDish, qty: 1 }];
    });
  }

  function removeFromCart(dishName) {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.name === dishName);
      
      if (existingItem.qty === 1) {
        return prevCart.filter(item => item.name !== dishName);
      }
      
      return prevCart.map(item =>
        item.name === dishName
          ? { ...item, qty: item.qty - 1 }
          : item
      );
    });
  }

  return (
    <div className="app-container">
      <Header />
      
      <div className="layout-grid">
        <main>
          <h2>Menu ({activeCategory})</h2>
          <Menu categoryFilter={activeCategory} onAddToCart={addToCart} />
        </main>
        
        <Sidebar cart={cart} onRemove={removeFromCart} />
      </div>

      <Footer />
    </div>
  )
}