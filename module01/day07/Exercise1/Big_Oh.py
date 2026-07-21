# day07/practice.py

# 1. Big-O examples

# List index access → O(1)
nums = [1, 2, 3, 4, 5]
print(nums[4])  # Constant time because direct index lookup

# Single loop → O(n)
for x in nums:
    print(x)  # Runs once per element

# Nested loop → O(n^2)
for i in nums:
    for j in nums:
        print(i, j)  # Each pair → quadratic growth

# Dict lookup → O(1)
accounts = {"a1": 100, "a2": 200}
print(accounts["a2"])  # Hash lookup is constant time

# Binary search → O(log n)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

sorted_nums = list(range(1, 100))
print(binary_search(sorted_nums, 77))  # Logarithmic time
