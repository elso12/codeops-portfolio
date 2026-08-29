import { useState } from 'react';
import { Header, Footer } from './components/layout';
import { Menu } from './components/menu';
import { OrderForm } from './components/order';

export default function App() {
  // Step 4: Keep a running order total and show it in ETB as dishes are added.
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  // Console-log state at the top of the component to understand re-rendering.
  console.log("App rendered — orderTotal:", orderTotal, "orderCount:", orderCount);

  function handleAddToOrder(dish) {
    setOrderTotal((prev) => prev + dish.price);
    setOrderCount((prev) => prev + 1);
  }

  return (
    <div className="app-container">
      <Header orderTotal={orderTotal} />

      <div className="layout-grid">
        <main>
          {/* Step 2: Menu holds the lifted category state, passes to CategoryBar and DishList */}
          <Menu onAddToOrder={handleAddToOrder} />
        </main>

        {/* Sidebar: running total + validated delivery form */}
        <aside className="sidebar">
          <h2>Your Order</h2>

          {/* Step 4: Running order total in ETB. */}
          <div className="cart-total">
            {orderCount === 0
              ? "No items yet"
              : `${orderCount} item${orderCount > 1 ? "s" : ""} — ${orderTotal} ETB`}
          </div>

          {/* Step 5 & 6: Controlled form with TeleBirr validation. */}
          <OrderForm total={orderTotal} itemCount={orderCount} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
