
/*let newElement = document.createElement('div');
let navBar = document.createElement('nav');
console.log(navBar);
console.log(newElement);
newElement.textContent = "CART";
navBar.appendChild(newElement);
document.body.appendChild(navBar);
list.forEach(function(item) {
  item.addEventListener("click", function() {
    let newElement = document.createElement('div');
    newElement.textContent = "CART";
    navBar.appendChild(newElement);
    document.body.appendChild(navBar);
  });
});*/
let form = document.getElementById("#form")
function handleSubmit(event) {
  event.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  console.log(email, password);
}