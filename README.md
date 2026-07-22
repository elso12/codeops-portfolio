# CodeOps Portfolio

This repository holds my daily projects for the Advanced Digital Course at IBT College Canada.

## Author
- Elsay

---

## Module 1 Progress

### Day 05 – Accounts
- Built basic `Account` classes.
- Introduced owner, account number, and balance fields.
- Added deposit and withdraw methods.

### Day 06 – Bank Accounts
- Added `SavingsAccount` and `CurrentAccount` classes in `bank.py`.
- Extended functionality with interest and overdraft rules.

### Day 07 – Registry
- Created `AccountRegistry` to manage multiple accounts.
- Features:
  - Add accounts
  - Find by number
  - Deposit/withdraw
  - Undo last transaction (history stack)

### Day 08 – Recursion, Searching, Sorting
- Extended `AccountRegistry` with:
  - `top_by_balance(n)` → leaderboard
  - `find_by_number(number)` → binary search
  - `total_transactions(number)` → recursive sum
- Practice exercises in `practice.py`:
  - Recursive sum and countdown
  - Binary search
  - Merge sort
  - Sort with key
  - Two-pointer pair sum

---

## How to Run

From the project root:

```bash
# Run registry with test block
python -m module01.day08.registry

# Run practice exercises
python -m module01.day08.practice
