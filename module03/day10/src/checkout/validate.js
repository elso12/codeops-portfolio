/**
 * Addis Eats Checkout Validation
 * Pure validation rules: (form) => errors
 */

export const DELIVERY_AREAS = [
  'Bole',
  'Kazanchis',
  'Megenagna',
  'Piassa',
  'Sarbet',
  'Old Airport',
  'CMC',
];

export const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr SuperApp Express (Instant)' },
  { id: 'cbe', name: 'CBE Birr / Commercial Bank of Ethiopia' },
  { id: 'cash', name: 'Cash on Delivery (Injera Courier)' },
];

/**
 * Pure validation function returning an errors map.
 * @param {Object} form - { name, phone, area, address, paymentMethod, notes }
 * @returns {Record<string, string>}
 */
export function validate(form = {}) {
  const errors = {};

  // 1. Customer Name: Required, trimmed, at least 3 characters
  const name = (form.name || '').trim();
  if (!name) {
    errors.name = 'Please enter your full name';
  } else if (name.length < 3) {
    errors.name = 'Name must be at least 3 characters long';
  }

  // 2. Ethiopian Phone Number (Telebirr / Safaricom format: 09..., 07..., +2519..., +2517...)
  const phone = (form.phone || '').trim().replace(/[\s-]/g, '');
  if (!phone) {
    errors.phone = 'Telebirr or mobile phone number is required';
  } else if (!/^(?:\+251|0)9\d{8}$/.test(phone) && !/^(?:\+251|0)7\d{8}$/.test(phone)) {
    errors.phone = 'Use Ethiopian format: 09... or +2519... (Telebirr) or 07... (Safaricom)';
  }

  // 3. Delivery Subcity / Area
  if (!form.area || !DELIVERY_AREAS.includes(form.area)) {
    errors.area = 'Please select an Addis Ababa delivery subcity';
  }

  // 4. Street / Building Address
  const address = (form.address || '').trim();
  if (!address) {
    errors.address = 'Street name, house number or building landmark is required';
  } else if (address.length < 5) {
    errors.address = 'Please provide sufficient delivery instructions (at least 5 characters)';
  }

  // 5. Payment Method
  if (!form.paymentMethod) {
    errors.paymentMethod = 'Please choose a payment method';
  }

  // 6. Optional Notes: Max 200 characters
  if (form.notes && form.notes.length > 200) {
    errors.notes = `Notes must be under 200 characters (currently ${form.notes.length})`;
  }

  return errors;
}

export default validate;
