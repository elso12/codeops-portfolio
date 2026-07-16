from abc import ABC, abstractmethod

class Vehicle(ABC):
    def __init__(self, make, model):
        self.make = make
        self.model = model

    def describe(self):
        return f"This is a {self.make} {self.model}"

    @abstractmethod
    def wheels(self):
        """Each subclass must define its own wheel count"""
        pass


class Car(Vehicle):
    def wheels(self):
        return 4


class Truck(Vehicle):
    def __init__(self, make, model, capacity):
        super().__init__(make, model)
        self.capacity = capacity

    def describe(self):
        return f"This is a {self.make} {self.model} with capacity {self.capacity} tons"

    def wheels(self):
        return 6


# Polymorphism test
vehicles = [
    Car("Toyota", "Corolla"),
    Truck("Isuzu", "NQR", 5),
    Car("Honda", "Civic"),
]

for v in vehicles:
    print(v.describe())
    print(f"Wheels: {v.wheels()}")
    print("---")
