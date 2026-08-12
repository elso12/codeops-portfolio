# TeleBirr Tip & Split Calculator

## DELIVERABLE
A script that takes a bill amount and party size, adds a tiered tip, and prints the total and the amount per person in ETB.

## Steps
* Read bill and partySize; convert the bill with `Number()`.
* Add a 10% tip when the bill is over 300 ETB, else 5%.
* Use a switch to add a TeleBirr / CBE Birr service fee (e.g., TeleBirr = 5 ETB, CBE Birr = 10 ETB).
* Compute the total and the per-person amount.
* Print a clear message with a template literal.
* Run with `node tip.js` and check it against `expected.txt`.

## Self-Check List
- [ ] Did you use `Number()` to convert the string to a number?
- [ ] Is the tip tiered properly using an `if/else` statement?
- [ ] Did you use a `switch` statement for the service fee?
- [ ] Is the math correct for the total and split amounts?
- [ ] Does the terminal output perfectly match `expected.txt`?