import { useState, useEffect } from "react";

/**
 * useDebounce Hook
 * Delays updating the debounced value until after `delay` milliseconds
 * have elapsed since the last time the value changed.
 *
 * Prevents firing a network request per keystroke.
 * Typing 5 characters within 300ms fires exactly 1 request, not 5.
 *
 * @template T
 * @param {T} value
 * @param {number} [delay=300]
 * @returns {T}
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
