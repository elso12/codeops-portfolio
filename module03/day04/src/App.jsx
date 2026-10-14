import { useState } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Menu from './Menu.jsx';
import OrderForm from './OrderForm.jsx';

export default function App() {
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  function handleAddToOrder(dish) {
    setOrderTotal((prev) => prev + dish.price);
    setOrderCount((prev) => prev + 1);
  }

  return (
    <div className="app-container">
      <Header orderTotal={orderTotal} />

      <div className="layout-grid">
        <main>
          <Menu onAddToOrder={handleAddToOrder} />
        </main>

        <aside className="sidebar">
          <h2>Your Order</h2>
          <div className="cart-total">
            {orderCount === 0
              ? 'No items yet'
              : `${orderCount} item${orderCount > 1 ? 's' : ''} — ${orderTotal} ETB`}
          </div>
          <OrderForm total={orderTotal} itemCount={orderCount} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
