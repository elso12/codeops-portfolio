/**
 * src/api.js - Addis Eats Menu API Helper
 *
 * Implements data loading from /dishes.json with:
 * 1. Category query routing (/dishes.json?category=...)
 * 2. res.ok status check with user-friendly error messages
 * 3. AbortController signal support for request cancellation
 */

/**
 * Fetches menu dishes from the endpoint.
 *
 * @param {string} [category="All"] - The category to fetch.
 * @param {AbortSignal} [signal] - Optional AbortSignal for cancellation.
 * @returns {Promise<Array>} Resolves to array of dish objects.
 */
export async function fetchDishes(category = 'All', signal) {
  const url =
    category && category !== 'All'
      ? `/dishes.json?category=${encodeURIComponent(category)}`
      : '/dishes.json';

  const res = await fetch(url, { signal });

  // Requirement: Check res.ok and throw a clear message so 404 reaches the error branch
  if (!res.ok) {
    throw new Error(
      `Could not load the menu: Server responded with status ${res.status} (${res.statusText || 'Not Found'})`
    );
  }

  const data = await res.json();

  // In a static server, filter by category if not 'All'
  if (category && category !== 'All') {
    return data.filter(
      (dish) => dish.category.toLowerCase() === category.toLowerCase()
    );
  }

  return data;
}

/**
 * loadDishes helper as specified in the Day 29 slide roadmap:
 * loadDishes(category, signal, setDishes, setLoading, setError)
 */
export async function loadDishes(category = 'All', signal, setDishes, setLoading, setError) {
  try {
    if (setLoading) setLoading(true);
    if (setError) setError(null);

    const dishes = await fetchDishes(category, signal);

    if (setDishes) setDishes(dishes);
    return dishes;
  } catch (err) {
    if (err.name !== 'AbortError') {
      if (setError) setError(err.message || 'Could not load the menu');
      throw err;
    }
  } finally {
    if (setLoading && (!signal || !signal.aborted)) {
      setLoading(false);
    }
  }
}
