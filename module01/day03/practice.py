"""
Module 01 - Day 03 Practice
Author: Elsay
Description: Daily practice covering sets, dictionaries, comprehensions, file I/O, and error handling.
"""

import os

# --- 1. Unique cities ---
print("--- Task 1: Unique Cities ---")
cities_list = ["Addis Ababa", "Hawassa", "Dire Dawa", "Addis Ababa", "Bahir Dar", "Hawassa"]
unique_cities = set(cities_list)

print(f"Distinct cities : {', '.join(unique_cities)}")
print(f"Total count     : {len(unique_cities)}")


# --- 2. Price report ---
print("\n--- Task 2: Price Report ---")
groceries = {
    "Teff (1kg)": 120,
    "Coffee Beans": 450,
    "Sugar (1kg)": 90,
    "Shiro (1kg)": 150,
    "Berbere": 350
}

# Using formatting to make the list look like a clean receipt
for item, price in groceries.items():
    print(f"{item:<15} : {price:>5} ETB")


# --- 3. Tax comprehension ---
print("\n--- Task 3: Tax Comprehension ---")
prices = [100, 250, 400, 80]

# List comprehension adding 15% (multiplying by 1.15) and rounding to 2 decimal places
taxed_prices = [round(price * 1.15, 2) for price in prices]
print(f"Original prices : {prices}")
print(f"With 15% tax    : {taxed_prices}")


# --- 4. Cheap items ---
print("\n--- Task 4: Cheap Items ---")
# Comprehension with a condition to filter prices under 200
cheap_items = [price for price in prices if price < 200]
print(f"Prices < 200    : {cheap_items}")


# --- 5. Write & read ---
print("\n--- Task 5: Write & Read ---")
# Using os.path ensures the file is created in the day03 folder, not the root directory
script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, "names.txt")

customers = ["Elsay", "Almaz", "Dawit"]

# Write to the file
with open(file_path, "w") as file:
    for name in customers:
        file.write(f"{name}\n")

# Read from the file
print("Reading from names.txt:")
with open(file_path, "r") as file:
    for line in file:
        print(f"- {line.strip()}")


# --- 6. Safe division ---
print("\n--- Task 6: Safe Division ---")
user_input = input("Enter a number to divide 1000 by: ")

try:
    number = float(user_input)
    result = 1000 / number
    print(f"Success: 1000 / {number} = {result:.2f}")
except ValueError:
    print("Error: You must enter a valid numerical value, not text.")
except ZeroDivisionError:
    print("Error: Math rule violation! Division by zero is not allowed.")