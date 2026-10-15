/**
 * Addis Eats Checkout Validation
 * Day 33 · Section 2: Pure Validation Rules
 * 
 * Rules:
 * - name: Required, minimum 3 characters. Actionable error message.
 * - phone: TeleBirr pattern (starts with 09... or +2519... or Safaricom 07.../+2517...).
 * - area: Must be one of Bole, Kazanchis, Megenagna, Piassa.
 * - notes: Optional, maximum 200 characters.
 * 
 * Purity:
 * - Pure function: (form) => errors
 * - Derived on every render pass so errors can never get out of sync with form state.
 */

export const AREAS = ['Bole', 'Kazanchis', 'Megenagna', 'Piassa'];
export const ALLOWED_AREAS = AREAS; // alias for backwards compatibility

/**
 * Pure validation function returning an errors object.
 * @param {Object} form - { name, phone, area, notes }
 * @returns {Record<string, string>} - Map of field name to error message, or {} if valid
 */
export function validate(form = {}) {
  const errors = {};

  // 1. Full Name: Required, trimmed, at least 3 characters
  const name = (form.name || '').trim();
  if (!name) {
    errors.name = 'Please enter your name';
  } else if (name.length < 3) {
    errors.name = 'Name must be at least 3 characters long';
  }

  // 2. TeleBirr Phone: 09... or +2519... (also accepts 07... or +2517...)
  const phone = (form.phone || '').trim().replace(/[\s-]/g, '');
  if (!phone) {
    errors.phone = 'TeleBirr phone number is required';
  } else if (!/^(?:\+251|0)9\d{8}$/.test(phone) && !/^(?:\+251|0)7\d{8}$/.test(phone)) {
    errors.phone = 'Use 09... or +2519... (TeleBirr number)';
  }

  // 3. Delivery Area: Bole, Kazanchis, Megenagna, Piassa
  if (!form.area || !AREAS.includes(form.area)) {
    errors.area = 'Choose a delivery area';
  }

  // 4. Delivery Notes: Optional, under 200 characters
  if (form.notes && form.notes.length > 200) {
    errors.notes = `Notes must be under 200 characters (currently ${form.notes.length})`;
  }

  return errors; // {} means valid
}

export default validate;
