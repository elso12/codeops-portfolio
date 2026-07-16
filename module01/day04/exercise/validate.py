class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        # Using self.quantity here forces it to use the setter validation!
        self.quantity = quantity 

    @property
    def quantity(self):
        return self.__quantity

    @quantity.setter
    def quantity(self, value):
        if value < 0:
            raise ValueError("Quantity cannot be negative")
        self.__quantity = value

    def restock(self, value):
        if value < 0:
            raise ValueError("Restock value cannot be negative")    
        self.__quantity += value

    def sell(self, value):
        if value < 0:
            raise ValueError("Sell value cannot be negative")
        if value > self.__quantity:
            raise ValueError("Not enough stock to sell")
        self.__quantity -= value    


# --- TEST CODE (Flush to the left margin) ---

print("--- Testing Product Validation ---")

# 1. Test creating a valid product
p = Product("Apple", 1.50, 10)
print(f"Created Apple with quantity: {p.quantity}")

# 2. Test a successful sell
p.sell(4)
print(f"Successfully sold 4. New quantity: {p.quantity}")

# 3. Test trying to sell too many (This should trigger your ValueError)
try:
    p.sell(20)
except ValueError as e:
    print(f"Validation Caught: {e}")

# 4. Test trying to create a product with a negative quantity
try:
    bad_product = Product("Banana", 0.50, -5)
except ValueError as e:
    print(f"Validation Caught: {e}")