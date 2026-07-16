class Account:
    def __init__(self, owner: str, number: str, balance: float = 0.0):
        self.owner = owner
        self.account_number = number
        self.__balance = balance

    @property
    def balance(self):
        """Read-only property for balance."""
        return self.__balance

    def deposit(self, amount: float):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")
        self.__balance += amount

    def withdraw(self, amount: float):
        if amount <= 0:
            raise ValueError("Withdraw amount must be positive.")
        if amount > self.__balance:
            raise ValueError("Insufficient funds.")
        self.__balance -= amount

    def statement(self):
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Balance: {self.__balance} ETB")
