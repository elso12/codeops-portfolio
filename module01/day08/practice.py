import random
# 1. Recursive sum and countdown
def total(nums, idx=0):
    if idx >= len(nums):
        return 0
    return nums[idx] + total(nums, idx + 1)

def count_down(n):
    if n <= 0:
        return
    print(n)
    count_down(n - 1)

print("Recursive sum of [1,2,3,4,5]:", total([1,2,3,4,5]))
print("Countdown from 5:")
count_down(5)
# 2. Binary search
def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

balances = [100, 200, 400, 800, 1600]
print("\nBinary search for 400:", binary_search(balances, 400))
print("Binary search for 999:", binary_search(balances, 999))
# 3. Merge sort
def merge_sort(items):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

rand_list = random.sample(range(1, 50), 10)
print("\nRandom list:", rand_list)
print("Merge sort:", merge_sort(rand_list))
print("Built-in sorted:", sorted(rand_list))
# 4. Sort with a key
people = [("Alice", 1200), ("Bob", 400), ("Charlie", 2500)]
sorted_people = sorted(people, key=lambda x: x[1], reverse=True)
print("\nSorted by balance descending:", sorted_people)
# 5. Two pointers
def has_pair(nums, target):
    i, j = 0, len(nums) - 1
    while i < j:
        s = nums[i] + nums[j]
        if s == target:
            return True
        elif s < target:
            i += 1
        else:
            j -= 1
    return False

nums = [1, 2, 3, 4, 6, 8, 10]
print("\nHas pair summing to 14:", has_pair(nums, 14))
print("Has pair summing to 20:", has_pair(nums, 20))