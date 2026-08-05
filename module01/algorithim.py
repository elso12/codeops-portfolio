# Function to get even numbers that are also at even indices
def getEvensOnly(arr):
    # Use list comprehension with enumerate to check both value and index
    result = [num for index, num in enumerate(arr) if num % 2 == 0 and index % 2 == 0]
    print(result)

# Test cases
getEvensOnly([1,2,3,6,4,8])   # Output: [4]
getEvensOnly([0,1,2,3,4,5])   # Output: [0, 2, 4]


# Function to compare a number with its reversed form
def reverseCompare(num):
    # Reverse the number by converting to string and slicing
    reversed_num = int(str(num)[::-1])
    if num > reversed_num:
        print("Ok")
    else:
        print("Not OK")

# Test cases
reverseCompare(72)   # Ok (72 > 27)
reverseCompare(23)   # Not OK (23 < 32)


# Function to calculate factorial iteratively
def returnRefactorial(n):
    if n == 0 or n == 1:
        return 1
    factorial = 1
    for i in range(2, n+1):
        factorial *= i
    return factorial

# Test cases
print(returnRefactorial(5))   # 120
print(returnRefactorial(6))   # 720
print(returnRefactorial(0))   # 1


# Function to check if an array is "Meera"
# A Meera array has no element whose double also exists in the array
def checkMeera(arr):
    for num in arr:
        if num * 2 in arr:
            print("I am not meera array")
            return
    print("I am meera array")

# Test cases
checkMeera([10,4,0,5])    # Not meera (0*2=0 exists)
checkMeera([7,4,9])       # Meera
checkMeera([1,-6,4,-3])   # Meera


# Function to convert seconds into digital clock format (HH:MM:SS)
def digitalClock(second):
    # Wrap seconds within one day (0–86399)
    remaining_second = second % 86400
    hours = remaining_second // 3600
    remaining_second %= 3600
    minutes = remaining_second // 60
    secs = remaining_second % 60
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"

# Test cases
print(digitalClock(5025))    # 01:23:45
print(digitalClock(61201))   # 17:00:01
print(digitalClock(87000))   # 00:10:00


# Function to check if an array is "dual"
# A dual array has even length and every distinct element appears exactly twice
def isDual(arr):
    if len(arr) % 2 != 0:
        return 0
    
    frequency_map = {}
    for num in arr:
        frequency_map[num] = frequency_map.get(num, 0) + 1  
    
    # Verify all counts equal 2
    for count in frequency_map.values():
        if count != 2:
            return 0
    return 1

# Test cases
print(isDual([1, 2, 1, 3, 3, 2]))   # 1 (dual)
print(isDual([2, 5, 2, 5, 5]))      # 0 (5 appears 3 times)
print(isDual([3, 1, 1, 2, 2]))      # 0 (3 appears once)
