# Addis Eats · Express Checkout (Module 3 · Day 33)

> **Forms & Controlled Components in React**  
> Designed by Mehran Dasgar · CodeOps Full Stack Software Development · IBT College Canada

A complete, production-grade checkout system for **Addis Eats** that implements the six fundamental form states honestly. Every field is controlled from one source of truth, validation rules are implemented as a pure function derived synchronously on every render, feedback respects screen readers and colour-blind users, and network/server failures never discard entered customer data.

---

## Architecture & Project Structure

```text
day08/
├── src/
│   ├── api/
│   │   └── orders.js               # Simulated Addis Eats mobile network API & 422 errors
│   ├── checkout/
│   │   ├── Checkout.jsx            # Hand-crafted controlled form (Exercises 1–7)
│   │   ├── CheckoutHookForm.jsx    # Section 4 React Hook Form + Zod comparison
│   │   ├── Field.jsx               # Accessible field wrapper (labels, aria-*, role="alert")
│   │   └── validate.js             # Pure validation rules function
│   ├── components/                 # Convenience re-exports matching course guidelines
│   │   ├── Checkout.jsx
│   │   └── Field.jsx
│   ├── utils/
│   │   └── validate.js             # Convenience re-export
│   ├── App.jsx                     # Interactive dual-mode tab switcher & basket sidebar
│   ├── index.css                   # Ethiopian gourmet theme & greyscale accessibility simulator
│   └── main.jsx                    # Application entry
├── index.html                      # Semantic HTML5 container with accessibility skip links
├── package.json                    # Dependencies (React 19, React Hook Form, Zod)
└── README.md                       # Comprehensive architectural documentation & audit
```

---

## Validation Rules & Rationale

| Field | Rule Specification | Rationale & User Experience Impact |
| :--- | :--- | :--- |
| **Full Name** (`name`) | Required; trimmed length $\ge 3$ characters; letters, spaces, hyphens only. | Ensures the delivery courier has a real, identifiable customer name at delivery checkpoints and building gates. |
| **TeleBirr Phone** (`phone`) | Required; must match Ethiopian TeleBirr mobile syntax: starts with `09...` (10 digits) or `+2519...` (13 characters). Also accepts Safaricom Ethiopia `07...` / `+2517...`. | TeleBirr uses the mobile MSISDN as the account identifier. Formatting errors prevent USSD push payment prompts from triggering, causing order failures. Whitespace and hyphens are stripped automatically before testing so users are not punished for formatting habits. |
| **Delivery Area** (`area`) | Required; restricted to the active operational hubs: `['Bole', 'Kazanchis', 'Megenagna', 'Piassa']`. | Addis Eats delivery couriers are assigned to specific geographic kitchens. Restricting selection prevents unserviceable orders from reaching the kitchen. |
| **Delivery Notes** (`notes`) | Optional; maximum 200 characters if supplied. | Couriers need concise gate codes or landmarks on small mobile delivery screens; preventing novel-length notes keeps the dispatch system legible. |

---

## The Six Honest Form States

Most beginner forms handle only "typing" and "sent". Addis Eats handles all six states honestly:

```
[1. Pristine] ──(Type)──> [2. Dirty] ──(Blur/Submit)──> [3. Invalid]
                                │                              │ (Correct live)
                           (Submit Valid)                 [2. Dirty]
                                │
                         [4. Submitting] (Button disabled, spinner, total shown)
                                ├──────────────┬──────────────┐
                                │              │              │
                         [5. Failed (422)]     │     [6. Succeeded]
                    (Keeps all values,         │     (Receipt displayed,
                     shows reason, focuses     │      TeleBirr prompt confirmed)
                     first bad field)          │
```

1. **Pristine**: The form initializes with default values (`area: 'Bole'`). Untouched empty fields stay quiet and do not scold the user before they have interacted.
2. **Dirty**: Customer input is kept exactly as typed, with no jarring jumps or resets.
3. **Invalid**: Clear, actionable error message placed directly beside the affected field, with an inline `⚠️` icon and high-contrast double border.
4. **Submitting**: The submit button is immediately disabled, a spinner appears, and the label displays `Placing Order (730 ETB)...` to eliminate duplicate submissions on slow 3G mobile connections.
5. **Failed**: When the server returns an HTTP 422 or network error, **every single value is retained**. A descriptive alert banner explains the failure and focus moves programmatically to the first invalid field.
6. **Succeeded**: Renders a confirmed order receipt with the generated Order ID, delivery breakdown, and TeleBirr prompt notice.

---

## Accessible Wiring (`Field.jsx`)

True accessibility requires four essential attributes on every input:

1. **`htmlFor` & `id`**: Tightly links the visible `<label>` to the input element. Extends the tap target for mobile users and ensures screen readers announce the input's purpose immediately upon focus.
2. **`aria-invalid={showError ? "true" : "false"}`**: Communicates to assistive tech that the field contains an error.
3. **`aria-describedby={showError ? "${id}-error" : undefined}`**: Points the screen reader directly to the error description or helper text.
4. **`role="alert"`**: Placed on the error message container so assistive technology announces the corrective action dynamically.

### Perceivable Without Colour
According to WCAG guidelines, colour is never the sole indicator of an error:
- **Explicit Text**: Clear instructions right under the input (`"Use 09... or +2519..."`).
- **Iconography**: A bold `⚠️` badge accompanies the message.
- **High-Contrast Border**: In greyscale, the border transforms into a 2px distinct stroke with an outer focus-shadow.
- **Top Summary**: An alert summary lists and links directly to each problematic field.

---

## Review Questions & Answers (Slide 27)

### 1. Why does the change handler need the `name` attribute on every input?
The computed property key pattern `[e.target.name]: e.target.value` uses the input's `name` attribute to dynamically map updates to the correct property in the unified form state object. This allows a single, reusable `handleChange` function to control arbitrarily many fields without creating individual state setters or bespoke handlers.

### 2. What goes wrong if you put the submit handler on the button instead of the form?
Placing the click handler on the button breaks fundamental browser form ergonomics:
- Pressing the **Enter** key while focused inside any text input will no longer submit the form.
- Assistive technologies and screen readers will not announce the form's submission event.
- Built-in form submission lifecycle events (like default prevention and unified validation) are bypassed.

### 3. Why should the errors object be derived on every render rather than kept in state?
Derived state guarantees that `errors` can **never fall out of sync** with `form`. If errors were stored in a separate `useState`, every input change would require updating both the form and the error state, creating opportunities for race conditions and stale feedback. Deriving errors purely during render means that as soon as the user corrects a typo, the error disappears on the very next render.

### 4. What problem does tracking touched fields solve, and when should you stop using it?
An empty form is technically invalid on the first render, but scolding the customer before they have even touched a field causes anxiety and form abandonment. Tracking `touched` on `onBlur` ensures that errors only appear **after** the customer has visited and left a field.  
You switch from blur-only to **live keystroke validation** once a field has been marked touched and invalid, so the customer receives immediate positive reinforcement the instant they type a valid character.

### 5. Name three ways to signal an invalid field without relying on colour.
1. **Direct descriptive text**: Placing a clear message directly below the input stating the expected format (e.g. `"Use 09... or +2519..."`).
2. **Iconography / symbols**: Adding an unambiguous symbol (such as `⚠️` or `!`) beside the text.
3. **Shape & stroke contrast**: Applying distinct border widths (e.g., 2px solid with an outer box-shadow or dashed outline) and programmatic keyboard focus management that scrolls the user directly to the first problem.

### 6. Your form has three fields and simple rules. Would you reach for React Hook Form? Why?
**No.** For a three-field form with simple validation, a hand-crafted controlled form in React is simpler, avoids external dependencies, has zero bundle overhead, and makes every state transition completely transparent. React Hook Form is best suited for complex forms (10+ fields), forms requiring high-frequency keystroke optimization without re-rendering the parent tree, or systems sharing a declarative Zod schema between client and server.

---

## "Check Yourself" Verification Audit

| Question | Verified Result | Technical Proof |
| :--- | :---: | :--- |
| **Does pressing Enter in a text field submit the form?** | **YES** | `<form onSubmit={handleSubmit}>` ensures standard browser Enter-key submission. |
| **Can you complete the whole form using only the keyboard?** | **YES** | Logical `tabIndex`, visible focus rings (`:focus-visible`), skip links, and programmatic `.focus()` calls. |
| **Does an untouched empty field stay quiet until you leave it?** | **YES** | Error visibility is guarded by `touched[field] && errors[field]`. Untouched fields render zero error text. |
| **Does a corrected field clear its message immediately?** | **YES** | `errors = validate(form)` runs synchronously during render; as `form` updates on `onChange`, resolved errors vanish instantly. |
| **Does pressing Order twice quickly send only one order?** | **YES** | `if (isSubmitting) return;` guard combined with `disabled={isSubmitting}` on the button prevents double clicks. |
| **After a simulated failure, is every value still in the form?** | **YES** | The `catch` block updates `serverError` and focuses the bad field without touching or resetting `form` state. |
| **Turn the screen greyscale — can you still tell which field is wrong?** | **YES** | The interactive **"Test Greyscale Mode"** toggle applies `filter: grayscale(100%)`. Distinct icons (`⚠️`), text messages, and high-contrast 2px borders remain clearly discernible. |

---

## Running the Application

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Build for production
npm run build
```

Open `http://localhost:5173` to test the Addis Eats Checkout form in both **Controlled (By Hand)** and **React Hook Form + Zod** modes!
