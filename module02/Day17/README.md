# Habesha Eatery Order Module Exercise

## Objective
Build a module of pure functions and a closure-based receipt maker to price eatery orders.

## Requirements
- **subtotal**: Use `...rest` parameters and `reduce`.
- **discountBy**: Implement as a function factory (HOF + Closure).
- **withVat & toETB**: Implement as pure arrow functions.
- **makeReceiptMaker**: Use a closure to track a private `orderNo`.

## Implementation Tips
- Test each small function individually (e.g., ensure `subtotal(100, 200)` returns 300) before wiring them together.
- Remember that arrow functions are preferred for consistency in modern JavaScript.
- Use `let` for the `orderNo` to allow reassignment, but `const` for function definitions.

## Self-Check List
- [x] Does `subtotal` sum up all arguments using `reduce`?
- [x] Does `discountBy` return a new function that applies the correct rate?
- [x] Are `withVat` and `toETB` pure functions?
- [x] Does `makeReceiptMaker` successfully track and increment the order number without it resetting?
- [x] Does the console output exactly match the expected ETB strings?