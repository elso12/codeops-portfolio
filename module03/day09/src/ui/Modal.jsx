import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal — createPortal into #modal-root (Day 34 · Section 4).
 *
 * Why a portal?
 *   .dish-card has overflow:hidden and creates a stacking context.
 *   Any child modal would be clipped by the card boundary.
 *   createPortal moves the pixels into #modal-root (outside #root)
 *   while keeping the component in the React tree — so context and
 *   event bubbling still follow the React parent chain.
 *
 * Keyboard requirements (Day 34 slide 24):
 *   ✓ Focus moves into the modal when it opens.
 *   ✓ Focus is trapped while open — Tab wraps inside the panel.
 *   ✓ Escape closes the modal.
 *   ✓ Focus returns to the trigger element on close.
 *   ✓ role="dialog" aria-modal aria-labelledby.
 */
export default function Modal({ isOpen, onClose, title, children }) {
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  /* Save the element that opened the modal so we can return focus to it. */
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
    }
  }, [isOpen]);

  /* Move focus in, lock scroll, restore focus on unmount. */
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    // Focus the first focusable element inside the panel.
    const firstFocusable = panel.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (firstFocusable || panel).focus();

    // Lock background scroll.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
      // Return focus to the button that opened this modal.
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [isOpen]);

  /* Keyboard: Escape closes, Tab stays inside. */
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;

        const focusable = Array.from(
          panel.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) { e.preventDefault(); return; }

        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const root = document.getElementById('modal-root');
  if (!root) return null; // guard: container must exist in index.html

  return createPortal(
    /* Backdrop — click outside closes the modal. */
    <div className="modal-overlay" onClick={onClose} role="presentation">
      {/* Panel — stop propagation so inner clicks don't dismiss the modal. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog (Escape)"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>,
    root
  );
}
