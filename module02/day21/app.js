const PHONE = /^(?:\+251|0)9\d{8}$/;

const form = document.querySelector("#signup");
const msg = document.querySelector("#error");
const countDisplay = document.querySelector("#count");

function show(text) {
    msg.textContent = text;
}

function validate({ name, phone }) {
    if (!name || name.length < 2) return "Enter your full name.";
    if (!phone) return "Phone is required.";
    if (!PHONE.test(phone)) return "Enter a valid Ethiopian phone number.";
    return "";
}

function loadUsers() {
    try {
        const raw = localStorage.getItem("signupUsers");
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return []; 
    }
}

let users = loadUsers();
countDisplay.textContent = `People signed up: ${users.length}`;

form.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const name = document.querySelector("#name").value.trim();
    const phone = document.querySelector("#phone").value.trim();

    const error = validate({ name, phone });
    
    if (error) {
        show(error);
        return; 
    }

    show(""); 
    users.push({ name, phone });
    
    localStorage.setItem("signupUsers", JSON.stringify(users));

    countDisplay.textContent = `People signed up: ${users.length}`;
    form.reset();
});