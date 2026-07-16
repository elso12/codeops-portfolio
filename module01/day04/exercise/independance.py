from private import Product

# Independence test
p1 = Product("Laptop", 25000, 10)
p2 = Product("Tablet", 12000, 8)
p3 = Product("Headphones", 2000, 15)

# Change only p1
p1.sell(3)

# Show independence
print("Laptop stock:", p1.quantity)      # Expected: 7
print("Tablet stock:", p2.quantity)      # Expected: 8
print("Headphones stock:", p3.quantity)  # Expected: 15
