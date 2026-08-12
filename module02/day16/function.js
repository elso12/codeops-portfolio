"use strict";

/**
 * Calculates the sum of all given prices using reduce.
 */
const subtotal = (...prices) => {
  return prices.reduce((acc, price) => acc + price, 0);
};

/**
 * Returns an arrow function that applies a percentage discount (e.g., rate = 0.10 for 10% off).
 */
const discountBy = (rate) => {
  return (amount) => amount * (1 - rate);
};

/**
 * Adds 15% VAT to a given amount.
 */
const withVat = (n) => {
  return n * 1.15;
};

/**
 * Formats a number to 2 decimal places followed by " ETB".
 */
const toETB = (n) => {
  return `${n.toFixed(2)} ETB`;
};

/**
 * Creates a receipt maker function with a private order counter.
 */
function makeReceiptMaker() {
  let orderNo = 0; // Private state
  const memberOff = discountBy(0.10); // 10% discount function

  return function (...items) {
    // 1. Increment orderNo
    orderNo++;

    // 2. Calculate subtotal of items
    const rawSubtotal = subtotal(...items);

    // 3. Compose: apply discount, then VAT
    const discountedTotal = memberOff(rawSubtotal);
    const totalWithVat = withVat(discountedTotal);

    // 4. Format and return receipt string
    return `#${orderNo}: ${toETB(totalWithVat)}`;
  };
}

// Export for module use (if importing elsewhere)
if (typeof module !== "undefined") {
  module.exports = { subtotal, discountBy, withVat, toETB, makeReceiptMaker };
}

// --- Testing directly in the same file ---
const receipt = makeReceiptMaker();

// Almaz orders Doro Wat (220), Tibs (180), and Shiro (120)
// Math: (220 + 180 + 120) = 520 -> 10% off = 468 -> +15% VAT = 538.20 ETB
console.log(receipt(220, 180, 120)); // Output: #1: 538.20 ETB

// Dawit orders Firfir (140) and Buna (60)
// Math: (140 + 60) = 200 -> 10% off = 180 -> +15% VAT = 207.00 ETB
console.log(receipt(140, 60));       // Output: #2: 207.00 ETB