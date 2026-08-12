// orders.js
//day18
const orders = [
    { 
        id: 101, 
        customer: "Abebe", 
        items: [{ name: "Teff", price: 150, qty: 2 }, { name: "Coffee", price: 100, qty: 1 }] 
        // Raw: 400. withVat: 460
    },
    { 
        id: 102, 
        customer: "Sara", 
        items: [{ name: "Berbere", price: 250, qty: 2 }] 
        // Raw: 500. withVat: 575
    },
    { 
        id: 103, 
        customer: "Dawit", 
        items: [{ name: "Shiro", price: 90, qty: 1 }] 
        // Raw: 90. withVat: 103.50
    }
];

module.exports = orders;