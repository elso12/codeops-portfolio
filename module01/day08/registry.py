from module01.day07.registry import AccountRegistry
from module01.day06.bank import SavingsAccount, CurrentAccount
class AccountRegistry(AccountRegistry):
    # 1. Leaderboard
    def top_by_balance(self, n):
        accounts = self.list_all()
        return sorted(accounts, key=lambda acc: acc.balance, reverse=True)[:n]

    # 2. Binary search
    def binary_search(self, arr, target):
        low, high = 0, len(arr) - 1
        while low <= high:
            mid = (low + high) // 2
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        return -1

    def find_by_number(self, number):
        numbers = sorted(self.order)
        idx = self.binary_search(numbers, number)
        if idx != -1:
            return self.by_number[numbers[idx]]
        return None

    # 3. Recursive total
    def total_transactions(self, number, idx=0):
        acc = self.find(number)
        if not acc or idx >= len(acc.history):
            return 0
        _, amount = acc.history[idx]
        return amount + self.total_transactions(number, idx + 1)
# ------------------ TEST BLOCK ------------------
if __name__ == "__main__":
    reg = AccountRegistry()

    # Create sample accounts
    acc1 = SavingsAccount("Alice", "A001", 1000.0)
    acc2 = CurrentAccount("Bob", "C001", 500.0)
    acc3 = SavingsAccount("Charlie", "S001", 2000.0)

    reg.add(acc1)
    reg.add(acc2)
    reg.add(acc3)

    # Transactions
    reg.deposit("A001", 200)
    reg.withdraw("C001", 100)
    reg.deposit("S001", 500)

    # 1. Leaderboard
    print("\nTop accounts by balance:")
    for acc in reg.top_by_balance(3):
        print(acc.owner, acc.account_number, acc.balance)

    # 2. Binary search lookup
    print("\nFind account by number (C001):")
    found = reg.find_by_number("C001")
    if found:
        print(found.owner, found.account_number, found.balance)
    else:
        print("Not found")

    # 3. Recursive total transactions
    print("\nTotal transactions for Alice (A001):")
    print(reg.total_transactions("A001"))
