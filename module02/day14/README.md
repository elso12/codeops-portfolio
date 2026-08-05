# Day 14 Layout Projects — Ethiopian Interfaces

This folder contains two CSS layout exercises inspired by real Ethiopian web interfaces:

1. **Ethiopian Airlines Booking Results Page**
2. **CBE Online Banking Dashboard**

Both projects focus on using **CSS Grid** for the page skeleton and **Flexbox** for internal components.

---

## ✈️ Ethiopian Airlines Booking Layout
### Features
- **Grid skeleton** with `grid-template-areas`: header, sidebar (filters), main content, footer.
- **Sticky header** that remains visible while scrolling.
- **Flexbox navbar** with logo left, links + button right.
- **Toolbar row** inside main using Flexbox.
- **Responsive card grid** for flight results using `repeat(auto-fit, minmax(220px, 1fr))`.
- **Absolutely positioned badge** (“ETB Sale”) pinned to a flight card.
- **Media query** collapses layout to one column under 700px.

---

## 💳 CBE Online Banking Layout
### Features
- **Grid skeleton** with `grid-template-areas`: header, sidebar (account menu), main dashboard, footer.
- **Sticky sidebar** for quick navigation.
- **Flexbox navbar** with account name and action buttons.
- **Row of stat cards** (balances, transactions) using Flexbox.
- **Responsive grid** for transaction history using `repeat(auto-fit, minmax(200px, 1fr))`.
- **Absolutely positioned close button** on a notification card.
- **Media query** collapses layout to one column under 700px.

---

## ✅ Techniques Used
- CSS Grid (`grid-template-areas`, `repeat(auto-fit, minmax())`)
- Flexbox (`justify-content`, `align-items`, `flex-wrap`, `gap`)
- Sticky positioning (`position: sticky`)
- Absolute positioning anchored to relative parent
- Media queries for responsive design
- Semantic HTML structure with placeholder content

---

## 📂 Submission Checklist
- All colors and spacing values defined once as variables and reused with `var()`.
- `box-sizing: border-box` set globally.
- Buttons visibly change on hover (HSL lightness adjustment).
- Clear typographic hierarchy: headings, subheadings, body text.
- No inline styles or IDs used purely for styling.
