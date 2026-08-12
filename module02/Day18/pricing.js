// pricing.js

// Add 15% standard VAT
function withVat(amount) {
    return amount * 1.15;
}

// Format the number to 2 decimal places with 'ETB'
function format(amount) {
    return `${amount.toFixed(2)} ETB`;
}

// Use reduce to total each order's items. 
// Notice how we destructure { price, qty } directly in the callback!
function total(items) {
    return items.reduce((sum, { price, qty }) => sum + (price * qty), 0);
}

// Export the functions to be used in summary.js
module.exports = {
    withVat,
    format,
    total
};
//day1