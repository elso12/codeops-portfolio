# Addis Eats – Interactive Menu (Day 03)

This project is part of Module 3, Day 3. It extends the Addis Eats React menu by making it fully interactive with state management, category filtering, running totals, and a validated delivery form.

## 🚀 Features Implemented

- **Dish Count State:** Each `Dish` component has its own `count` state with an "Add" button that increments it, demonstrating local component state with `useState`.
- **Lifted Category State:** The category filter state lives in `Menu` and is passed down to `CategoryBar` (for rendering chips) and the filtered dish list, demonstrating state lifting.
- **Category Chips:** `CategoryBar` renders interactive filter chips from an array derived from the data. The selected category is visually highlighted with an `.active` class.
- **Running Order Total:** A running total in ETB is displayed in the sidebar and header, updated every time a dish is added.
- **Controlled Delivery Form:** `OrderForm` manages a single state object (`{ name, phone, area }`) for all three fields, keeping form inputs controlled.
- **TeleBirr Validation:** The phone field validates against Ethiopian TeleBirr number formats (`09xxxxxxxx` or `+2519xxxxxxxx`) with live error feedback. The submit button is disabled until all fields are valid.

## 🛠️ Concepts Mastered
- `useState` for local and lifted state
- Lifting state up to share between sibling components
- Controlled form inputs with a single state object
- Live validation and conditional button disabling
- Deriving data (unique categories) from arrays with `Set`
- `console.log` for debugging re-renders

## 📁 Provided Files
- `src/data.js` — The Addis Eats menu: id, name, price, category, spicy
- `src/Menu.jsx` — Holds the lifted category state and derives the filtered list
- `src/CategoryBar.jsx` — Stateless chips calling the onSelect handler from props
- `src/OrderForm.jsx` — Controlled fields in one object, with live validation
