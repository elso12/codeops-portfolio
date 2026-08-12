let items = [];

const form = document.getElementById('shopping-form');
const input = document.getElementById('item-input');
const list = document.getElementById('list');
const countDisplay = document.getElementById('item-count');

function render() {
    list.innerHTML = "";
    
    console.log("Current State:", items);
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.setAttribute('data-id', item.id);
        
        if (item.done) {
            li.classList.add('done');
        }
        
        li.innerHTML = `
            <span>${item.name}</span>
            <button class="del">X</button>
        `;
        
        list.appendChild(li);
    });
    
    countDisplay.textContent = items.length;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const itemName = input.value.trim();
    if (itemName === "") return;
    
    items.push({
        id: Date.now().toString(),
        name: itemName,
        done: false
    });
    
    input.value = "";
    render();
});

list.addEventListener('click', function(e) {
    const clickedRow = e.target.closest('li');
    if (!clickedRow) return;
    
    const itemId = clickedRow.getAttribute('data-id');
    
    if (e.target.classList.contains('del')) {
        items = items.filter(item => item.id !== itemId);
    } else {
        const itemToToggle = items.find(item => item.id === itemId);
        if (itemToToggle) {
            itemToToggle.done = !itemToToggle.done;
        }
    }
    
    render();
});