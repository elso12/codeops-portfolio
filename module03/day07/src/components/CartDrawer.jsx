import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  const [orderId, setOrderId] = useState('');
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // React Hook Form for Checkout
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.name || '',
      customerPhone: user?.phone || '',
      deliveryAddress: user?.address || '',
      paymentMethod: 'telebirr'
    }
  });

  // Sync prefilled data when user logs in or switches to checkout
  useEffect(() => {
    if (user) {
      if (user.name) setValue('customerName', user.name, { shouldValidate: true });
      if (user.phone) setValue('customerPhone', user.phone, { shouldValidate: true });
      if (user.address && diningType === 'delivery') {
        setValue('deliveryAddress', user.address, { shouldValidate: true });
      }
    }
    if (diningType === 'dine-in') {
      setValue('deliveryAddress', 'Main Dining Room (Mesob Table)', { shouldValidate: true });
    } else if (diningType === 'takeout') {
      setValue('deliveryAddress', 'Takeaway Pickup Counter', { shouldValidate: true });
    }
  }, [user, checkoutStep, diningType, setValue]);

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
    setCheckoutStep('checkout');
  };

  const onCheckoutSubmit = (formData) => {
    const finalAddress = formData.deliveryAddress?.trim() || 
      (diningType === 'dine-in' ? 'Main Dining Room (Mesob Table)' : diningType === 'takeout' ? 'Takeaway Pickup Counter' : 'Bole, Addis Ababa');
    
    const newOrderId = `MH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrderObj = {
      id: newOrderId,
      customer: formData.customerName,
      phone: formData.customerPhone,
      address: finalAddress,
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
      address: finalAddress,
      dining: diningType,
      payment: formData.paymentMethod,
      total: grandTotalETB
    });

    if (addOrder) {
      addOrder(newOrderObj);
    }

    setCheckoutStep('success');
    clearCart();
    reset();
  };

  const handleCloseAll = () => {
    setCheckoutStep('cart');
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
                          <span className="cart-item-price">
                            ETB {(item.priceETB * item.quantity).toLocaleString()}
                          </span>
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

        {/* STEP 2: CHECKOUT FORM WITH REACT-HOOK-FORM & ZOD VALIDATION */}
        {checkoutStep === 'checkout' && (
          <form className="checkout-step-view" onSubmit={handleSubmit(onCheckoutSubmit)} noValidate>
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
                  {...register('customerName')}
                />
                {errors.customerName && (
                  <span className="field-error-msg"><FiAlertCircle /> {errors.customerName.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number (Local or International) *</label>
                <input 
                  type="tel" 
                  placeholder="+251 91 123 4567 or +1 (555) 019-2834"
                  {...register('customerPhone')}
                />
                {errors.customerPhone && (
                  <span className="field-error-msg"><FiAlertCircle /> {errors.customerPhone.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>{diningType === 'delivery' ? 'Delivery Address *' : 'Table Preference / Seating'}</label>
                <input 
                  type="text" 
                  placeholder={diningType === 'delivery' ? "e.g. Bole Atlas, house 412" : "e.g. Round Mesob Hearth, VIP Terrace"}
                  {...register('deliveryAddress')}
                />
                {errors.deliveryAddress && (
                  <span className="field-error-msg"><FiAlertCircle /> {errors.deliveryAddress.message}</span>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="form-group">
                <label>Select Payment Method</label>
                <div className="payment-options">
                  <label className="payment-pill">
                    <input 
                      type="radio" 
                      value="telebirr"
                      {...register('paymentMethod')}
                    />
                    <div className="payment-label">
                      <strong>telebirr</strong>
                      <span>ቴሌብር ክፍያ</span>
                    </div>
                  </label>

                  <label className="payment-pill">
                    <input 
                      type="radio" 
                      value="cbe"
                      {...register('paymentMethod')}
                    />
                    <div className="payment-label">
                      <strong>CBE Birr</strong>
                      <span>የኢትዮጵያ ንግድ ባንክ</span>
                    </div>
                  </label>

                  <label className="payment-pill">
                    <input 
                      type="radio" 
                      value="cash"
                      {...register('paymentMethod')}
                    />
                    <div className="payment-label">
                      <strong>Cash / Card</strong>
                      <span>Pay at Table / Door</span>
                    </div>
                  </label>
                </div>
                {errors.paymentMethod && (
                  <span className="field-error-msg"><FiAlertCircle /> {errors.paymentMethod.message}</span>
                )}
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
                An SMS confirmation with live order tracking has been sent to <strong>{placedOrderDetails?.phone}</strong>. Estimated preparation time is <strong>25–35 minutes</strong>.
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
