# Debuggers - A complete beginner friendly breakdown
Think of this as: **Variables -> Functions -> Conditionals -> Loops**

## 1. What is a Debugger?
A debugger is a tool that allows you to **pause**, **inspect**, **control** and **analyze** a running program.

**Without a debugger:**
* You run the whole program
* You add `console.log` everywhere and hope you see the issue.

**With a debugger:**
* You stop the program exactly where you want.
* You inspect variables, call stack, memory, execution flow.
* You execute line-by-line and see what's happening.

Debuggers are for **observing** and **controlling** execution. Think of a debugger as a *microscope* for code.

## 2. Core purpose of a Debugger.

**A debugger helps you answer questions like:**
* What is the value of this variable *at this exact moment?*
* Which function called which function?
* Why is this loop not running the expected number of times?
* Why is value undefined?
* Where did this error originate?
* Which path of execution is taken?

Debuggers give *visibility* into a system that normally runs too fast to inspect.

## 3. The Mental Model - How a Debugger works?
A debugger does two things:

1. Pauses the program at specific places
* So you can inspect state.

2. Lets you control execution
* So you can decide how the program continues.

Everything in debugger revolves around these two capabilities.

## 4. Key Concepts (the "basic vocabulary")
These are **variables, loops, conditionals** of debugging.

### 4.1 Breakpoints
A breakpoint tells the runtime: **"Stop here when you reach this line"**

* Set on a line of code.
* Program pauses before running that line.

Breakpoints are the most fundamental feature of debugging.

### 4.2 Step Controls
These are your "loop controls" of debugging.

**Step Over**:
* Execute the current line; don't enter any functions inside it.

**Step Into**:
* Enter a function call on the current line.

**Step Out:**
* Finish the current function and return to its caller.

**Resume / Continue**
* Run until next breakpoint

### 4.3 Call Stack
A call stack is a list of functions that led to the current point.

**Example Stack:**
```
main()
 └─ fetchData()
      └─ parseJSON()
           └─ (paused here)
```

The debugger lets you:
* Select any stack frame
* Inspect variables in that frame
* See how you arrived here

This is one of the most powerful parts of debugging.

### 4.4 Scopes & Variables
Debuggers show variables in categories:
* **Local scope** (variables inside the current function)
* **Closure scope** (captured variables)
* **Global scope**
* **Block scope** (for `let` / `const`)

### 4.5 Watch Expressions
You can track an expression while stepping:
```
user.name
items.length
counter > 5
this.state.value
```
Debuggers evaluates the expression every time execution pauses.

### 4.6 Conditional Breakpoints
A breakpoint that only triggers if a condition is true.

**Example:**
* Break only when `id === 42`
* Break only after index 100
* Break only when `name === undefined`

Helps debug loops and large batches of data.

### 4.7 Logpoints (tracepoints)
A breakpoint that **does NOT pause**, but prints a message.

**Example:**
* Log "value = {x}" every time this line runs without modifying code and without stopping execution.

## 5. Under the Hood - How a Debugger pauses code?
This is "how computers work" part of debugging knowledge.

### 5.1 Most runtimes include a debug protocol
Examples:
* **Chrome/Node -> V8 Inspector Protocol**
* **Python -> pdb and internal hooks**
* **Java -> JDWP**
* **C/C++ -> gdb via ptrace / break instructions**

Your IDE talks to the runtime through this protocol.

**Workflow**
1. You set a breakpoint in the IDE.
2. IDE sends a message to the runtime: "pause at file X, line Y"
3. Runtime inserts a checkpoint at that location
4. When runtime hits it, it stops execution
5. Runtime notifies IDE: "Paused here"
6. IDE requests variables, stack frames, etc.
7. You step, inspect and continue

### 5.2 How breakpoints work technically
Depending on the language/runtime:

**High-level languages (JS, Python, Java)**

The interpreter or VM simply checks:
```
if current_line == breakpoint_line: pause()
```

**Native code (C, C++)**

They use CPU instructions:
* Insert an **INT3** interrupt instruction (`0xCC`)
* CPU stops and hands control to debugger

### 5.3 Source Maps
If code is transformed (Typescript -> JS, minified JS -> readable source):
* Breakpoints must map from original code -> generated code.
* Source maps describe this translation

Debugger uses source maps to:
* Render original code in the UI
* Pause at the correct spot in compiled code

## 6. Why Debuggers are necessary?

### 6.1 Logging is Linear
You log before/after events, but you cannot stop mid-execution.

### 6.2 Debuggers give snapshots
You see:
* What is the value *right now*
* Why it became that value
* What called this function
* Why a branch was taken

### 6.3 Debuggers help with:
* Heisenbugs (bugs that appear with console.log)
* Race conditions
* Async flow
* Memory leaks
* Performance bottlenecks

Logging cannot achieve this

## 7. Modes of Debugging

### 7.1 Launch Mode
IDE starts the program with debug options enabled.

### 7.2 Attach Mode
Program is already running; you attach a debugger to it.

Used for:
* Production debugging
* Debugging serves you cannot restart
* Debugging remote systems

## 8. Types of Debuggers

### 8.1 Interactive/GUI Debuggers
* VS Code
* Chrome Devtools
* JetBrains IDEs
* Xcode
* Visual Studio

### 8.2 Command-line debuggers
* `gdb`
* `lldb`
* `pdb`
* `node inspect`

### 8.3 Remote Debuggers
* Use Websockets, TCP, or custom protocols to connect to running processes.

## 9. Advanced Features (once basics are mastered)
* Exception breakpoints
* Data breakpoints (break when variable changes)
* Heap snapshots
* CPU profiling
* Async stack traces
* Time-travel debugging (reverse execution)
* Code hot-swapping

## 10. Debugging Philosophy (What makes a good Debugger user)
* Start from the cause, not the symptom
* Reproduce consistently
* Break early in the execution
* Trace the data flow
* Use conditional breakpoints instead of spammy logs
* Inspect the call stack often
* Debug the smallest reproducible example