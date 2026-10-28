import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { submitOrder } from '../api/orders';
import { validate, DELIVERY_AREAS, PAYMENT_METHODS } from './validate';
import Field from './Field';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

export function Checkout() {
  const { items, subtotalETB, deliveryFeeETB, grandTotalETB, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Controlled form state
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    area: user?.area || 'Bole',
    address: '',
    paymentMethod: 'telebirr',
    notes: '',
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Pure validation derived on render pass
  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Mark all fields as touched to display errors if any
    const allTouched = {
      name: true,
      phone: true,
      area: true,
      address: true,
      paymentMethod: true,
      notes: true,
    };
    setTouched(allTouched);

    if (!isValid) {
      setSubmitError('Please address the highlighted form fields before submitting.');
      return;
    }

    if (items.length === 0) {
      setSubmitError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const orderPayload = {
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          area: form.area,
          address: form.address.trim(),
        },
        paymentMethod: form.paymentMethod,
        notes: form.notes.trim(),
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          lineTotal: i.price * i.qty,
        })),
        financials: {
          subtotalETB,
          deliveryFeeETB,
          grandTotalETB,
        },
      };

      const orderReceipt = await submitOrder(orderPayload);
      clearCart();
      // Navigate to order confirmation
      navigate('/receipt', { state: { order: orderReceipt }, replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit order. Please retry.');
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🛍️</div>
        <h2 className="empty-state-title">Cart is Empty</h2>
        <p className="empty-state-text">
          Add at least one delicious dish from our menu before proceeding through checkout.
        </p>
        <Link to="/menu">
          <Button variant="primary">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '0.4rem' }}>
          Express Checkout
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Signed in as <strong>{user?.name}</strong> &bull; Complete delivery details for prompt hot dispatch in Addis Ababa.
        </p>
      </div>

      {submitError && (
        <Alert variant="error" title="Submission Issue">
          {submitError}
        </Alert>
      )}

      <div className="checkout-grid">
        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
            1. Delivery Destination
          </h2>

          <Field
            id="field-name"
            label="Recipient Full Name"
            required
            error={errors.name}
            touched={touched.name}
          >
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Almaz Ayana"
            />
          </Field>

          <Field
            id="field-phone"
            label="Telebirr Mobile Phone"
            required
            error={errors.phone}
            touched={touched.phone}
            hint="Ethiopian format: 0911223344 or +251911223344"
          >
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="09... / +251..."
            />
          </Field>

          <Field
            id="field-area"
            label="Addis Ababa Subcity / Area"
            required
            error={errors.area}
            touched={touched.area}
          >
            <select
              value={form.area}
              onChange={(e) => handleChange('area', e.target.value)}
              onBlur={() => handleBlur('area')}
              className="form-select"
            >
              {DELIVERY_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="field-address"
            label="Street Address / House No. / Landmark"
            required
            error={errors.address}
            touched={touched.address}
            hint="e.g., Bole Behind Medhanialem Church, House 412"
          >
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Building name, landmark, or specific entrance"
            />
          </Field>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', margin: '2rem 0 1.25rem' }}>
            2. Payment Preference
          </h2>

          <Field
            id="field-payment"
            label="Payment Gateway"
            required
            error={errors.paymentMethod}
            touched={touched.paymentMethod}
          >
            <select
              value={form.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              onBlur={() => handleBlur('paymentMethod')}
              className="form-select"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="field-notes"
            label="Special Kitchen or Delivery Instructions (Optional)"
            error={errors.notes}
            touched={touched.notes}
            hint="e.g., Extra berbere on the side, please call when near the gate"
          >
            <textarea
              className="form-textarea"
              rows={3}
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              onBlur={() => handleBlur('notes')}
              placeholder="Any dietary adjustments or access directions..."
            />
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            Confirm & Place Order ({grandTotalETB} ETB) &rarr;
          </Button>
        </form>

        {/* Order Summary Column */}
        <div>
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '1.25rem' }}>
              Order Breakdown
            </h3>

            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    fontSize: '0.9rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.qty}&times;</span> {item.name}
                  </div>
                  <span style={{ color: 'var(--color-amber)', fontWeight: 600 }}>
                    {item.price * item.qty} ETB
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{subtotalETB} ETB</span>
            </div>
            <div className="summary-row">
              <span>Courier Delivery</span>
              <span>{deliveryFeeETB === 0 ? 'FREE' : `${deliveryFeeETB} ETB`}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Grand Total</span>
              <span style={{ color: 'var(--color-amber)' }}>{grandTotalETB} ETB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
