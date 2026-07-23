from collections import deque

# Preserving your modular architecture across day01 -> day09
from module01.day08.registry import AccountRegistry

# ==========================================
# 1. Branch Tree Modeling & Recursive Total
# ==========================================

class Branch:
    def __init__(self, name, balance=0.0):
        self.name = name
        self.balance = balance
        self.sub_branches = []
        
        # Each branch has its own AccountRegistry
        self.registry = AccountRegistry() 

    def add_branch(self, branch):
        """Adds a child branch to the current branch."""
        self.sub_branches.append(branch)

def total_balance(branch):
    """
    Recursively calculates the total balance of a branch 
    and all of its sub-branches.
    """
    if not branch:
        return 0.0
    
    # Start with the current branch's own balance
    total = branch.balance
    
    # Recursively add the balances of all sub-branches
    for sub in branch.sub_branches:
        total += total_balance(sub)
        
    return total

# ==========================================
# 2. Transfers Graph & BFS Traversal
# ==========================================

def bfs_transfers(graph, start_node):
    """
    Performs a Breadth-First Search (BFS) on the transfers graph 
    to find all reachable branches from a starting branch.
    """
    if start_node not in graph:
        return []

    visited = set()
    queue = deque([start_node])
    reachable = []

    while queue:
        current = queue.popleft()
        
        if current not in visited:
            visited.add(current)
            reachable.append(current)
            
            # Add all unvisited neighbors to the queue
            for neighbor in graph.get(current, []):
                if neighbor not in visited:
                    queue.append(neighbor)
                    
    return reachable

# ==========================================
# 3. Test Block
# ==========================================

if __name__ == "__main__":
    # --- Build the Branch Tree ---
    head_office = Branch("Head Office", 500000.0)
    
    region_north = Branch("North Region", 100000.0)
    region_south = Branch("South Region", 150000.0)
    
    branch_cbe1 = Branch("CBE-1", 25000.0)
    branch_cbe2 = Branch("CBE-2", 30000.0)
    branch_cbe3 = Branch("CBE-3", 45000.0)
    branch_cbe4 = Branch("CBE-4", 20000.0)

    # Assemble the hierarchy
    head_office.add_branch(region_north)
    head_office.add_branch(region_south)
    
    region_north.add_branch(branch_cbe1)
    region_north.add_branch(branch_cbe2)
    
    region_south.add_branch(branch_cbe3)
    region_south.add_branch(branch_cbe4)

    # --- Calculate Recursive Total ---
    bank_total = total_balance(head_office)
    print("--- Bank Hierarchy Total ---")
    print(f"Total Bank Balance (Head Office + all branches): ${bank_total:,.2f}\n")

    # --- Build Transfers Graph ---
    # Directed graph representing authorized transfer routes between branches
    transfers_graph = {
        "CBE-1": ["CBE-2", "CBE-3"],
        "CBE-2": ["CBE-1", "CBE-4"],
        "CBE-3": ["CBE-4"],
        "CBE-4": ["Head Office"],
        "Head Office": []
    }

    # --- Execute BFS ---
    start_branch = "CBE-1"
    reachable_branches = bfs_transfers(transfers_graph, start_branch)
    
    print("--- Transfer Network Reachability ---")
    print(f"Branches reachable for transfers starting from {start_branch}:")
    print(" -> ".join(reachable_branches))