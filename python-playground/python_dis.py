# Comparing the bytecodes of a regular function and a generator function
# write a function that calculates the power of 2 within a given range
# Two types of functions should be implemented:
# One is a regular function and the other one is generator function

import dis

def regular_power_of_two(range_):
    for i in range(0, range_):
        print(f"2 power {i}: {2**i}")


def generator_power_of_two(range_):
    i = 0
    while i < range_:
        yield f"2 power {i}: {2**i}"
        i = i + 1

dis.dis(regular_power_of_two)
#print()
#dis.dis(generator_power_of_two)
