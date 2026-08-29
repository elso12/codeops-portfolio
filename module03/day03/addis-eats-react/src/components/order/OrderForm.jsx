import { useState } from 'react';
import PropTypes from 'prop-types';

// Step 5 & 6: Controlled delivery form (name, phone, area) using one state object,
// with live validation. Validates the TeleBirr number and disables button until valid.
export default function OrderForm({ total, itemCount }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    area: '',
  });

  const [errors, setErrors] = useState({});

  // Console-log state at the top of the component to understand re-rendering.
  console.log("OrderForm rendered — form:", form);

  // Live validation for TeleBirr phone number.
  // Valid formats: 09xxxxxxxx (10 digits) or +2519xxxxxxxx (13 chars).
  function validatePhone(phone) {
    const trimmed = phone.trim();
    if (!trimmed) return 'Phone number is required.';
    const localPattern = /^09\d{8}$/;
    const intlPattern = /^\+2519\d{8}$/;
    if (!localPattern.test(trimmed) && !intlPattern.test(trimmed)) {
      return 'Enter a valid TeleBirr number (09xxxxxxxx or +2519xxxxxxxx).';
    }
    return '';
  }

  function validateName(name) {
    if (!name.trim()) return 'Name is required.';
    if (name.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  }

  function validateArea(area) {
    if (!area.trim()) return 'Delivery area is required.';
    return '';
  }

  // Handle controlled input changes with live validation.
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Live validation as user types.
    let error = '';
    if (name === 'phone') error = validatePhone(value);
    if (name === 'name') error = validateName(value);
    if (name === 'area') error = validateArea(value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }

  // Check if the entire form is valid (all fields filled, no errors).
  const isFormValid =
    form.name.trim().length >= 2 &&
    form.area.trim() !== '' &&
    !validatePhone(form.phone) &&
    itemCount > 0;

  function handleSubmit(e) {
    e.preventDefault();
    alert(
      `Order placed!\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Area: ${form.area}\n` +
      `Items: ${itemCount}\n` +
      `Total: ${total} ETB`
    );
    setForm({ name: '', phone: '', area: '' });
    setErrors({});
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <h3>Delivery (TeleBirr)</h3>

      <label>
        Full Name
        <input
          type="text"
          name="name"
          placeholder="e.g. Abebe Bikila"
          value={form.name}
          onChange={handleChange}
          disabled={itemCount === 0}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </label>

      <label>
        Phone Number (TeleBirr)
        <input
          type="tel"
          name="phone"
          placeholder="09xxxxxxxx or +2519xxxxxxxx"
          value={form.phone}
          onChange={handleChange}
          disabled={itemCount === 0}
        />
        {errors.phone && <span className="error-text">{errors.phone}</span>}
      </label>

      <label>
        Delivery Area
        <input
          type="text"
          name="area"
          placeholder="e.g. Bole, Kazanchis, Piazza"
          value={form.area}
          onChange={handleChange}
          disabled={itemCount === 0}
        />
        {errors.area && <span className="error-text">{errors.area}</span>}
      </label>

      <button type="submit" className="btn-checkout" disabled={!isFormValid}>
        Place Order — {total} ETB
      </button>
    </form>
  );
}

OrderForm.propTypes = {
  total: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
};
