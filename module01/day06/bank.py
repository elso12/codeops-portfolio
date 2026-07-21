from ..day05.account import (
    SavingsAccount as Day05SavingsAccount,
    CurrentAccount as Day05CurrentAccount,
)


class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000.0
        return cls._instance


class Observer:
    def update(self, message: str):
        raise NotImplementedError("Subclasses must implement update method.")


class SMSAlert(Observer):
    def update(self, message: str):
        print(f"📱 [SMS Alert]: {message}")


class AuditLog(Observer):
    def update(self, message: str):
        print(f"📝 [Audit Log]: {message}")


class ObservableAccountMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._observers = []

    def subscribe(self, observer: Observer):
        if observer not in self._observers:
            self._observers.append(observer)

    def unsubscribe(self, observer: Observer):
        if observer in self._observers:
            self._observers.remove(observer)

    def _notify(self, message: str):
        for observer in self._observers:
            observer.update(message)

    def deposit(self, amount: float):
        super().deposit(amount)
        self._notify(f"[{self.account_number}] Deposited {amount:.2f} ETB. Balance: {self.balance:.2f} ETB")


class SavingsAccount(ObservableAccountMixin, Day05SavingsAccount):
    def __init__(self, owner: str, number: str, balance: float = 0.0, rate: float = None):
        config = BankConfig()
        actual_rate = rate if rate is not None else config.interest_rate
        super().__init__(owner, number, balance, actual_rate)


class CurrentAccount(ObservableAccountMixin, Day05CurrentAccount):
    def __init__(self, owner: str, number: str, balance: float = 0.0, overdraft: float = None):
        config = BankConfig()
        actual_overdraft = overdraft if overdraft is not None else config.overdraft_limit
        super().__init__(owner, number, balance, actual_overdraft)

    def withdraw(self, amount: float):
        super().withdraw(amount)
        self._notify(f"[{self.account_number}] Withdrew {amount:.2f} ETB. Balance: {self.balance:.2f} ETB")


class AccountFactory:
    @staticmethod
    def create(kind: str, owner: str, number: str, balance: float = 0.0):
        kind_clean = kind.lower().strip()
        if kind_clean == "savings":
            return SavingsAccount(owner, number, balance)
        elif kind_clean == "current":
            return CurrentAccount(owner, number, balance)
        else:
            raise ValueError(f"Unknown account type: '{kind}'. Expected 'savings' or 'current'.")


# Executable block to display test outputs
if __name__ == "__main__":
    print("=== 1. Singleton Test ===")
    c1 = BankConfig()
    c2 = BankConfig()
    print(f"Same instance: {c1 is c2}\n")

    print("=== 2. Factory Creation ===")
    sa = AccountFactory.create("savings", "Abebe", "SA-101", 1000)
    ca = AccountFactory.create("current", "Chala", "CA-202", 500)
    sa.statement()
    ca.statement()

    print("\n=== 3. Observer Notifications ===")
    sms = SMSAlert()
    audit = AuditLog()

    sa.subscribe(sms)
    sa.subscribe(audit)
    ca.subscribe(sms)

    print("\n[Interest Deposit on Savings]")
    sa.add_interest()

    print("\n[Overdraft Withdrawal on Current]")
    ca.withdraw(800)