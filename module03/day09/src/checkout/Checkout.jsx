import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { validate, AREAS } from './validate.js';
import Field from './Field.jsx';
import { placeOrder, ApiError } from '../api/orders.js';
import { useCart } from '../cart/CartContext.jsx';

/**
 * Checkout.jsx - Addis Eats Express Checkout (Day 8 UI & Spec)
 *
 * Requirements:
 * 1. Single state object controlling all fields (name, phone, area, notes).
 * 2. Pure validate(form) derived synchronously during every render pass.
 * 3. Humane timing: errors appear only after blur, then update live on correction.
 * 4. Full accessibility: labels, aria-invalid, aria-describedby, role="alert", focus on error.
 * 5. Honest six states: pristine, dirty, invalid, submitting, failed, succeeded.
 * 6. Never clears inputs on failure; keeps all values and moves focus to the first problem.
 * 7. Submitting flag disables button, prevents double orders, and shows the ETB total in its label.
 * 8. Fully integrated with CartContext while providing seamless fallback preview when empty.
 */
export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();

  // If cart is empty, use sample Ethiopian feast items for demonstration
  const displayItems =
    cart.length > 0
      ? cart
      : [
          { id: 1, name: 'Special Doro Wat', qty: 1, price: 380 },
          { id: 2, name: 'Shiro Tegabino w/ Injera', qty: 1, price: 220 },
          { id: 3, name: 'Traditional Buna Ceremony', qty: 2, price: 65 },
        ];

  const subtotal =
    cart.length > 0
      ? totalPrice
      : displayItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = 50;
  const totalToPay = subtotal + deliveryFee;

  // 1. Single state object for all 4 fields
  const [form, setForm] = useState({
    name: '',
    phone: '',
    area: 'Bole',
    notes: '',
  });

  // 2. Touched tracking to display errors only after field visits
  const [touched, setTouched] = useState({});

  // 3. Form lifecycle states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [orderReceipt, setOrderReceipt] = useState(null);

  // 4. Toggle to simulate failed request / 422 TeleBirr response
  const [simulateFailure, setSimulateFailure] = useState(false);

  // 5. Input refs for keyboard focus management
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const areaRef = useRef(null);
  const notesRef = useRef(null);

  const fieldRefs = {
    name: nameRef,
    phone: phoneRef,
    area: areaRef,
    notes: notesRef,
  };

  // Pure validation derived on EVERY render - zero desynchronization possible
  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;

  // Single change handler using computed property key
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError(null);

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Track visited fields on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Only display errors if field was visited OR user attempted submission
  const isFieldInvalid = (fieldName) => {
    return Boolean((touched[fieldName] || submitAttempted) && errors[fieldName]);
  };

  const focusFirstInvalidField = () => {
    const firstInvalidField = ['name', 'phone', 'area', 'notes'].find((field) => errors[field]);
    if (firstInvalidField && fieldRefs[firstInvalidField]?.current) {
      fieldRefs[firstInvalidField].current.focus();
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setServerError(null);

    // If invalid, focus first invalid field and do not submit
    if (hasErrors) {
      focusFirstInvalidField();
      return;
    }

    setIsSubmitting(true);

    try {
      const receipt = await placeOrder(
        {
          name: form.name,
          phone: form.phone,
          area: form.area,
          notes: form.notes,
          items: displayItems,
          totalETB: totalToPay,
        },
        { simulateFailure }
      );

      setOrderReceipt(receipt);
      clearCart();
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
        if (err.fieldErrors?.phone) {
          setTouched((prev) => ({ ...prev, phone: true }));
          phoneRef.current?.focus();
        } else {
          focusFirstInvalidField();
        }
      } else {
        setServerError('Unexpected network interruption. Your inputs have been preserved.');
        focusFirstInvalidField();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to place another order
  const handleReset = () => {
    setForm({ name: '', phone: '', area: 'Bole', notes: '' });
    setTouched({});
    setSubmitAttempted(false);
    setServerError(null);
    setOrderReceipt(null);
  };

  // Succeeded state view
  if (orderReceipt) {
    return (
      <div className="checkout-card confirmation-container" role="status" aria-live="polite">
        <div className="confirmation-badge" aria-hidden="true">
          ✓
        </div>
        <h2 className="confirmation-title">Order Received!</h2>
        <p className="confirmation-desc">
          Melkam Megeb! Your order has been dispatched to the kitchen.
        </p>

        <div className="receipt-box">
          <div className="receipt-row">
            <span className="receipt-label">Order Reference:</span>
            <span className="receipt-val">{orderReceipt.id}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Customer Name:</span>
            <span className="receipt-val">{orderReceipt.customer.name}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">TeleBirr Phone:</span>
            <span className="receipt-val">{orderReceipt.customer.phone}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Delivery Zone:</span>
            <span className="receipt-val">{orderReceipt.customer.area}</span>
          </div>
          {orderReceipt.customer.notes && (
            <div className="receipt-row">
              <span className="receipt-label">Special Notes:</span>
              <span className="receipt-val">{orderReceipt.customer.notes}</span>
            </div>
          )}
          <div className="receipt-row">
            <span className="receipt-label">Total Amount:</span>
            <span className="receipt-val" style={{ color: 'var(--color-amber)', fontWeight: 800 }}>
              {orderReceipt.totalETB} ETB
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Place Another Order
          </button>
          <Link to="/" className="btn-submit" style={{ width: 'auto', textDecoration: 'none' }}>
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-grid">
      <div className="checkout-main">
        <div className="checkout-card">
          <div className="card-header">
            <h2>Delivery & Payment Information</h2>
            <p>Complete your details for direct TeleBirr settlement and doorstep delivery.</p>
          </div>

          {/* Simulated Failure Banner (Exercise 7) */}
          {serverError && (
            <div role="alert" className="alert-banner alert-banner-error" aria-live="assertive">
              <span className="alert-banner-icon" aria-hidden="true">⚠️</span>
              <div>
                <div className="alert-banner-title">Order Processing Failed</div>
                <div className="alert-banner-desc">{serverError}</div>
              </div>
            </div>
          )}

          {/* Accessible Error Summary for Screen Readers & Keyboard Users */}
          {submitAttempted && hasErrors && (
            <div role="alert" className="alert-banner alert-banner-error" aria-live="polite">
              <span className="alert-banner-icon" aria-hidden="true">⚠️</span>
              <div>
                <div className="alert-banner-title">
                  Please fix {Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'field' : 'fields'}:
                </div>
                <ul style={{ margin: '0.4rem 0 0 1.2rem', fontSize: '0.85rem' }}>
                  {Object.entries(errors).map(([field, msg]) => (
                    <li key={field}>
                      <a
                        href={`#${field}`}
                        onClick={(e) => {
                          e.preventDefault();
                          fieldRefs[field]?.current?.focus();
                        }}
                        style={{ color: '#FEE2E2', textDecoration: 'underline' }}
                      >
                        {msg}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <div className="fields-stack">
              {/* 1. Full Name Field */}
              <Field
                id="name"
                name="name"
                label="Full Name"
                type="text"
                required
                placeholder="e.g. Abebe Bikila"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                touched={isFieldInvalid('name')}
                inputRef={nameRef}
              />

              {/* 2. TeleBirr Phone Number Field */}
              <Field
                id="phone"
                name="phone"
                label="TeleBirr Phone Number"
                type="tel"
                required
                placeholder="0911234567 or +251911234567"
                helperText="10 digits starting with 09... or international +2519..."
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                touched={isFieldInvalid('phone')}
                inputRef={phoneRef}
              />

              {/* 3. Delivery Area Field (Select) */}
              <Field
                id="area"
                name="area"
                label="Delivery Area"
                type="select"
                required
                options={AREAS.map((a) => ({ value: a, label: a }))}
                value={form.area}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.area}
                touched={isFieldInvalid('area')}
                inputRef={areaRef}
              />

              {/* 4. Optional Delivery Notes Field */}
              <Field
                id="notes"
                name="notes"
                label="Delivery Instructions"
                type="textarea"
                rows={3}
                placeholder="Gate code, landmark, or specific drop-off notes..."
                helperText={`${form.notes.length}/200 characters`}
                value={form.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.notes}
                touched={isFieldInvalid('notes')}
                inputRef={notesRef}
              />
            </div>

            {/* Submit Button with Disabled State and Dynamic ETB Label */}
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  <span>Placing Order ({totalToPay} ETB)...</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">💳</span>
                  <span>Order Now • {totalToPay} ETB</span>
                </>
              )}
            </button>
          </form>

          {/* Interactive Simulation Controls */}
          <div className="simulation-bar" role="region" aria-label="Testing Tools">
            <div className="simulation-bar-header">
              <span aria-hidden="true">🧪</span>
              <span>Testing Controls • TeleBirr 422 Rejection Path</span>
            </div>
            <label className="simulation-switch">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
              />
              <span>Simulate failed request (HTTP 422 TeleBirr payment rejection)</span>
            </label>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              When checked, pressing submit simulates an async server rejection: the error reason is displayed, every entered value is preserved in state, and focus moves directly to the phone field.
            </p>
          </div>
        </div>
      </div>

      {/* Order Basket Sidebar (Day 8 UI) */}
      <aside className="order-summary-card" aria-label="Order Basket">
        <div className="summary-header">
          <h3>Order Basket</h3>
          <span className="badge-pill">{displayItems.reduce((acc, i) => acc + i.qty, 0)} Items</span>
        </div>

        <div className="items-list">
          {displayItems.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <span className="item-qty">{item.qty}x</span>
                <span className="item-name">{item.name}</span>
              </div>
              <span className="item-price">{item.price * item.qty} ETB</span>
            </div>
          ))}
        </div>

        <div className="calc-breakdown">
          <div className="calc-row">
            <span>Subtotal</span>
            <span>{subtotal} ETB</span>
          </div>
          <div className="calc-row">
            <span>Doorstep Delivery (Addis Ababa)</span>
            <span>{deliveryFee} ETB</span>
          </div>
          <div className="calc-total">
            <span className="total-label">Total to Pay</span>
            <span className="total-amount">{totalToPay} ETB</span>
          </div>
        </div>

        <div className="telebirr-banner">
          <span style={{ fontSize: '1.4rem' }} aria-hidden="true">📱</span>
          <div>
            <strong>TeleBirr Express Payment</strong>
            <p>Instant SMS payment prompt will be pushed to your phone upon placing order.</p>
          </div>
        </div>

        {/* Key checkpoints from Day 8 */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <div style={{ fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
            Day 8 / 33 Key Checkpoints:
          </div>
          <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <li>Enter submits the form cleanly</li>
            <li>Full keyboard tab navigation</li>
            <li>Untouched fields stay quiet</li>
            <li>Correction clears errors live</li>
            <li>Button disabled during submit</li>
            <li>Zero data loss on failed API</li>
            <li>Accessible in 100% greyscale</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
