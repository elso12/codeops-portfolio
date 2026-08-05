def find_number():
    results = []
    for n in range(2000,3201):
        if (n % 7 == 0) and (n % 5 != 0):
            results.append(str(n))
    print(",".join(results))   
find_number()

def fact(x):
    if x == 0:
        return 1
    return x * fact(x-1)
user_input = int(input("enter nuber to get factorial"))
print(fact(user_input))
n = int(input("enter number from console"))
d = dict()
for i in range(1, n+1):
    d[i] = i * i
print(d)    