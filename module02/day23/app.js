const STORAGE_KEY = "addiseats_cart";
const ETHIOPIAN_PHONE_REGEX = /^(?:\+251|251|0)?9\d{8}$/;

const INITIAL_DISHES = [
{ id: 1, name: "Doro Wat", category: "Main", price: 240, spicy: true, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=400&q=80" },
{ id: 2, name: "Shiro", category: "Vegetarian", price: 120, spicy: false, image: "https://images.unsplash.com/photo-1548943487-a2e4d43b0068?auto=format&fit=crop&w=400&q=80" },
{ id: 3, name: "Kitfo", category: "Main", price: 320, spicy: true, image: "https://images.unsplash.com/photo-1673367801386-8a0a99be7f1b?auto=format&fit=crop&w=400&q=80" },
{ id: 4, name: "Tibs", category: "Main", price: 280, spicy: true, image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=400&q=80" },
{ id: 5, name: "Injera Firfir", category: "Breakfast", price: 100, spicy: true, image: "https://images.unsplash.com/photo-1628268909376-e8c56cda23db?auto=format&fit=crop&w=400&q=80" },
{ id: 6, name: "Beyaynetu", category: "Vegetarian", price: 150, spicy: false, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80" },
{ id: 7, name: "Misir Wat", category: "Vegetarian", price: 110, spicy: true, image: "https://images.unsplash.com/photo-1534938665420-4193d6d04d96?auto=format&fit=crop&w=400&q=80" },
{ id: 8, name: "Gomen", category: "Vegetarian", price: 90, spicy: false, image: "https://images.unsplash.com/photo-1595858013149-8c909e13b860?auto=format&fit=crop&w=400&q=80" },
{ id: 9, name: "Atkilt Wot", category: "Vegetarian", price: 100, spicy: false, image: "https://images.unsplash.com/photo-1595995438843-0863071bbaf8?auto=format&fit=crop&w=400&q=80" },
{ id: 10, name: "Derek Tibs", category: "Main", price: 310, spicy: true, image: "https://images.unsplash.com/photo-1544025162-81111420d4d7?auto=format&fit=crop&w=400&q=80" },
{ id: 11, name: "Key Wat", category: "Main", price: 220, spicy: true, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80" },
{ id: 12, name: "Alicha Wat", category: "Main", price: 210, spicy: false, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=400&q=80" },
{ id: 13, name: "Bozena Shiro", category: "Main", price: 180, spicy: true, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
{ id: 14, name: "Ayibe", category: "Side", price: 70, spicy: false, image: "https://images.unsplash.com/photo-1631386111003-8d6bd06554b7?auto=format&fit=crop&w=400&q=80" },
{ id: 15, name: "Kocho", category: "Side", price: 60, spicy: false, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80" },
{ id: 16, name: "Enkulal Firfir", category: "Breakfast", price: 110, spicy: true, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80" },
{ id: 17, name: "Fuul", category: "Breakfast", price: 90, spicy: true, image: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?auto=format&fit=crop&w=400&q=80" },
{ id: 18, name: "Genfo", category: "Breakfast", price: 130, spicy: true, image: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&w=400&q=80" },
{ id: 19, name: "Chechebsa", category: "Breakfast", price: 120, spicy: true, image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=400&q=80" },
{ id: 20, name: "Kik Alicha", category: "Vegetarian", price: 100, spicy: false, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80" }
];

const state = {
dishes: [],
cart: [],
search: ""
};

const menuEl = document.querySelector("#menu");
const searchEl = document.querySelector("#search");
const cartPanelEl = document.querySelector("#cart-panel");
const cartListEl = document.querySelector("#cart-list");
const cartTotalEl = document.querySelector("#cart-total");
const checkoutFormEl = document.querySelector("#checkout");
const nameInputEl = document.querySelector("#name");
const phoneInputEl = document.querySelector("#phone");
const areaSelectEl = document.querySelector("#area");
const formErrorEl = document.querySelector("#form-error");
const confirmationEl = document.querySelector("#order-confirmation");

// Safe Base64 SVG generator so HTML never breaks on image error
function getSafeFallback(name) {
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#2E8B57"/><text x="50%" y="50%" fill="#FFFFFF" font-size="24" font-family="sans-serif" font-weight="bold" text-anchor="middle">${name}</text></svg>`;
return `data:image/svg+xml;base64,${btoa(svg)}`;
}

async function loadDishes() {
state.dishes = INITIAL_DISHES;
render();
}

function render() {
renderMenu();
renderCart();
}

function renderMenu() {
const searchTerm = state.search.trim().toLowerCase();
const filteredDishes = state.dishes.filter(dish =>
dish.name.toLowerCase().includes(searchTerm) ||
dish.category.toLowerCase().includes(searchTerm)
);

if (filteredDishes.length === 0) {
menuEl.innerHTML = `<p class="empty-state">No dishes match "${state.search}".</p>`;
return;
}

menuEl.innerHTML = filteredDishes.map(dish => {
const safePrice = Number(dish?.price ?? 0);
const fallback = getSafeFallback(dish.name);
return `
<article class="dish" data-id="${dish.id}">
<img 
    src="${dish.image}" 
    alt="Photo of ${dish.name}" 
    class="dish-img" 
    loading="lazy" 
    onerror="this.onerror=null; this.src='${fallback}';" 
/>
<span class="dish-category">${dish.category ?? "General"}</span>
<h3>${dish.name} ${dish.spicy ? "🌶️" : ""}</h3>
<p class="price">${safePrice} ETB</p>
<button class="add" type="button">Add</button>
</article>
`;
}).join("");
}

function renderCart() {
if (state.cart.length === 0) {
cartListEl.innerHTML = `<li class="empty-state">Your cart is empty.</li>`;
} else {
cartListEl.innerHTML = state.cart.map(item => {
const itemTotal = Number(item?.price ?? 0) * Number(item?.qty ?? 1);
return `
<li data-id="${item.id}">
<span>${item.qty}x ${item.name}</span>
<div class="cart-controls">
<span class="price" style="margin-bottom: 0;">${itemTotal} ETB</span>
<button class="rm" type="button" aria-label="Remove ${item.name}">✕</button>
</div>
</li>
`;
}).join("");
}
cartTotalEl.textContent = `Total: ${calculateCartTotal()} ETB`;
}

function calculateCartTotal() {
return state.cart.reduce((sum, item) => sum + (Number(item?.price ?? 0) * Number(item?.qty ?? 0)), 0);
}

function saveCart() {
localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
}

function loadCart() {
try {
const stored = localStorage.getItem(STORAGE_KEY);
if (stored) {
state.cart = JSON.parse(stored);
}
} catch {
state.cart = [];
}
}

function validateCheckout({ name, phone }) {
if (!name.trim()) return "Please enter your full name.";
if (!ETHIOPIAN_PHONE_REGEX.test(phone.trim())) return "Enter a valid Ethiopian phone.";
if (state.cart.length === 0) return "Your cart is empty.";
return "";
}

function placeOrder(formData) {
const order = {
...formData,
items: [...state.cart],
total: calculateCartTotal(),
placedAt: new Date().toISOString()
};

state.cart = [];
saveCart();
render();
checkoutFormEl.reset();
formErrorEl.textContent = "";

confirmationEl.innerHTML = `
<strong>✓ Order Confirmed!</strong><br>
Thank you, <b>${order.name}</b>. Your order of <b>${order.total} ETB</b> will be delivered to <b>${order.area}</b>.<br>
TeleBirr prompt sent to <b>${order.phone}</b>.
`;
confirmationEl.classList.remove("hidden");
}

searchEl.addEventListener("input", (e) => {
state.search = e.target.value;
renderMenu();
});

menuEl.addEventListener("click", (e) => {
if (!e.target.matches(".add")) return;
const card = e.target.closest(".dish");
if (!card) return;
const dishId = Number(card.dataset.id);
const selectedDish = state.dishes.find(d => d.id === dishId);
if (!selectedDish) return;
const existingLine = state.cart.find(item => item.id === dishId);
if (existingLine) {
existingLine.qty += 1;
} else {
state.cart.push({ ...selectedDish, qty: 1 });
}
confirmationEl.classList.add("hidden");
saveCart();
renderCart();
});

cartPanelEl.addEventListener("click", (e) => {
if (!e.target.matches(".rm")) return;
const itemRow = e.target.closest("li");
if (!itemRow) return;
const dishId = Number(itemRow.dataset.id);
state.cart = state.cart.filter(item => item.id !== dishId);
saveCart();
renderCart();
});

checkoutFormEl.addEventListener("submit", (e) => {
e.preventDefault();
const formData = {
name: nameInputEl.value,
phone: phoneInputEl.value,
area: areaSelectEl.value
};
const errorMessage = validateCheckout(formData);
formErrorEl.textContent = errorMessage;
if (errorMessage) return;
placeOrder(formData);
});

async function init() {
loadCart();
await loadDishes();
}

init();