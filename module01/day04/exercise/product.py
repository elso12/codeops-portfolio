class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity
        
    def restock(self, amount):
        self.quantity += amount
        print(f"Restocked {amount} units of {self.name}. New quantity: {self.quantity}")
        
    def sell(self, amount):
        if amount <= self.quantity:
            self.quantity -= amount
            print(f"Sold {amount} units of {self.name}. New quantity: {self.quantity}")
        else:
            print(f"Insufficient stock for {self.name}. Available: {self.quantity}")

# --- THIS IS THE NEW CODE TO ADD AT THE BOTTOM ---

# 1. Create a new product (an Apple that costs $1.50, starting with 10 in stock)
my_product = Product("Apple", 1.50, 10)

# 2. Try selling some apples
my_product.sell(3)

# 3. Try restocking
my_product.restock(5)

# 4. Try selling more than we have
my_product.sell(20)