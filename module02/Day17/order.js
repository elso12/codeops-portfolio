"use strict";

/**
 * subtotal(...prices) using a reduce callback.
 * Uses rest parameters to accept any number of prices.
 */
const subtotal = (...prices) => {
  return prices.reduce((total, currentPrice) => total + currentPrice, 0);
};

/**
 * discountBy(rate) as a factory returning an arrow function.
 * This is a Higher-Order Function (HOF) that creates a closure over the rate.
 */
const discountBy = (rate) => {
  return (amount) => amount - (amount * rate);
};

/**
 * withVat as a small pure helper.
 * It adds 15% VAT to a given amount.
 */
const withVat = (n) => {
  return n * 1.15;
};

/**
 * toETB as a small pure helper.
 * It formats a number to 2 decimal places followed by " ETB".
 */
const toETB = (n) => {
  return `${n.toFixed(2)} ETB`;
};

/**
 * makeReceiptMaker() with a private order number.
 * Uses a closure to maintain the state of orderNo across calls.
 */
function makeReceiptMaker() {
  let orderNo = 0; // Private state
  const memberOff = discountBy(0.1); // Pre-builds a 10% discount function

  return function (...items) {
    // 1. Increment orderNo
    orderNo++;
    
    // 2. Calculate subtotal of items
    const rawTotal = subtotal(...items);
    
    // 3. Compose: apply discount, then VAT
    const discountedTotal = memberOff(rawTotal);
    const finalTotal = withVat(discountedTotal);
    
    // 4. Format and return receipt string
    const formattedETB = toETB(finalTotal);
    
    return `#${orderNo}: ${formattedETB}`;
  };
}

// Export for run.js
if (typeof module !== "undefined") {
  module.exports = { subtotal, discountBy, withVat, toETB, makeReceiptMaker };
}