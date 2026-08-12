// Sample inputs
const rawBill = "350";
const partySize = 4;
const paymentMethod = "TeleBirr"; 

// TODO 1: Read bill and partySize; convert the bill with Number().
const bill = Number(rawBill);

// TODO 2: Add a 10% tip when the bill is over 300 ETB, else 5%.
let tip = 0;
if (bill > 300) {
    tip = bill * 0.10;
} else {
    tip = bill * 0.05;
}

// TODO 3: Use a switch to add a TeleBirr / CBE Birr service fee.
// (Assume TeleBirr is 5 ETB, CBE Birr is 10 ETB, and Cash is 0 ETB).
let serviceFee = 0;
switch (paymentMethod) {
    case "TeleBirr":
        serviceFee = 5;
        break;
    case "CBE Birr":
        serviceFee = 10;
        break;
    default:
        serviceFee = 0;
        break;
}

// TODO 4: Compute the total and the per-person amount.
const total = bill + tip + serviceFee;
const amountPerPerson = total / partySize;

// TODO 5: Print a clear message with a template literal to match expected.txt exactly.
const outputMessage = `Bill: ${bill} ETB
Tip: ${tip} ETB
Service Fee: ${serviceFee} ETB
Total: ${total} ETB
Amount per person: ${amountPerPerson} ETB`;

console.log(outputMessage);