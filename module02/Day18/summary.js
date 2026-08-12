// summary.js

// 1. Import our functions and data
const { withVat, format, total } = require('./pricing.js');
const orders = require('./orders.js');

// 2. Use map + spread to attach a 'total' field to each order
const processedOrders = orders.map(order => {
    const rawTotal = total(order.items);
    const finalTotalWithVat = withVat(rawTotal);
    
    return {
        ...order,                // Keep all the original order data (id, customer, items)
        total: finalTotalWithVat // Attach the new total field
    };
});

// 3. Use filter to list only orders over 500 ETB
const highValueOrders = processedOrders.filter(order => order.total > 500);

// 4. Produce a grand total using reduce
const grandTotal = processedOrders.reduce((acc, order) => acc + order.total, 0);

// 5. Print a formatted summary
console.log("=================================");
console.log("      ADDIS MARKET SUMMARY       ");
console.log("=================================");

processedOrders.forEach(order => {
    console.log(`Order #${order.id} (${order.customer}): ${format(order.total)}`);
});

console.log("\n--- HIGH VALUE ORDERS (> 500 ETB) ---");
highValueOrders.forEach(order => {
    console.log(`Order #${order.id} (${order.customer}): ${format(order.total)}`);
});

console.log("\n=================================");
console.log(`GRAND TOTAL: ${format(grandTotal)}`);
console.log("=================================");
//day18