from module01.day06.bank import SavingsAccount, CurrentAccount

class AccountRegistry:
    def __init__(self):
        self.by_number = {}   # number -> Account (O(1) lookup)
        self.order = []       # insertion order

    def add(self, acc):
        # Add account to dict and list
        self.by_number[acc.account_number] = acc
        self.order.append(acc.account_number)
        # Give each account its own transaction history stack
        acc.history = []

    def find(self, number):
        # O(1) lookup
        return self.by_number.get(number)

    def list_all(self):
        # Return accounts in insertion order
        return [self.by_number[num] for num in self.order]

    def deposit(self, number, amount):
        acc = self.find(number)
        if acc:
            acc.deposit(amount)
            acc.history.append(("deposit", amount))

    def withdraw(self, number, amount):
        acc = self.find(number)
        if acc:
            acc.withdraw(amount)
            acc.history.append(("withdraw", amount))

    def undo_last(self, number):
        acc = self.find(number)
        if acc and acc.history:
            action, amount = acc.history.pop()
            if action == "deposit":
                # reverse deposit by withdrawing
                acc.withdraw(amount)
                print(f"🔄 Undo deposit of {amount:.2f} ETB for {acc.account_number}. New balance: {acc.balance:.2f} ETB")
            elif action == "withdraw":
                # reverse withdrawal by depositing
                acc.deposit(amount)
                print(f"🔄 Undo withdraw of {amount:.2f} ETB for {acc.account_number}. New balance: {acc.balance:.2f} ETB")


# ------------------ TEST BLOCK ------------------
if __name__ == "__main__":
    # Create registry
    reg = AccountRegistry()

    # Add accounts
    acc1 = SavingsAccount("Alice", "A001", 1000.0)
    acc2 = CurrentAccount("Bob", "C001", 500.0)

    reg.add(acc1)
    reg.add(acc2)

    # Deposit and withdraw
    reg.deposit("A001", 200)
    reg.withdraw("C001", 100)

    # Show balances
    print("\nBalances after transactions:")
    for acc in reg.list_all():
        print(acc.owner, acc.account_number, acc.balance)

    # Undo last transaction for Bob
    reg.undo_last("C001")

    print("\nBalances after undo:")
    for acc in reg.list_all():
        print(acc.owner, acc.account_number, acc.balance)
