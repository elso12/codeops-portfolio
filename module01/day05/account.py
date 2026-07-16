from ..day04.account import Account

class SavingsAccount(Account):
    def __init__(self, owner, number, balance=0, rate=0.05):
        super().__init__(owner, number, balance)
        self.rate = rate

    def add_interest(self):
        self.deposit(self.balance * self.rate)

    def statement(self):
        print(f"[SavingsAccount] Owner: {self.owner}, Account Number: {self.account_number}, "
              f"Balance: {self.balance} ETB, Rate: {self.rate * 100}% interest")


class CurrentAccount(Account):
    def __init__(self, owner, number, balance=0, overdraft=1000):
        super().__init__(owner, number, balance)
        self.overdraft = overdraft

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if amount > self.balance + self.overdraft:
            raise ValueError("Overdraft limit exceeded")
        self._Account__balance -= amount

    def statement(self):
        print(f"[CurrentAccount] Owner: {self.owner}, Account Number: {self.account_number}, "
              f"Balance: {self.balance} ETB, Overdraft Limit: {self.overdraft} ETB")


# KISS-compliant test block
if __name__ == "__main__":
    sa = SavingsAccount("Abebe", "SA-123", 1000, 0.05)
    sa.statement()
    
    ca = CurrentAccount("Chala", "CA-456", 500, 1000)
    ca.statement()