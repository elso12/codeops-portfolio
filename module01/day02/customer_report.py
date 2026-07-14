# 1. Store at least five customers as a list of (name, balance) pairs
customers = [ 
    ("Almaz", 1500), 
    ("Dawit", 700), 
    ("Tigist", 200), 
    ("Hanna", 1200), 
    ("Samuel", 450), 
] 

# 2. Function to determine tier based on TeleBirr balance
def tier(balance): 
    if balance >= 1000: 
        return "Premium" 
    elif balance >= 500: 
        return "Standard" 
    return "Basic" 

# 3. Initialize counter variables for the summary report
premium_count = 0
standard_count = 0
basic_count = 0

print("--- Customer Tier Report ---")

# 4. Loop over customers, print details, and update tier counters
for name, balance in customers: 
    customer_tier = tier(balance)
    print(f"{name:<10} | Tier: {customer_tier:<8} | Balance: {balance:>5} ETB") 
    
    # Track counts for each tier
    if customer_tier == "Premium":
        premium_count += 1
    elif customer_tier == "Standard":
        standard_count += 1
    elif customer_tier == "Basic":
        basic_count += 1

# 5. Print a tidy summary section at the end
print("-" * 45)
print("--- Summary of Tiers ---")
print(f"Premium Customers : {premium_count}")
print(f"Standard Customers: {standard_count}")
print(f"Basic Customers   : {basic_count}")