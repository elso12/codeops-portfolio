import { useState } from 'react';

export default function Sidebar({ cart, onRemove }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  function handleCheckout(e) {
    e.preventDefault();
    alert(`Order placed for ${fullName}!\nTotal: ${total} ETB\nPhone: ${phone}`);
    setFullName('');
    setPhone('');
  }

  return (
    <aside className="sidebar">
      <h2>Your Order</h2>
      
      <ul className="cart-list">
        {cart.length === 0 ? (
          <li className="empty-state">Your cart is empty.</li>
        ) : (
          cart.map(item => (
            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px dashed #E2E8F0' }}>
              <span>{item.qty}x {item.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>{item.price * item.qty} ETB</span>
                <button 
                  onClick={() => onRemove(item.id)} 
                  style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  -
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      
      <div className="cart-total">Total: {total} ETB</div>

      <form className="checkout-form" onSubmit={handleCheckout}>
        <h3>Checkout (TeleBirr)</h3>
        
        <label>
          Full Name
          <input 
            type="text" 
            placeholder="e.g. Abebe Bikila" 
            disabled={cart.length === 0}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>
        
        <label>
          Phone Number (TeleBirr)
          <input 
            type="tel" 
            placeholder="09xxxxxxxx or +2519xxxxxxxx" 
            disabled={cart.length === 0}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        
        <button type="submit" className="btn-checkout" disabled={cart.length === 0}>
          Place Order
        </button>
      </form>
    </aside>
  );
}