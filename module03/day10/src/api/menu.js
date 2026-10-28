/**
 * Addis Eats API - Menu Service
 * Supports abort signals, simulated throttling, and deliberate error injection
 * to test failure states per Day 35 rubric.
 */

// Diagnostic flags accessible via diagnostic toolbar
export const networkState = {
  throttleSlow3G: false,
  simulateFailure: false,
};

export async function fetchDishes({ category, search, signal } = {}) {
  // 1. Simulate data request failure if toggled in diagnostic toolbar
  if (networkState.simulateFailure) {
    throw new Error('503 Service Unavailable: Addis Eats Central Kitchen Gateway Timeout');
  }

  // 2. Simulate Slow 3G throttling (1500ms delay) if enabled
  if (networkState.throttleSlow3G) {
    await new Promise((res) => setTimeout(res, 1500));
  } else {
    // Slight authentic network latency
    await new Promise((res) => setTimeout(res, 250));
  }

  const response = await fetch('/menu.json', { signal });
  if (!response.ok) {
    throw new Error(`Failed to load menu dishes: HTTP ${response.status}`);
  }

  const allDishes = await response.json();

  let filtered = allDishes;

  // Filter by category if specified and not 'All'
  if (category && category.toLowerCase() !== 'all') {
    filtered = filtered.filter(
      (dish) => dish.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by search keyword
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (dish) =>
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        (dish.ingredients && dish.ingredients.some((ing) => ing.toLowerCase().includes(q)))
    );
  }

  return filtered;
}

export async function fetchDishById(id, { signal } = {}) {
  if (networkState.simulateFailure) {
    throw new Error('503 Service Unavailable: Unable to retrieve dish recipe metadata');
  }

  if (networkState.throttleSlow3G) {
    await new Promise((res) => setTimeout(res, 1200));
  }

  const response = await fetch('/menu.json', { signal });
  if (!response.ok) {
    throw new Error(`Failed to load dishes: HTTP ${response.status}`);
  }

  const allDishes = await response.json();
  const found = allDishes.find((d) => String(d.id) === String(id));
  return found || null;
}
