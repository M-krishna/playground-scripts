# Concurrency Vs Parallelism
But before we look into Concurrency and Parallelism, we need to first understand "What is a Computer, Really?".

## What is a Computer, Really?
At its core, a computer is a machine that **reads an instruction, executes it, and moves to the next one**. That's it. Everything else is built on top of this.

The CPU does this in loop, forever, until you turn it off:
```
1. FETCH - Read the next instruction from memory
2. DECODE - Figure out what the instruction means
3. EXECUTE - Do the thing (add numbers, read memory, jump somewhere)
4. REPEAT
```

This is called the **fetch-decode-execute cycle**. Your computer is doing this billions of times per second right now. 

## Memory is Just a Long Array of Bytes
Imagine memory (RAM) as a giant array, where each slot has an **address** (a number) and holds **one byte** of data:
```
Address:  0    1    2    3    4    5  ...
Value:   [42] [17] [00] [FF] [03] [A1] ...
```

The CPU can do two things with memory:
* **LOAD** - read a value from an address into a register
* **STORE** - write a value from a register into an address

**Registers** are tiny, ultra-fast slots *inside the CPU itself* -- think of them as the CPU's scratchpad. There are a very few of them (maybe 16-32), but they're thousands of times faster than RAM. 

So when your CPU adds two numbers, it actually:
1. LOADs number A from memory into register R1
2. LOADs number B from memory into register R2
3. ADDs R1 + R2, stores result in R3
4. STOREs R3 back into memory

## A Program is Just Instructions + Data in Memory
When you write code in Python or C, the compiler/interpreter translates it into **machine instructions** -- raw binary numbers that the CPU understands. These instructions lives in memory, and the CPU has a special register called the **Program Counter (PC)** or **Instruction Pointer (IP)** that holds the address of the *next instruction to execute.*

```
Memory:
[addr 100]: LOAD R1, addr(200)     ← PC starts here
[addr 104]: LOAD R2, addr(204)
[addr 108]: ADD  R3, R1, R2
[addr 112]: STORE R3, addr(208)

[addr 200]: 5   ← data
[addr 204]: 7   ← data
[addr 208]: 0   ← result will go here
```

The PC automatically increments after each instruction. When there's a `jump` or `branch` instruction (like an `if` or a loop), the PC is set to a different address.

## So What's the Problem? Why Did We Need Anything More?
Imagine you have **one program** running. The CPU executes it instruction by instruction. Life is simple. 

Now imagine your program says:
```
read from disk -> process the data -> write to disk
```
The CPU fires off the "read from disk" instruction. Then it has to **wait**.

How long?
```
CPU register access:       ~0.3 nanoseconds
CPU L1 cache:              ~1 nanosecond
RAM access:                ~100 nanoseconds
SSD read:                  ~100,000 nanoseconds  (100 microseconds)
Network request (local):   ~500,000 nanoseconds  (0.5 milliseconds)
Network request (internet):~50,000,000 nanoseconds (50 milliseconds)
```

A disk read is roughly **100,000x slower** than accessing a register. During that wait, the CPU is doing **absolutely nothing useful** -- it's just sitting idle, burning time.

## The First Solution: Multiple Processes & the Illusion of Concurrency
In the early days (1960s), computers were expensive, shared by many people, and had one CPU. The insight was:

> "While program A is waiting for I/O, why not let program B use the CPU?"

This is the birth of the **operating system** as a manager. The OS would:
1. Run program A for a while.
2. Program A blocks on I/O -> OS **pauses** program A
3. OS **resumes** program B, which runs for a while
4. I/O completes -> OS **resumes** program A

To "pause" and "resume" a program, the OS needs to save the program's entire state -- the PC, all registers, everything. This saved state is called the **context**, and the act of switching from one program to another is called a **context switch**.

The OS stores each program's context in a data structure called the **Process Control Block** (PCB):
```
PCB for Program A:
  - Program Counter: 0x00401234   (where it was when paused)
  - Register R1: 42
  - Register R2: 17
  - Register R3: 0
  - Memory mappings: ...
  - Open files: ...
  - Status: WAITING (for disk I/O)
```

When the OS wants to switch to Program A:
1. Save current CPU state -> into PCB of current program
2. Load PCB of Program A -> into CPU registers
3. Jump to Program A's saved PC

From Program A's perspective, it was never paused. It just *continued*. This is the **illusion of concurrency**.

## What is a Process, Precisely?
A **process** is not just your program's code. It's the OS's complete abstraction of a running program:
* **Code segment** -- the machine instructions
* **Data segment** -- global variables
* **Heap** -- dynamically allocated memory (`malloc`, `new`)
* **Stack** -- local variables, function call frames
* **OS resources** -- open file handles, network sockets
* **An entry in the OS process table** with its PCB

Two processes are **completely isolated** from each other. Process A cannot read Process B's memory. This is enfored by the CPU's **virtual memory** system -- each process thinks it has its own private address space, but the OS maps these to actual physical RAM behind the scenes.

```
Process A thinks:              Process B thinks:
Address 0x1000 = its variable  Address 0x1000 = its variable

Reality (physical RAM):
  Physical 0x8A000 = Process A's variable
  Physical 0x3F000 = Process B's variable
```

This isolation is great for **safety** but terrible for **communication**. If A and B want to share data, they need to go through the OS (via pipes, sockets, shared memory segments) -- which is slow and complicated.

## The Scheduler: The OS's Traffic Controller
The OS component that decides *which process runs when* is called the **scheduler**. It maintains a **run queue** -- a list of all processes that are ready to run.

The simplest scheduling idea is **Round Robin**: give each process a fixed time slice (say, 10ms), then switch to the next one. Liek turns in a game.

```
Time:   0ms      10ms     20ms     30ms     40ms
        [Proc A] [Proc B] [Proc C] [Proc A] [Proc B] ...
```

A process can be in one of these states:
```
         ┌─────────────────────────────┐
         │                             │
NEW ──► READY ──► RUNNING ──► TERMINATED
                  │    ▲
                  │    │
                  ▼    │
                WAITING
             (for I/O etc.)
```

* **READY:** wants to run, but another process is still using the CPU
* **RUNNING:** currently using the CPU
* **WAITING:** blocked, waiting for something external (disk, network, keyboard)

When a process moves to WAITING, the scheduler immediately picks another READY process to run. This is the key mechanism that prevents the CPU from going idle.

## Why Processes Weren't Enough: Enter Threads
Now here's the real-world problem. Say you're building a web server. A request comes in. You read it, process it, sends a response. While you're reading from the socket (I/O), the CPU is idle.

Solution: create a new **process** for each incoming request. But:
* Creating a process is **expensive** -- the OS has to set up a whole new memory space
* Processes's **can't share memory** -- so if two requests need to access the same cache or database connection, you have a problem
* Context switching between processes is **costly** -- saving and restoring the full memory map

What you really want is: **multiple execution flows that share the same memory**.

That's a **thread**.

A thread is like a "lightweight process" that exists *within* a process. Multiple threads share:
* The heap (dynamically allocated memory)
* Global variables
* Open file descriptors

But each thread has its own:
* **Stack** (its own local variables, its own function call history)
* **Program counter** (where it is in execution)
* **Registers** (its own CPU state)

```
Process
├── Shared: Heap, globals, file handles
├── Thread 1: Stack, PC, Registers
├── Thread 2: Stack, PC, Registers
└── Thread 3: Stack, PC, Registers
```

Creating a thread is much cheaper than creating a process. Switching between threads of the same process is also cheaper. And they can communicate by just reading and writing shared memory directly.

This is why servers handle each incoming requests with a thread, not a process.

## And NOW the Real Trouble Begins
Threads sharing memory sounds great. But it immediately creates a terrifying problem.

Say two threads both want to increment a counter:
```python
# Thread 1 and Thread 2 both run this:
counter = counter + 1
```

Simple, right? Wrong. At the machine instruction level, this is actually **three steps**:
```
LOAD  R1, counter    # read counter from memory into register
ADD   R1, R1, 1      # add 1 to it
STORE R1, counter    # write it back to memory
```

Now imagine Thread 1 and Thread 2 run this at the "same time" (interleaved by the scheduler):
```
counter starts at 0

Thread 1: LOAD R1, counter      → R1 = 0
Thread 2: LOAD R1, counter      → R1 = 0   (reads SAME old value!)
Thread 1: ADD  R1, R1, 1        → R1 = 1
Thread 2: ADD  R1, R1, 1        → R1 = 1
Thread 1: STORE R1, counter     → counter = 1
Thread 2: STORE R1, counter     → counter = 1   (overwrites!)

Final value: 1  ← WRONG. Should be 2.
```

Both threads read the same old value, both computed the same new value, and one overwrote the other. The increment is **lost**.

This is called a **race condition** -- the result depends on the unpredictable *timing* of how threads are scheduled. It's non-deterministic. It might work 999 times and fail the 1000th time.

## This is Exactly Where We'll Go Next
We've now arrived at the core problem of concurrency. Everything from here -- mutexes, semaphores, locks, atomic operations, memory models, lock-free programming -- is humanity's answer to this one fundamental problem:

> How do you safely coordinate multiple threads accessing shared memory?

Each solution comes with its own trads-offs, failure modes (deadlock, livelock, starvation), and the reason more complex models (actors, CSP, STM) were invented because simpler ones kept failing in subtle ways.


Now let's take a look at Parallelism.

# Why Did Multi-Core Even Happen? The Physics Problem.
Let's go back to the CPU. For decades (1970s-2000s), the way to make computers faster was simple: **make the clock faster**.

The clock is a crystal oscillator that sends a regular electrical pulse to the CPU. Every pulse = one cycle. The CPU does work in cycles. Faster clock = more cycle per second = more instructions per second.

This beautifully worked. Clock speeds went:
```
1971 (Intel 4004):   740 KHz       (740,000 cycles/sec)
1993 (Pentium):      60  MHz       (60,000,000 cycles/sec)
2000 (Pentium 4):    1.5 GHz       (1,500,000,000 cycles/sec)
2004 (Pentium 4):    3.8 GHz       ← and then... it stopped
```

Why did it stop? **Physics**.

## The Heat Problem
A transistor is a tiny switch -- it's either ON or OFF. Your CPU has billions of them. Every time a transistor switches state, the more heat is generated. By 2004, CPUs are generating so much heat that:
* You couldn't cool them fast enough with normal air cooling
* Increasing clock speed further would **physically melt the chip**
* Power consumption was becoming economically insance.

Engineers hit a hard physical wall. You simply **cannot keep making one core faster** beyond a certain point.

**The Solution: Instead of One Faster Core, Use Multiple Cores**

If you can't make one worker faster, hire more workers.

This is the fundamental idea behind multi-core CPUs. Instead of one CPU running at 10 GHz (impossible), you put **two CPUs at 3 GHz on the same chip**. Physically, on the same piece of silicon.

```
Single Core (old):
┌─────────────────────┐
│   ONE BIG FAST CPU  │  3.8 GHz, melting
└─────────────────────┘

Multi-Core (new):
┌───────────┬─────────┐
│  Core 1   │  Core 2 │  Each at 3.0 GHz, cool and stable
│  3.0 GHz  │ 3.0 GHz │
└───────────┴─────────┘
```

This is the origin of parallelism. Not a software idea -- a **hardware response to a physics problem**.

## What Does "Multiple Cores" Actually Mean Physically?
A core is a **complete, independent CPU**. It has its own:
* Fetch-decode-execute pipeline
* Program counter
* Register file
* L1 cache (tiny, very fast, private to the core)
* L2 cache (slightly bigger, sometimes private)

They share:
* L3 cache (large, shared between all cores)
* RAM controller (access to main memory)
* The same physical chip package

```
┌─────────────────────────────────────────────┐
│                  CPU Chip                   │
│                                             │
│  ┌──────────┐              ┌──────────┐     │
│  │  Core 1  │              │  Core 2  │     │
│  │          │              │          │     │
│  │ Registers│              │ Registers│     │
│  │ L1 Cache │              │ L1 Cache │     │
│  │ L2 Cache │              │ L2 Cache │     │
│  └────┬─────┘              └────┬─────┘     │
│       │                         │           │
│       └──────────┬──────────────┘           │
│                  │                          │
│          ┌───────┴───────┐                  │
│          │   L3 Cache    │  (shared)        │
│          │  (8–32 MB)    │                  │
│          └───────┬───────┘                  │
│                  │                          │
│          ┌───────┴───────┐                  │
│          │ RAM Controller│                  │ 
└──────────┴───────────────┴──────────────────┘
                    │
                   RAM
```
Modern consumer CPUs have 8-24 cores. Server CPUs can have 64-128+ cores.

## Concurrency vs Parallelism -- The Precise Distintion
This is the more important conceptual distinction in this entire subject.

**Concurrency** is about *structure* -- your program is designed to handle multiple things. The OS switches between them rapidly, but **only one runs at a time** on a single core.

```
Single Core — Concurrency (interleaving):

Time ────────────────────────────────────►
      [Thread A][Thread B][Thread A][Thread B]
       ↑ switch ↑  ↑ switch ↑  ↑ switch ↑

Only ONE thing actually executing at any instant.
```

**Parallelism** is about *execution* -- multiple things are **literally running at the same physical instant** on different cores.
```
Multi-Core — Parallelism (simultaneous):

Time ────────────────────────────────────►
Core 1: [Thread A ────────────────────►]
Core 2: [Thread B ────────────────────►]

Both are ACTUALLY executing at the same instant.
```

Rob Pike (one of Go's creators) put it precisely:
> *Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once.*

You can have concurrency without parallelism (one core, many threads). You can even have parallelism without concurrency (multiple cores, each running a separate isolated program with no cooridnation needed). Real-world systems usually have both.

## What Parallelism Actually Buys You -- And Its Limits
With parallelism, if you have N cores and your problem can be perfectly split into N independent pieces, you get Nx speedup.

But almost no real problem is perfectly splittable. Every program has some parts that **must** run sequentially -- you can't start step 2 until step 1 is done.

### Amdahl's Law -- The Fundamental Limit
Gene Amdahl (1976) formalized this. Say your program is 90% parallelizable, 10% sequential.

* With 2 cores: speedup = 1 / (0.10 + 0.90/2) = 1.81x
* With 4 cores: speedup = 1 / (0.10 + 1.90/4) = 3.08x
* With 8 cores: speedup = 1 / (0.10 + 0.90/8) = 4.71x
* With ∞ cores: speedup = 1 / (0.10 + 0.90/∞) = 10x <- hard ceiling

Even with infinite cores, you can get only 10x speedup if 10% of your code is sequential. That 10% becomes the absolute bottleneck.

```
Speedup
  10× │                                    ─────────── (ceiling)
      │                              ──────
   5× │                       ───────
      │               ────────
   2× │        ───────
   1× │────────
      └──────────────────────────────────► Number of cores
        1    2    4    8   16   64   ∞
```
This is why adding more cores doesn't always make programs much faster. The sequential parts kill you.

### The New Problems Parallelism Introduces
With concurrency on a single core, the OS was the one interleaving threads. There was one physical location for memory -- RAM. Life was hard, but at least memory itself was consistent.

With **true parallelism**, you have multiple cores running **simultaneously**, each with their **own private caches**. Now something deeply unsetting happens.

### The Cache Coherence Problem
Every core has its own L1/L2 cache -- a private copy of recently accessed memory. This is what makes cores fast. But now consider:
```
Initial state: variable X = 0 in RAM

Core 1 loads X into its L1 cache → Core 1's cache: X = 0
Core 2 loads X into its L1 cache → Core 2's cache: X = 0

Core 1 sets X = 1 (in its cache)
Core 2 sets X = 2 (in its cache)

What is X in RAM now? 
What does Core 1 see? What does Core 2 see?
```
This is **cache incoherence** -- different cores have different views of the same memory location. If left unchecked, your program's behavior becomes completely unpredictable.

Hardware engineers solved this with a protocol called **MESI** (Modified, Exclusive, Shared, Invalid). Every cache line (a 64-byte chunk of memory) is tagged with one of these states:
* **Modified** -- this core changed it; I'm the only valid copy; RAM is stale
* **Exclusive** -- only I have this; matches RAM; not yet modified
* **Shared** -- multiple cores have this; matches RAM; no one has modified it
* **Invalid** -- my copy is stale; someone else changed it; must fetch fresh

When Core 1 writes to X:
1. Core 1 broadcasts "I'm writing to address X" on the **memory bus**
2. All other cores have X in their cache mark their copy as **Invalid**
3. Core 1 marks its copy as **Modified**
4. If Core 2 now reads X, it sees Invalid -> must fetch the updated value from Core 1's cache or RAM

This happens **automatically in hardware**, billions of times per second, invisibly. But it has a performance cost -- cores are constantly communicating over the bus to keep caches coherent.

### False Sharing -- A Subtle Parallelism Killer
The cache doesn't work at the level of individual variables. It works in **cache lines** -- chunks of 64 bytes at a time.

Say you have two variables sitting next to each other in memory:
```
Memory layout:
│  counter_A  │  counter_B  │  ...  │
│   4 bytes   │   4 bytes   │       │
└─────────────────────────────────────┘
│        One 64-byte cache line       │
```

* Thread 1 on Core 1 only ever touches `counter_A`.
* Thread 2 on Core 2 only ever touches `counter_B`.

They never touch the **same variable**. You'd think there's no sharing problem. But because they're in the **same cache line**, every time Core 1 writes to `counter_A`, the hardware marks the entire cache line as Modified -- and invalidates Core 2's copy. Now Core 2 must re-fetch the whole cache line to update `counter_B`.

They're constantly invalidating each other's cache lines, **even though they're touching different variables**. This is called **false sharing** and it can make a "parallel" program run slower than a sequential one.

The fix is to **pad** variables so they live on separate cache lines:
```c
struct Counter {
    int value;
    char padding[60];  // waste 60 bytes to push next variable to next cache line
};
```
Ugly, but effective.

### The Memory Ordering Problem -- CPU's Lie to You
Here's something that breaks most programmers' mental model.

You write this code in Thread 1:
```
data = 42
ready = true
```

You'd assume `data` is written before `ready`. But the CPU and compiler are **allowed to reorder instructions** as long as the reordering doesn't affect the outcome *from the perspective of a single thread*.

So the CPU might actually execute:
```
ready = true        <- written first!
data = 42
```

From Thread 1's perspective, the result is identical -- it never reads these back. But Thread 2 might see `ready = true` before `data = 42` is written, and read garbage data.

This is the **memory ordering problem**, and it exists because:
* **CPUs reorder instructions** for performance (out-of-order execution)
* **Compilers reorder instructions** during optimization
* **Store buffers** -- a core might write to a local buffer before commiting to cache, so other cores don't see the write immediately.

On a single core, this never mattered -- only one thread, so only one perspective. With mutiple cores running simulataneously, you have **multiple observers**, and they can see things in different orders.

The solution is **memory barries** (also called fences) -- special instructions that tell the CPU: "*don't reorder anything across this point*"

```
data = 42
MEMORY_BARRIES      <- CPU must flush everything above this before proceeding
ready = true
```

This is why concurrent code needs things like `volatile`, `atomic`, `memory_order_acquire/release` in C++, or `synchronized` in Java -- they all insert memory barriers under the hood.

### So What Does True Parallelism Require?
Let's summarize what you need for correct parallel execution. You need all three:

1. **Independence** -- tasks must be breakable into chunks that don't depend on each other, or dependencies must be carefully manged.
2. **Cache Coherence** -- the hardware must keep all cores' views of memory consistent (MESI protocol handles this, but at a cost).
3. **Memory Ordering** -- you must explicitly tell the CPU and compiler when ordering matters, using barriers, atomics, or synchronization primitives.

## The Full Picture Now
```
THE WHOLE STORY

  1971 ──────► Single core, one program at a time
                    │
                    │ Problem: CPU idle during I/O
                    ▼
  1960s-70s ──► Multi-programming (OS switches between processes)
                    │
                    │ Problem: processes too heavy, can't share memory
                    ▼
  1980s-90s ──► Threads (lightweight, shared memory)
                    │
                    │ Problem: shared memory → race conditions,
                    │          locks, deadlocks, etc.
                    ▼
  1990s-00s ──► Synchronization primitives (mutexes, semaphores,
                monitors, condition variables)
                    │
                    │ Problem: clock speed hits physical wall ~2004
                    ▼
  2004+ ──────► Multi-core CPUs (true parallelism)
                    │
                    │ New problems: cache coherence, false sharing,
                    │              memory ordering, Amdahl's Law
                    ▼
  Today ──────► Parallel algorithms, lock-free data structures,
                memory models, NUMA-aware programming,
                GPUs (thousands of tiny cores for data parallelism)
```