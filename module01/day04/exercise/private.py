class Product:
    """Product with encapsulated quantity."""
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity  # private

    @property
    def quantity(self):
        """Read-only access to quantity."""
        return self.__quantity

    def restock(self, n):
        if n > 0:
            self.__quantity += n

    def sell(self, n):
        if 0 < n <= self.__quantity:
            self.__quantity -= n
        else:
            print("Not enough stock!")

# Test
p = Product("Phone", 15000, 5)
p.sell(2)
print(p.quantity)  # Expected: 3
