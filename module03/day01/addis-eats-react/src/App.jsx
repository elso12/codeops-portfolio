import { useState } from 'react';
import Dish from './Dish.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import menuData from './menu.json';

function Header() {
  return (
    <header>
      <h1>Addis Eats</h1>
    </header>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  function addToCart(selectedDish) {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === selectedDish.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === selectedDish.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prevCart, { ...selectedDish, qty: 1 }];
    });
  }

  function removeFromCart(dishId) {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === dishId);
      
      if (existingItem.qty === 1) {
        return prevCart.filter(item => item.id !== dishId);
      }
      
      return prevCart.map(item =>
        item.id === dishId
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
          <h2>Menu</h2>
          <section className="menu-grid">
            {menuData.map(dish => (
              <Dish 
                key={dish.id} 
                id={dish.id}
                name={dish.name} 
                price={dish.price}
                category={dish.category}
                spicy={dish.spicy}
                onAdd={() => addToCart(dish)}
              />
            ))}
          </section>
        </main>
        
        <Sidebar cart={cart} onRemove={removeFromCart} />
      </div>

      <Footer />
    </div>
  )
}