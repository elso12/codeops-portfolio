import React from 'react';

/**
 * Field.jsx — Accessible Form Field with Screen Reader & Greyscale Support
 * 
 * Features:
 * 1. htmlFor and id connect the real <label> to the input
 * 2. aria-invalid marks the field as wrong when error is displayed
 * 3. aria-describedby points to the error message (or help text)
 * 4. role="alert" ensures screen readers announce the error dynamically
 * 5. Visual cue: ⚠️ warning icon + distinct high-contrast borders for 100% greyscale perception
 */
export default function Field({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  helperText,
  options = [], // For select fields
  rows = 3, // For textarea fields
  inputRef,
  children,
}) {
  const showError = Boolean(touched && error);
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  return (
    <div className={`field-group ${showError ? 'has-error' : ''}`}>
      <div className="field-label-row">
        <label htmlFor={id} className="field-label">
          <span>{label}</span>
          {required ? (
            <span className="required-indicator" aria-hidden="true">*</span>
          ) : (
            <span className="optional-indicator">(optional)</span>
          )}
        </label>
      </div>

      <div className="field-input-wrapper">
        {children ? (
          children
        ) : type === 'select' ? (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={inputRef}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? errorId : helperText ? helpId : undefined}
            aria-required={required}
            className="field-select"
          >
            {options.map((opt) => (
              <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                {typeof opt === 'string' ? opt : opt.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={inputRef}
            rows={rows}
            placeholder={placeholder}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? errorId : helperText ? helpId : undefined}
            aria-required={required}
            className="field-textarea"
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={inputRef}
            placeholder={placeholder}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? errorId : helperText ? helpId : undefined}
            aria-required={required}
            className="field-input"
          />
        )}
      </div>

      {/* Inline accessible error announcement */}
      {showError && (
        <p id={errorId} role="alert" className="field-error-message">
          <span className="error-icon" aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </p>
      )}

      {/* Helper text when not showing error */}
      {!showError && helperText && (
        <p id={helpId} className="field-help-text">
          {helperText}
        </p>
      )}
    </div>
  );
}
