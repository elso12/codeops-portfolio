"""
Module 01 - Day 03 Inventory
Author: Elsay
Description: A flat-file inventory control system for an Addis Ababa pharmacy.
Demonstrates file I/O, dictionaries, comprehensions, and state persistence.
"""

import os

# Set up safe file paths ensuring it runs smoothly from any terminal
script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, "stock.txt")

# 1. Read stock into a dictionary with error handling
stock = {}
try:
    with open(file_path, "r") as f:
        for line in f:
            if line.strip(): # Skip empty lines
                item, qty = line.strip().split(",")
                stock[item] = int(qty)
    print(f"Loaded {len(stock)} items from flat-file database.")
except FileNotFoundError:
    print("No stock file found — initializing empty inventory.")
    # Bootstrapping initial data so the script has something to process on first run
    stock = {
        "Paracetamol": 50,
        "Amoxicillin": 8,
        "ORS": 15,
        "Vitamin C": 4,
        "Cough Syrup": 12
    }
    print("Seeded default pharmacy stock for demonstration.")

# 2. Function to adjust quantity
def adjust(item, amount):
    # .get() safely handles items that don't exist in the dictionary yet
    stock[item] = stock.get(item, 0) + amount
    action = "Added" if amount > 0 else "Removed"
    print(f"Transaction: {action} {abs(amount)} units of {item:<12} | New balance: {stock[item]}")

print("\n--- Processing Transactions ---")
# Simulate stock changes
adjust("Amoxicillin", -2)  # Dispense
adjust("Vitamin C", 10)    # Restock
adjust("Ibuprofen", 20)    # Add new item to inventory

# 3. Comprehension for low stock items (< 10)
print("\n--- Low Stock Alert (< 10 units) ---")
low_stock = {item: qty for item, qty in stock.items() if qty < 10}

if low_stock:
    for item, qty in low_stock.items():
        print(f"WARNING: {item} is critically low ({qty} remaining).")
else:
    print("All inventory items are adequately stocked.")

# 4. Write updated dictionary back to file
with open(file_path, "w") as f:
    for item, qty in stock.items():
        f.write(f"{item},{qty}\n")

print("\nInventory state successfully synced to flat file.")