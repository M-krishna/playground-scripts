import time
from queue import Queue

event_loop = Queue()


class Task:
    def __init__(self, generator):
        self.itr = generator
        self.finished = False

    def done(self):
        return self.finished

    def __await__(self):
        while not self.finished:
            yield self

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

def create_task_and_put_in_event_loop(generator):
    task = Task(generator)
    event_loop.put(task)
    return task

tasks = [task1(), task2()]
for task in tasks:
    create_task_and_put_in_event_loop(task)

while not event_loop.empty():
    task = event_loop.get()
    try:
        task.itr.send(None)
    except StopIteration:
        task.finished = True
    else:
        event_loop.put(task)
