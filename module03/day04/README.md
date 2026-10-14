# Module 3 · Day 29 Mini-Project: The Menu That Loads Itself

An interactive, server-driven restaurant menu for **Addis Eats** that dynamically fetches dishes from an endpoint, coordinates loading/error/empty UI states, cancels in-flight requests on category switching using `AbortController`, manages document titles, and focuses search input on mount using `useRef`.

---

## What Comes From The Server

Instead of keeping a static, hard-coded dish array in the component tree:
- **`public/dishes.json`**: Serves as the menu endpoint providing dish data (`id`, `name`, `category`, `price`, `spicy`).
- **`src/api.js`**: Centralized HTTP client using standard `fetch()` that queries `/dishes.json?category={category}`, validates `res.ok`, and supports cancellation via `AbortSignal`.
- **`src/Menu.jsx`**: Coordinates state (`dishes`, `loading`, `error`, `selectedCategory`, `searchTerm`), manages side effects with `useEffect`, updates `document.title`, and cleans up in-flight requests.
- **`src/DishList.jsx`**: Renders the dishes grid with early return handling for loading and error states, and displays friendly empty-state messaging when no dishes match.

---

## 7-Step Progression & Commit History

1. **Step 1 (`6b6f9b2`)**: Synchronize `document.title` to the count of currently shown dishes via `useEffect`.
2. **Step 2 (`9b9072a`)**: Move menu array into `public/dishes.json` and fetch it in `useEffect` with an empty dependency array `[]`.
3. **Step 3 (`7baa329`)**: Add separate `loading` and `error` states, each rendered with an early return before the dishes list, ensuring `setLoading(false)` always runs in a `finally` block.
4. **Step 4 (`7a66d3b`)**: Validate `res.ok` after fetching and throw a clear, human-readable error so HTTP 404 responses reach the error branch.
5. **Step 5 (`984deaa`)**: Add `selectedCategory` to the `useEffect` dependency array so changing categories immediately triggers a new request in the Network tab.
6. **Step 6 (`986642f`)**: Instantiate `AbortController` and cancel pending requests in the effect cleanup function, confirming cancellation (`(canceled)`) in the Network tab when categories switch quickly.
7. **Step 7 (`3cb99d6`)**: Create a search input focused automatically on mount using `useRef` + `useEffect`.

---

## Why `.focus()` Must Be Inside an Effect

Calling `ref.current.focus()` cannot be done during the component render phase for three reasons:

1. **DOM Availability (Timing)**: During the render phase, React executes the component function to construct the virtual element tree. The native browser DOM element has not yet been instantiated, attached to the DOM tree, or painted. Therefore, `searchInputRef.current` is `null` during render, and calling `.focus()` will throw a `TypeError`.
2. **Component Purity**: React function components must be pure with respect to rendering. Setting focus imperatively alters global browser state (active element, scroll position, window focus), which is a side effect.
3. **Effect Guarantees**: `useEffect` runs strictly **after** React has committed changes to the DOM and the browser has painted. At that moment, `searchInputRef.current` safely references the real HTML `<input>` node, allowing `.focus()` to execute predictably.

---

## Check Yourself Verification

| Question | Status | Implementation Detail |
| :--- | :---: | :--- |
| **Does the menu show a loading message before dishes appear?** | Yes | `DishList` renders `<p className="loading">Loading the menu...</p>` with early return while `loading === true`. |
| **If you rename `dishes.json`, do you get a clear error message instead of a blank screen?** | Yes | `res.ok` check detects 404 and throws a friendly error: `Could not load the menu: Server responded with status 404`, rendered via `<p className="err">`. |
| **Does switching category trigger a new request in the Network tab?** | Yes | `selectedCategory` in dependency array calls `/dishes.json?category={category}` upon each change. |
| **Is the previous request shown as cancelled when you switch quickly?** | Yes | Cleanup function invokes `controller.abort()`, triggering an `AbortError` which is caught and ignored while the browser logs `(canceled)`. |
| **Does the empty category show a friendly note rather than an error?** | Yes | Categories with 0 dishes (e.g., "Drinks") render `<p className="empty-state">No dishes found in the "Drinks" category.</p>`. |
| **Does the search field have focus as soon as the page loads?** | Yes | `searchInputRef.current?.focus()` runs inside `useEffect(..., [])` on mount. |
| **Is every value in the dependency array actually read by the effect — and nothing missing?** | Yes | `selectedCategory` is passed into `fetchDishes(selectedCategory, ...)`; no unread or missing dependencies. |

---

## Running the Application Locally

```bash
# In module03/day04
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.
