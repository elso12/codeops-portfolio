import React, { useState, useRef } from 'react';
import { validate, AREAS } from './validate.js';
import Field from './Field.jsx';
import { placeOrder, ApiError } from '../api/orders.js';

const TOTAL_ETB = 730; // 680 ETB items + 50 ETB delivery

/**
 * Checkout.jsx — The Addis Eats Checkout
 * 
 * Features:
 * 1. Single state object controlling all fields (name, phone, area, notes).
 * 2. Pure validate(form) derived synchronously during every render pass.
 * 3. Humane timing: errors appear only after blur, then update live on correction.
 * 4. Full accessibility: labels, aria-invalid, aria-describedby, role="alert", focus on error.
 * 5. Honest six states: pristine, dirty, invalid, submitting, failed, succeeded.
 * 6. Never clears inputs on failure; keeps all values and moves focus to the first problem.
 * 7. Submitting flag disables button, prevents double orders, and shows the ETB total in its label.
 */
export default function Checkout() {
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

  // 4. Exercise 7: Toggle to simulate failed request / 422 response
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

  // Pure validation derived on EVERY render — zero desynchronization possible
  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;

  // Single change handler using computed property key
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear top-level server error banner once user starts modifying fields
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

  // Helper to determine if an error should be visible
  const isFieldInvalid = (fieldName) => {
    return Boolean((touched[fieldName] || submitAttempted) && errors[fieldName]);
  };

  // Focus the first problematic field
  const focusFirstInvalidField = (errorsToInspect = errors) => {
    const firstBadField = Object.keys(errorsToInspect)[0];
    if (firstBadField && fieldRefs[firstBadField]?.current) {
      fieldRefs[firstBadField].current.focus();
    } else if (firstBadField) {
      document.getElementById(firstBadField)?.focus();
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Guard against double click / concurrent execution
    if (isSubmitting) return;

    setSubmitAttempted(true);
    setServerError(null);

    // Mark all visited fields so unblurred empty fields show their errors
    setTouched({
      name: true,
      phone: true,
      area: true,
      notes: true,
    });

    // If client validation fails, halt immediately and focus the first issue
    if (hasErrors) {
      focusFirstInvalidField(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Send order request to simulated server
      const createdOrder = await placeOrder(
        { ...form, totalETB: TOTAL_ETB },
        { simulateFailure }
      );

      // Succeeded state
      setOrderReceipt(createdOrder);
    } catch (err) {
      // Failed state: KEEP EVERY VALUE in form, explain why, and focus bad field
      if (err instanceof ApiError && err.status === 422) {
        setServerError(err.message);
        // If server identified a specific invalid field, focus it
        if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
          const firstServerField = Object.keys(err.fieldErrors)[0];
          setTouched((prev) => ({ ...prev, [firstServerField]: true }));
          fieldRefs[firstServerField]?.current?.focus();
        } else {
          focusFirstInvalidField();
        }
      } else {
        setServerError(err.message || 'Network timeout: could not connect to Addis Eats server.');
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

  // 6. Succeeded state view
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

        <button type="button" className="btn-secondary" onClick={handleReset}>
          Place Another Order
        </button>
      </div>
    );
  }

  return (
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

      {/* Accessible Error Summary for Screen Readers & Keyboard Users (Day 33 Slide 18) */}
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

        {/* Submit Button with Disabled State and Dynamic ETB Label (Exercise 6) */}
        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              <span>Placing Order ({TOTAL_ETB} ETB)...</span>
            </>
          ) : (
            <>
              <span aria-hidden="true">🛍️</span>
              <span>Order Now · {TOTAL_ETB} ETB</span>
            </>
          )}
        </button>
      </form>

      {/* Interactive Simulation Controls for Grading & Verification */}
      <div className="simulation-bar" role="region" aria-label="Testing Tools">
        <div className="simulation-bar-header">
          <span aria-hidden="true">⚙️</span>
          <span>Testing Controls · Exercise 7 Failure Path</span>
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
  );
}
