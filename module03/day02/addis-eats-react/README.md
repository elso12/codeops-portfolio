# Addis Eats - React Validation & Filtering

This project is part of Module 3, Day 2. It extends the static Addis Eats React menu by introducing component validation, layout wrappers, and dynamic list filtering.

## 🚀 Features Implemented

- **Component Validation:** Implemented `PropTypes` on the `Dish` component to enforce strict data types (e.g., ensuring `price` is a number and `name` is a string) and set default prop values.
- **Wrapper Components:** Created a reusable `Card` wrapper component that utilizes the React `children` prop for layout consistency.
- **Conditional Rendering:** Used the `&&` logical operator to conditionally render a "🌶️ Spicy" badge only when a dish's spicy boolean is true.
- **Dynamic Filtering:** Built a `Menu` component that filters the master dish array by category (e.g., Vegetarian, Main) and displays a fallback empty state when no items match.

## 🛠️ Concepts Mastered
- `PropTypes` and Default Props
- Component Composition (`children` prop)
- Short-circuit Evaluation (`&&`)
- Array `.filter()` combined with `.map()`