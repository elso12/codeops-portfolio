# --- 1. Temperature label ---
print("--- Task 1: Temperature Label ---")
temp = float(input("Enter a temperature in °C: "))

if temp < 15:
    print("cold")
elif temp <= 28:
    print("warm")
else:
    print("hot")


# --- 2. Receipt loop ---
print("\n--- Task 2: Receipt Loop ---")
for i in range(1, 11):
    print(f"Receipt #{i}")


# --- 3. Even numbers ---
print("\n--- Task 3: Even Numbers ---")
for i in range(1, 21):
    if i % 2 == 0:
        print(i)


# --- 4. Discount function ---
print("\n--- Task 4: Discount Function ---")
def apply_discount(price, percent=10):
    discount_amount = price * (percent / 100)
    return price - discount_amount

# Testing the function
print(f"Test 1 (Default 10% on $100): ${apply_discount(100)}")
print(f"Test 2 (Custom 25% on $100): ${apply_discount(100, 25)}")


# --- 5. Countdown ---
print("\n--- Task 5: Countdown ---")
count = 5
while count > 0:
    print(count)
    count -= 1
print("Liftoff!")