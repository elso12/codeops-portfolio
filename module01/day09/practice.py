# day09/practice.py

import heapq
from collections import deque

# 1. Build a BST
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root

def inorder(root):
    if root:
        inorder(root.left)
        print(root.value, end=" ")
        inorder(root.right)

# 2. Tree depth
def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))

# 3. Graph BFS
def bfs(graph, start):
    visited = set()
    queue = deque([start])
    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            queue.extend(graph.get(node, []))
    return visited

# 4. Graph DFS
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited

# 5. Priority queue
def priority_queue_demo():
    tasks = [
        (3, "write report"),
        (1, "fix bug"),
        (4, "team meeting"),
        (2, "code review"),
        (5, "deploy release"),
    ]
    heapq.heapify(tasks)
    while tasks:
        print(heapq.heappop(tasks))


if __name__ == "__main__":
    # 1. BST demo
    print("\n--- BST Inorder Traversal ---")
    balances = [500, 200, 800, 300, 100]
    root = None
    for b in balances:
        root = insert(root, b)
    inorder(root)  # should print sorted balances
    print("\nTree height:", height(root))

    # 3 & 4. Graph BFS/DFS demo
    print("\n--- Graph Traversal ---")
    graph = {
        "A": ["B", "C"],
        "B": ["D"],
        "C": ["E"],
        "D": ["F"],
        "E": [],
        "F": []
    }
    print("BFS from A:", bfs(graph, "A"))
    print("DFS from A:", dfs(graph, "A"))

    # 5. Priority queue demo
    print("\n--- Priority Queue ---")
    priority_queue_demo()
