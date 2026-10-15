import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AREAS } from './validate.js';
import { placeOrder, ApiError } from '../api/orders.js';

const TOTAL_ETB = 730;

// Section 4 · Slide 23: Shared Zod Schema definition
const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your name')
    .min(3, 'Name must be at least 3 characters long'),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+251|0)[97]\d{8}$/, 'Use 09... or +2519... (TeleBirr number)'),
  area: z.enum(['Bole', 'Kazanchis', 'Megenagna', 'Piassa'], {
    errorMap: () => ({ message: 'Choose a delivery area' }),
  }),
  notes: z
    .string()
    .max(200, 'Notes must be under 200 characters')
    .optional()
    .or(z.literal('')),
});

/**
 * CheckoutHookForm.jsx — Section 4 Implementation: React Hook Form + Zod Schema
 * 
 * Demonstrates:
 * - Uncontrolled DOM registration with register()
 * - Automatic touchedFields and isSubmitting tracking via formState
 * - Shared Zod schema validation via zodResolver
 * - Comparing "By Hand" vs "Library" architecture
 */
export default function CheckoutHookForm() {
  const [serverError, setServerError] = useState(null);
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    reset,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      area: 'Bole',
      notes: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);

    try {
      const createdOrder = await placeOrder(
        { ...data, totalETB: TOTAL_ETB },
        { simulateFailure }
      );
      setOrderReceipt(createdOrder);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setServerError(err.message);
        if (err.fieldErrors?.phone) {
          setError('phone', {
            type: 'server',
            message: err.fieldErrors.phone,
          });
          setFocus('phone');
        }
      } else {
        setServerError(err.message || 'Network request failed.');
      }
    }
  };

  if (orderReceipt) {
    return (
      <div className="checkout-card confirmation-container" role="status">
        <div className="confirmation-badge" aria-hidden="true">✓</div>
        <h2 className="confirmation-title">Order Confirmed via React Hook Form!</h2>
        <p className="confirmation-desc">Reference: <strong>{orderReceipt.id}</strong></p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            reset();
            setOrderReceipt(null);
          }}
        >
          Reset and Place Another
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-card">
      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>React Hook Form + Zod Checkout</h2>
          <span className="badge-pill" style={{ background: '#1E3A8A', color: '#93C5FD', borderColor: '#3B82F6' }}>
            Section 4 Mode
          </span>
        </div>
        <p>Uncontrolled registration, minimal re-renders, and declarative schema validation.</p>
      </div>

      {serverError && (
        <div role="alert" className="alert-banner alert-banner-error">
          <span className="alert-banner-icon" aria-hidden="true">⚠️</span>
          <div>
            <div className="alert-banner-title">Server Validation Error</div>
            <div className="alert-banner-desc">{serverError}</div>
          </div>
        </div>
      )}

      <form className="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="fields-stack">
          {/* Name */}
          <div className={`field-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="rhf-name" className="field-label">
              Full Name <span className="required-indicator">*</span>
            </label>
            <input
              id="rhf-name"
              {...register('name')}
              className="field-input"
              placeholder="e.g. Abebe Bikila"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'rhf-name-error' : undefined}
            />
            {errors.name && (
              <p id="rhf-name-error" role="alert" className="field-error-message">
                <span className="error-icon" aria-hidden="true">⚠️</span>
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          {/* Phone */}
          <div className={`field-group ${errors.phone ? 'has-error' : ''}`}>
            <label htmlFor="rhf-phone" className="field-label">
              TeleBirr Phone Number <span className="required-indicator">*</span>
            </label>
            <input
              id="rhf-phone"
              type="tel"
              {...register('phone')}
              className="field-input"
              placeholder="0911234567 or +251911234567"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'rhf-phone-error' : undefined}
            />
            {errors.phone && (
              <p id="rhf-phone-error" role="alert" className="field-error-message">
                <span className="error-icon" aria-hidden="true">⚠️</span>
                <span>{errors.phone.message}</span>
              </p>
            )}
          </div>

          {/* Area */}
          <div className={`field-group ${errors.area ? 'has-error' : ''}`}>
            <label htmlFor="rhf-area" className="field-label">
              Delivery Area <span className="required-indicator">*</span>
            </label>
            <select
              id="rhf-area"
              {...register('area')}
              className="field-select"
              aria-invalid={!!errors.area}
              aria-describedby={errors.area ? 'rhf-area-error' : undefined}
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            {errors.area && (
              <p id="rhf-area-error" role="alert" className="field-error-message">
                <span className="error-icon" aria-hidden="true">⚠️</span>
                <span>{errors.area.message}</span>
              </p>
            )}
          </div>

          {/* Notes */}
          <div className={`field-group ${errors.notes ? 'has-error' : ''}`}>
            <label htmlFor="rhf-notes" className="field-label">
              Delivery Instructions <span className="optional-indicator">(optional)</span>
            </label>
            <textarea
              id="rhf-notes"
              rows={3}
              {...register('notes')}
              className="field-textarea"
              placeholder="Gate code, landmark, or specific drop-off notes..."
              aria-invalid={!!errors.notes}
              aria-describedby={errors.notes ? 'rhf-notes-error' : undefined}
            />
            {errors.notes && (
              <p id="rhf-notes-error" role="alert" className="field-error-message">
                <span className="error-icon" aria-hidden="true">⚠️</span>
                <span>{errors.notes.message}</span>
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              <span>Sending Order ({TOTAL_ETB} ETB)...</span>
            </>
          ) : (
            <>
              <span aria-hidden="true">⚡</span>
              <span>Order with React Hook Form · {TOTAL_ETB} ETB</span>
            </>
          )}
        </button>
      </form>

      <div className="simulation-bar">
        <label className="simulation-switch">
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
          />
          <span>Simulate TeleBirr 422 Failure (keeps data, calls setError, moves focus)</span>
        </label>
      </div>
    </div>
  );
}
