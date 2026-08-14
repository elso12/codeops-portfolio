# Day 21: Persistent Signup Form

## Objective
Build a signup form that validates an Ethiopian phone number using Regex, and saves valid entries to `localStorage` as serialized JSON.

## Features & Defenses
- **Regex Validation:** Implements strict pattern matching `^(?:\+251|0)9\d{8}$` for TeleBirr/Ethio Telecom numbers.
- **Defensive Storage:** Uses `try/catch` around `JSON.parse` to prevent fatal crashes if `localStorage` is tampered with.
- **XSS Protection:** Uses `textContent` instead of `innerHTML` to render error messages safely.
- **Accessibility:** Form inputs are explicitly linked to `<label>` elements via `for` attributes.

## Self-Check List
- [x] Form prevents default submission reload.
- [x] Input is trimmed before validation.
- [x] Name field requires at least 2 characters.
- [x] Phone field strictly checked against Ethiopian mobile regex.
- [x] Invalid submissions show specific error messages.
- [x] Valid submissions are stringified and pushed to `localStorage`.
- [x] Page load restores data from `localStorage` and displays the user count.