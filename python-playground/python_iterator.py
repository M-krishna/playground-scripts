class Counter:
    def __init__(self, low, high):
        self.current = low - 1
        self.high = high

    def __iter__(self):
        return self

    def __next__(self):
        self.current += 1
        if self.current < self.high:
            return self.current
        raise StopIteration



class VishnuAvatharam:
    def __init__(self):
        self.avatharams = ["Rama", "Krishna", "Narasimma", "Kalki"]
        self.current = -1

    def __iter__(self):
        return self

    def __next__(self):
        self.current += 1
        if self.current < len(self.avatharams):
            return self.avatharams[self.current]
        raise StopIteration


class VishnuAvatharam2:
    def __init__(self):
        self.avatharams = ["Rama", "Krishna", "Narasimma", "Kalki"]
        self.current = -1

    def __iter__(self):
        return self

    def __next__(self):
        self.current += 1
        while self.current < len(self.avatharams):
            return self.avatharams[self.current]
        raise StopIteration


def counter(low, high):
    current = low
    while current < high:
        yield current
        current += 1



class Example:
    def __init__(self):
        self.val = 10

    def __iter__(self):
        return self

    # if we don't raise StopIteration, it goes on Infinite loop
    def __next__(self):
        if self.val == 10:
            yield self.val
        raise StopIteration




# Generator functions
# Generating fibonaci numbers
def generate_fibonacci_number():
    a, b = 0, 1
    while True:
        yield a
        a, b, = b, a + b



# Even number generator
def generate_even_number():
    i = 0
    while True:
        if i % 2 == 0:
            yield i
        i = i + 1
    

# Square number generator
def generate_square_numbers(range_):
    i = 0
    while i < range_:
        yield i * i
        i = i + 1

# Character counter generator
def generate_character_count(word):
    for c in word:
        yield f"Character: {c}, Count: {word.count(c)}"

# Power of 2 generator
def generate_power_of_two(range_):
    i = 0
    while i < range_:
        yield f"2 power {i}: {2**i}"
        i = i + 1


# generate random integer generator
from random import randint
def generate_random_integer_upto(i, j):
    while True:
        yield randint(i, j)

# Regular function that returns a random number
def regular_random_number_generator(i, j):
    return randint(i, j)



# Trying out the "yield from" keyword. This is used to chain generators
def generator():
    yield "Hello world"


def nested_generator():
    yield generator()

iterator = nested_generator()
print(next(iterator))


# Testing the yield keyword
def testing_yield():
    yield

itr = testing_yield()
print(next(itr)) # prints None

# What's happens when you run the below code
def check_output():
    print("Hello World")
    yield

check_output() # it doesn't print "Hello world", rather it returns a generator object


# Mocking event loop
import time
def sleep(seconds):
    start_time = time.time()
    while time.time() - start_time < seconds:
        yield

def task1():
    while True:
        print("Task 1")
        yield from sleep(1)

def task2():
    while True:
        print("Task 2")
        yield from sleep(2)

def task3():
    for _ in range(3):
        print("Task 3")
        yield

def task4():
    for _ in range(3):
        print("Task 4")
        yield

event_loop = [task3(), task4()]

while True:
    try:
        for task in event_loop:
            next(task)
    except:
        print("DONE")
        break
