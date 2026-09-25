import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiClock, FiCheckCircle, FiTruck, FiPackage, FiCoffee } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const STEPS = [
  { label: 'Order Received', desc: 'Kitchen notified & ingredients prepped', icon: FiCheckCircle },
  { label: 'Slow-Simmering Wat', desc: 'Chef preparing spiced stew & pan tibs', icon: FiCoffee },
  { label: 'Injera Packing', desc: 'Warm 100% teff injera wrapped in mesob box', icon: FiPackage },
  { label: 'Out for Courier Delivery', desc: 'Rider en route to your address', icon: FiTruck },
  { label: 'Delivered with Love', desc: 'Enjoy your authentic Habesha banquet!', icon: FiCheckCircle }
];

export default function OrderTrackerModal() {
  const { isTrackerOpen, closeTracker, orders, activeTrackId, setActiveTrackId } = useCart();
  const [searchId, setSearchId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Default to activeTrackId or first order in orders list
  const currentOrderId = searchId || activeTrackId || (orders && orders[0] ? orders[0].id : 'MESOB-8921');
  const activeOrder = orders?.find(o => o.id.toUpperCase() === currentOrderId.toUpperCase()) || orders?.[0];

  useEffect(() => {
    if (activeTrackId) {
      setSearchId(activeTrackId);
    }
  }, [activeTrackId]);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!isTrackerOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeTracker();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTrackerOpen, closeTracker]);

  if (!isTrackerOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const query = searchId.trim().toUpperCase();
    const found = orders?.find(o => o.id.toUpperCase() === query);
    if (found) {
      if (setActiveTrackId) setActiveTrackId(found.id);
    } else {
      setErrorMsg(`No active order found with ID "${query}". Try tracking an active feast order.`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeTracker} role="dialog" aria-modal="true">
      <div className="modal-card tracker-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeTracker} aria-label="Close Order Tracker">
          <FiX />
        </button>

        <div className="tracker-header">
          <h3>Live Order & Feast Tracker</h3>
          <p>Real-time status of your slow-cooked wats and teff injera preparation</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="tracker-search-form">
          <div className="input-with-icon">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Enter Order ID (e.g. MESOB-8921)" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary btn-track">
            Track (ተከታተል)
          </button>
        </form>

        {errorMsg && <div className="tracker-error">{errorMsg}</div>}

        {activeOrder ? (
          <div className="tracker-body">
            {/* Order Info Card */}
            <div className="order-summary-box">
              <div className="order-summary-row">
                <div>
                  <span className="order-id-badge">ID: {activeOrder.id}</span>
                  <strong className="customer-name">{activeOrder.customer}</strong>
                </div>
                <div className="time-badge">
                  <FiClock /> <span>ETA: {activeOrder.estimatedTime}</span>
                </div>
              </div>

              <div className="order-details-meta">
                <p>📍 <strong>Destination:</strong> {activeOrder.address}</p>
                <p>🍲 <strong>Items:</strong> {Array.isArray(activeOrder.items) ? activeOrder.items.join(', ') : activeOrder.items}</p>
                <p>💵 <strong>Total:</strong> {activeOrder.totalETB || activeOrder.total} ETB ({String(activeOrder.diningType || 'delivery').toUpperCase()})</p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="timeline-stepper">
              {STEPS.map((step, idx) => {
                const IconComponent = step.icon;
                const isDone = idx < (activeOrder.stepIndex ?? 1);
                const isCurrent = idx === (activeOrder.stepIndex ?? 1);

                let statusClass = 'pending';
                if (isDone) statusClass = 'completed';
                if (isCurrent) statusClass = 'current';

                return (
                  <div key={idx} className={`timeline-step ${statusClass}`}>
                    <div className="step-circle">
                      <IconComponent />
                    </div>
                    <div className="step-content">
                      <h4 className="step-label">{step.label}</h4>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="tracker-body" style={{ textAlign: 'center', padding: '30px' }}>
            <p>No active orders placed yet.</p>
          </div>
        )}

        <div className="modal-footer-centered">
          <button className="btn-secondary" onClick={closeTracker}>
            Close Tracker Window
          </button>
        </div>
      </div>
    </div>
  );
}
