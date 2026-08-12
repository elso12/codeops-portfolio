{
  // 1. Set your inputs here
  const billInput = "350"; 
  const partySizeInput = "4";
  const paymentMethod = "TeleBirr"; // Options: 'TeleBirr', 'CBE Birr', or 'Cash'

  // Convert the bill and party size with Number()
  const bill = Number(billInput);
  const partySize = Number(partySizeInput);

  // 2. Add a 10% tip when the bill is over 300 ETB, else 5%
  const tipPercentage = bill > 300 ? 0.10 : 0.05;
  const tipAmount = bill * tipPercentage;

  // 3. Use a switch to add a TeleBirr / CBE Birr service fee
  let serviceFee = 0;
  switch (paymentMethod) {
    case 'TeleBirr':
      serviceFee = 5; // Adjust based on expected.txt
      break;
    case 'CBE Birr':
      serviceFee = 8; // Adjust based on expected.txt
      break;
    default:
      serviceFee = 0;
      break;
  }


  const totalAmount = bill + tipAmount + serviceFee;
  const amountPerPerson = totalAmount / partySize;

  // 5. Print a clear message with a template literal
  console.log(`--- Bill Summary ---
Initial Bill: ${bill.toFixed(2)} ETB
Tip Amount: ${tipAmount.toFixed(2)} ETB
Service Fee (${paymentMethod}): ${serviceFee.toFixed(2)} ETB
--------------------
Total Amount: ${totalAmount.toFixed(2)} ETB
Amount Per Person: ${amountPerPerson.toFixed(2)} ETB`);
}