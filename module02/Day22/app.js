const API = "https://open.er-api.com/v6/latest/ETB";
const KEY = "birrwatch";

const state = {
    base: "ETB",
    rates: {},
    watchlist: [],
    amount: 100,
    currency: "USD",
};

const statusEl = document.querySelector("#status");
const form = document.querySelector("#convert-form");
const amountInput = document.querySelector("#amount");
const select = document.querySelector("#currency");
const result = document.querySelector("#result");
const watchUl = document.querySelector("#watchlist");
const addBtn = document.querySelector("#watch-btn");

function load() {
    try {
        const saved = localStorage.getItem(KEY);
        if (saved) Object.assign(state, JSON.parse(saved));
    } catch (err) {
        console.error("Corrupt data");
    }
}

function save() {
    localStorage.setItem(KEY, JSON.stringify({
        watchlist: state.watchlist,
        currency: state.currency,
    }));
}

async function loadRates() {
    statusEl.textContent = "Loading rates...";
    statusEl.className = "status info";
    
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("HTTP " + res.status);
        
        const data = await res.json();
        state.rates = data.rates;
        
        statusEl.textContent = "";
        statusEl.className = "status hidden";
    } catch (err) {
        statusEl.textContent = "Could not load rates.";
        statusEl.className = "status error";
    }
}

function render() {
    const codes = Object.keys(state.rates);
    if (codes.length === 0) return;

    select.innerHTML = codes.map(c => `<option value="${c}">${c}</option>`).join("");
    
    if (!codes.includes(state.currency) && codes.length > 0) {
        state.currency = codes[0];
    }
    
    select.value = state.currency;
    renderWatchlist();
}

function renderWatchlist() {
    if (state.watchlist.length === 0) {
        watchUl.innerHTML = "<li class='empty'>No currencies yet</li>";
        return;
    }
    
    watchUl.innerHTML = state.watchlist.map(c => {
        const r = state.rates[c];
        return `
            <li data-c="${c}">
                <span>1 ETB = ${r} ${c}</span>
                <button class="rm">×</button>
            </li>`;
    }).join("");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const amtString = amountInput.value.trim();
    const regex = /^\d+(\.\d{1,2})?$/;
    
    if (!regex.test(amtString)) {
        result.textContent = "Enter a valid amount (up to 2 decimals).";
        return;
    }

    const amt = Number(amtString);
    if (!amt || amt <= 0) {
        result.textContent = "Enter a valid amount.";
        return;
    }
    
    state.currency = select.value;
    const rate = state.rates[state.currency];
    const out = (amt * rate).toFixed(2);
    
    result.textContent = `${amt} ETB = ${out} ${state.currency}`;
    save(); 
});

addBtn.addEventListener("click", () => {
    const c = select.value;
    if (state.watchlist.includes(c)) return;
    
    state.watchlist.push(c);
    save();
    renderWatchlist();
});

watchUl.addEventListener("click", (e) => {
    if (!e.target.matches(".rm")) return;
    
    const c = e.target.closest("li").dataset.c;
    state.watchlist = state.watchlist.filter(x => x !== c);
    
    save();
    renderWatchlist();
});

async function init() {
    load();
    await loadRates();
    if (Object.keys(state.rates).length > 0) {
        render();
    }
}

init();