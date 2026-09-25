import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getDishImage, DEFAULT_FALLBACK_IMAGE } from '../services/api';
import { checkoutSchema } from '../utils/validationSchemas';
import { 
  FiX, 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiShoppingBag, 
  FiCheckCircle, 
  FiArrowRight,
  FiTruck,
  FiHome,
  FiCoffee,
  FiUser,
  FiAlertCircle
} from 'react-icons/fi';
import { GiCookingPot } from 'react-icons/gi';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotalETB, 
    deliveryFee, 
    grandTotalETB,
    diningType,
    setDiningType,
    addOrder
  } = useCart();

  const { user, openAuthModal } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('telebirr'); // 'telebirr' | 'cbe' | 'cash'
  const [validationErrors, setValidationErrors] = useState({});
  const [orderId, setOrderId] = useState('');
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // Sync inputs with logged-in user profile on load or auth change
  useEffect(() => {
    if (user) {
      setCustomerName((prev) => prev || user.name || '');
      setCustomerPhone((prev) => prev || user.phone || '');
      setDeliveryAddress((prev) => prev || user.address || '');
    }
  }, [user, checkoutStep]);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleProceedCheckout = () => {
    if (cart.length === 0) return;
    setValidationErrors({});
    setCheckoutStep('checkout');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const formData = {
      customerName: customerName || user?.name || '',
      customerPhone: customerPhone || user?.phone || '',
      deliveryAddress: deliveryAddress || user?.address || '',
      paymentMethod
    };

    // Zod international validation check
    const validationResult = checkoutSchema.safeParse(formData);
    if (!validationResult.success) {
      const formattedErrors = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) formattedErrors[err.path[0]] = err.message;
      });
      setValidationErrors(formattedErrors);
      return;
    }

    setValidationErrors({});
    const newOrderId = `MH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrderObj = {
      id: newOrderId,
      customer: formData.customerName,
      phone: formData.customerPhone,
      address: formData.deliveryAddress,
      diningType,
      payment: formData.paymentMethod,
      totalETB: grandTotalETB,
      items: cart.map((item) => `${item.nameEn} (x${item.quantity})`),
      placedAt: 'Just now',
      estimatedTime: '25–35 mins',
      stepIndex: 0
    };

    setOrderId(newOrderId);
    setPlacedOrderDetails({
      id: newOrderId,
      name: formData.customerName,
      phone: formData.customerPhone,
      address: formData.deliveryAddress,
      dining: diningType,
      payment: formData.paymentMethod,
      total: grandTotalETB
    });

    if (addOrder) {
      addOrder(newOrderObj);
    }

    setCheckoutStep('success');
    clearCart();
  };

  const handleCloseAll = () => {
    setCheckoutStep('cart');
    setValidationErrors({});
    closeCart();
  };

  return (
    <div className="modal-backdrop" onClick={handleCloseAll} role="dialog" aria-modal="true">
      <div 
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-box">
            <FiShoppingBag className="header-bag-icon" />
            <div>
              <h3>Your Feast Order</h3>
              <span className="drawer-subhead amharic-text">የእርስዎ ትዕዛዝ</span>
            </div>
          </div>
          <button 
            className="drawer-close-btn"
            onClick={handleCloseAll}
            aria-label="Close cart"
          >
            <FiX />
          </button>
        </div>

        {/* STEP 1: CART ITEMS */}
        {checkoutStep === 'cart' && (
          <>
            {/* Dining Type Selector */}
            <div className="dining-type-selector">
              <button 
                className={`type-tab ${diningType === 'dine-in' ? 'active' : ''}`}
                onClick={() => setDiningType('dine-in')}
              >
                <FiHome /> Dine-In Table
              </button>
              <button 
                className={`type-tab ${diningType === 'delivery' ? 'active' : ''}`}
                onClick={() => setDiningType('delivery')}
              >
                <FiTruck /> Addis Delivery
              </button>
              <button 
                className={`type-tab ${diningType === 'takeout' ? 'active' : ''}`}
                onClick={() => setDiningType('takeout')}
              >
                <FiCoffee /> Takeaway
              </button>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="empty-cart-view">
                <GiCookingPot className="empty-cart-icon" />
                <h4>Your Mesob is Empty</h4>
                <p>Add some slow-cooked wats, tender tibs, or fresh tej to begin your feast.</p>
                <button className="btn-primary" onClick={closeCart}>
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="cart-items-scroll">
                {cart.map((item) => {
                  const img = getDishImage(item);
                  return (
                    <div key={item.id} className="cart-item-row">
                      <img 
                        src={img} 
                        alt={item.nameEn} 
                        className="cart-item-img" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                        }}
                      />
                      
                      <div className="cart-item-details">
                        <div className="cart-item-title-row">
                          <h4 className="cart-item-title">{item.nameEn}</h4>
                          <button 
                            className="remove-item-btn"
                            onClick={() => removeFromCart(item.id)}
                            title="Remove item"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                        <span className="cart-item-amharic amharic-text">{item.nameAm}</span>

                        {item.note && (
                          <div className="cart-item-note">Note: {item.note}</div>
                        )}

                        <div className="cart-item-action-row">
                          <div className="cart-qty-ctrl">
                            <button onClick={() => updateQuantity(item.id, -1)}>
                              <FiMinus />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}>
                              <FiPlus />
                            </button>
                          </div>
                          <div className="cart-item-price">
                            ETB {(item.priceETB * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cart Footer Calculation */}
            {cart.length > 0 && (
              <div className="drawer-footer">
                <div className="bill-breakdown">
                  <div className="bill-row">
                    <span>Subtotal</span>
                    <span>ETB {subtotalETB.toLocaleString()}</span>
                  </div>
                  {diningType === 'delivery' && (
                    <div className="bill-row">
                      <span>Delivery Fee (Addis Ababa)</span>
                      <span>ETB {deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="bill-row muted">
                    <span>VAT & Hospitality Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="bill-row grand-total">
                    <span>Total</span>
                    <span>ETB {grandTotalETB.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  className="btn-primary checkout-btn"
                  onClick={handleProceedCheckout}
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT FORM WITH INTERNATIONAL ZOD VALIDATION */}
        {checkoutStep === 'checkout' && (
          <form className="checkout-step-view" onSubmit={handlePlaceOrder}>
            <div className="checkout-header-summary">
              <button 
                type="button" 
                className="back-to-cart-btn"
                onClick={() => setCheckoutStep('cart')}
              >
                ← Back to Cart
              </button>
              <h4>Order Summary: ETB {grandTotalETB.toLocaleString()}</h4>
            </div>

            {/* Auth Checkout Status Banner */}
            {user ? (
              <div className="cart-auth-banner logged-in">
                <div className="user-avatar">{user.avatar}</div>
                <div>
                  <strong>Signed in as {user.name}</strong>
                  <p>Your saved contact details have been pre-filled.</p>
                </div>
              </div>
            ) : (
              <div className="cart-auth-banner guest">
                <div>
                  <strong>Checking out as Guest</strong>
                  <p>Have an account? Sign in for 1-click checkout.</p>
                </div>
                <button 
                  type="button" 
                  className="btn-link-signin"
                  onClick={() => openAuthModal('login')}
                >
                  <FiUser /> Sign In
                </button>
              </div>
            )}

            <div className="checkout-fields">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Almaz Bekele or Sarah Jenkins"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                {validationErrors.customerName && (
                  <span className="field-error-msg"><FiAlertCircle /> {validationErrors.customerName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number (Local or International) *</label>
                <input 
                  type="tel" 
                  placeholder="+251 91 123 4567 or +1 (555) 019-2834"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                {validationErrors.customerPhone && (
                  <span className="field-error-msg"><FiAlertCircle /> {validationErrors.customerPhone}</span>
                )}
              </div>

              {diningType === 'delivery' ? (
                <div className="form-group">
                  <label>Delivery Address *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bole Atlas, behind 2000 Habesha, House 412"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  {validationErrors.deliveryAddress && (
                    <span className="field-error-msg"><FiAlertCircle /> {validationErrors.deliveryAddress}</span>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label>Table Preference / Seating</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Round Mesob Hearth, VIP Balcony, Terrace"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  {validationErrors.deliveryAddress && (
                    <span className="field-error-msg"><FiAlertCircle /> {validationErrors.deliveryAddress}</span>
                  )}
                </div>
              )}

              {/* Payment Method Selector */}
              <div className="form-group">
                <label>Select Payment Method</label>
                <div className="payment-options">
                  <label className={`payment-pill ${paymentMethod === 'telebirr' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="telebirr"
                      checked={paymentMethod === 'telebirr'}
                      onChange={() => setPaymentMethod('telebirr')}
                    />
                    <div className="payment-label">
                      <strong>telebirr</strong>
                      <span>ቴሌብር ክፍያ</span>
                    </div>
                  </label>

                  <label className={`payment-pill ${paymentMethod === 'cbe' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cbe"
                      checked={paymentMethod === 'cbe'}
                      onChange={() => setPaymentMethod('cbe')}
                    />
                    <div className="payment-label">
                      <strong>CBE Birr</strong>
                      <span>የኢትዮጵያ ንግድ ባንክ</span>
                    </div>
                  </label>

                  <label className={`payment-pill ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    />
                    <div className="payment-label">
                      <strong>Cash / Card</strong>
                      <span>Pay at Table / Door</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="checkout-actions">
              <button type="submit" className="btn-primary place-order-btn">
                <span>Confirm & Place Order (ETB {grandTotalETB.toLocaleString()})</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER SUCCESS */}
        {checkoutStep === 'success' && (
          <div className="order-success-view">
            <div className="success-icon-box">
              <FiCheckCircle />
            </div>
            <span className="badge-hearth">ORDER CONFIRMED</span>
            <h2>Thank You, {placedOrderDetails?.name || 'for Your Order'}!</h2>
            <span className="amharic-sub amharic-text">ትዕዛዝዎ በተሳካ ሁኔታ ተቀባይነት አግኝቷል • እናመሰግናለን!</span>

            <div className="order-ref-card">
              <span className="ref-label">Order Reference</span>
              <span className="ref-number">{orderId}</span>

              <div className="order-receipt-summary">
                <div className="receipt-row">
                  <span>Dining Option:</span>
                  <strong>
                    {placedOrderDetails?.dining === 'delivery' 
                      ? 'Addis Delivery' 
                      : placedOrderDetails?.dining === 'takeout' 
                      ? 'Takeaway' 
                      : 'Dine-In Table'}
                  </strong>
                </div>

                {placedOrderDetails?.address && (
                  <div className="receipt-row">
                    <span>{placedOrderDetails?.dining === 'delivery' ? 'Delivery Address:' : 'Table Preference:'}</span>
                    <strong>{placedOrderDetails.address}</strong>
                  </div>
                )}

                <div className="receipt-row">
                  <span>Payment Method:</span>
                  <strong>
                    {placedOrderDetails?.payment === 'telebirr' 
                      ? 'telebirr (ቴሌብር)' 
                      : placedOrderDetails?.payment === 'cbe' 
                      ? 'CBE Birr (ንግድ ባንክ)' 
                      : 'Cash / Card on Delivery'}
                  </strong>
                </div>

                <div className="receipt-row total-row">
                  <span>Total Paid:</span>
                  <strong className="receipt-total-amt">
                    ETB {placedOrderDetails?.total?.toLocaleString()}
                  </strong>
                </div>
              </div>

              <p className="order-sms-notice">
                An SMS confirmation with live order tracking has been sent to <strong>{placedOrderDetails?.phone || customerPhone}</strong>. Estimated preparation time is <strong>25–35 minutes</strong>.
              </p>
            </div>

            <button className="btn-primary" onClick={handleCloseAll}>
              Done • Return to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
