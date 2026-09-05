# Addis Eats - React State Management & Hooks

This project is the Week 1 Wrap-up Mini-Project for the React module. It transforms a static menu application into a fully functional, highly optimized React application using modern state management and custom hooks.

## 🚀 Features & Architecture

*   **Custom Data Fetching (`useFetch`):** Implemented a custom hook to handle data fetching from a local JSON API, including loading and error state management.
*   **Global State Management (`useContext` & `useReducer`):** Replaced prop-drilling with a global `CartProvider`. Complex state transitions (Add, Remove, Clear) are handled by a pure `cartReducer`.
*   **Performance Optimization (`useMemo`):** 
    *   Memoized the context provider value to prevent unnecessary re-renders of consumer components.
    *   Memoized the menu filtering logic so the list only recalculates when the active category changes.
*   **Dynamic Cart Calculations:** Real-time calculation of item quantities, total pricing, and header badge notifications.

## 🛠️ Technologies Used
*   React 18 (Vite)
*   React Hooks: `useState`, `useEffect`, `useContext`, `useReducer`, `useMemo`
*   CSS3 (Grid/Flexbox)

## 📦 How to Run Locally
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.