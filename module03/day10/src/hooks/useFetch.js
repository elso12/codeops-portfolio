import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with AbortController cleanup.
 * @param {Function} fetchFn - Async function taking ({ signal }) => data
 * @param {Array} deps - Dependency array triggering refetch
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const refetch = useCallback(() => {
    setReloadTrigger((n) => n + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchFn({ signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message || 'An unexpected error occurred');
          setLoading(false);
        }
      });

    return () => {
      // Abort in-flight requests on unmount or deps change (Day 29)
      controller.abort();
    };
  }, [...deps, reloadTrigger]);

  return { data, loading, error, refetch };
}
