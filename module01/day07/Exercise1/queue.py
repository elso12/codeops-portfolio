from collections import deque

queue = deque()

# Enqueue 5 customers
for customer in ["C1", "C2", "C3", "C4", "C5"]:
    queue.append(customer)

# Serve them in order
while queue:
    print("Serving:", queue.popleft())
