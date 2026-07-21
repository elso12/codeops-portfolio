import time

# Build list and dict of 100,000 fake account numbers
accounts_list = [f"acct{i}" for i in range(100000)]
accounts_dict = {f"acct{i}": i for i in range(100000)}

target = "acct99999"

# Time list lookup
start = time.time()
found = target in accounts_list
end = time.time()
print("List lookup:", end - start)

# Time dict lookup
start = time.time()
found = target in accounts_dict
end = time.time()
print("Dict lookup:", end - start)
