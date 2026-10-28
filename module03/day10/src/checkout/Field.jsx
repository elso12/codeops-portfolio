import React from 'react';

/**
 * Accessible form field wrapper for controlled inputs
 */
export function Field({
  id,
  label,
  error,
  touched,
  required = false,
  hint,
  children,
}) {
  const hasError = touched && Boolean(error);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>

      {React.cloneElement(children, {
        id,
        'aria-invalid': hasError ? 'true' : 'false',
        'aria-describedby': [
          hasError ? errorId : null,
          hint ? hintId : null,
        ]
          .filter(Boolean)
          .join(' ') || undefined,
        className: `${children.props.className || 'form-input'} ${
          hasError ? 'is-invalid' : ''
        }`.trim(),
      })}

      {hint && !hasError && (
        <div id={hintId} className="field-hint">
          {hint}
        </div>
      )}

      {hasError && (
        <div id={errorId} className="field-error" role="alert">
          <span aria-hidden="true">⚠️</span> {error}
        </div>
      )}
    </div>
  );
}

export default Field;
