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

## Part 2: Debugging Internals (How Debuggers actually work)

### 2.1 What happens when you hit a breakpoint?
Debugging relies on one fundamental mechanism:
> **The debugger has the ability to interrupt execution at precise points and inspect internal state**

When execution reaches a breakpoint:
1. The runtime pauses the execution thread
2. It collects:
    * current instruction pointer
    * call stack frames
    * variables & scopes
    * closures
    * heap references
3. It sends a "paused" event to the debugger client
4. The debugger displays:
    * line of code
    * variables
    * call stack
    * watches
5. The debugger waits for your next command:
    * continue
    * step over
    * step into
    * evaluate expression

This pause/resume control is the core of debugging.

### 2.2 How the debugger communicates with the runtime
Debuggers communicate through **protocols**.

**Examples:**
* **V8 Inspector Protocol** -> Node.js, Chrome
* **DAP(Debug Adapter Protocol)** -> VS Code wrapper
* **GDB Remote Protocol** -> C/C++
* **JDWP** -> Java
* **pdb hooks** -> Python

A debugger session is like a chat:
```
IDE -> Runtime: Set breakpoint at file X line 42
Runtime -> IDE: Breakpoint #7 set at actual code offset 52
Runtime -> IDE: Paused at offset 52
IDE -> Runtime: Step over
Runtime -> IDE: Paused at offset 53
... and so on
```
Every step is a message.

### 2.3 How breakpoints are implemented?
There are **two physical mechanisms** for breakpoints depending on language:

**A. VM/interpreter breakpoints (Javascript, Python, Ruby, Java, C#, etc.)**

The interpreter/VM simply checks:

**"Is this instruction a breakpoint location?"**

If yes, it stops execution.

The VM inserts internal markers at the given instruction pointer.

This is easy for languages that run on high-level VMs with bytecode.

**B. Native breakpoints (C/C++)**

Native debugging works differently.

To pause a CPU instruction, debuggers insert:
```
INT3 (0xCC)
```

- a CPU interrupt instruction.

The CPU stops and transfers control to the debugger. This is how **GDB, LLDB, WinDbg** work internally.

### 2.4 How stepping works (the details)
Stepping relies on instruction-level control.

**Step Into**

Pause after the next instruction, even if it's inside another function.

**Step Over**
* If a function call is on the current line:
    * Set a **temporary breakpoint** at the next line in the current frame.
    * Resume execution
    * Pause when temporary breakpoint hits

**Step Out**
* Set breakpoint at return address of the current frame
* Resume
* Pause when return instruction is reached
> Behind the scenes, stepping is implemented by adding temporary breakpoints based on the call stack.

### 2.5 How debuggers capture the call stack
Every runtime maintains a **stack**:
```
Frame #3: parseJSON()
Frame #2: fetchData()
Frame #1: main()
```

Every frame contains:
* local variables
* arguments
* return address
* function context/closure
* instruction pointer

When paused, debugger reads the runtime's stack data structure.

* In native languages, stack frames are actually memory stacks.
* IN VM (JS, Python), stack frames are objects in the runtime. 

### 2.6 How debuggers read variables
Variables live in "scope objects":
* local scope
* closure scope
* block scope
* global scope

The runtime keeps references. When paused, the debugger queries:
```
Give me all variables in Frame #3:
    - locals
    - closure variables
    - classes / this
    - block variables
```
The debugger then walks the scope chain.

### 2.7 How expressions are evaluated?
When you type into the "console" of the debugger (like VS Code debug console):
```
user.name
items.length
calculateTotal(price, tax)
```
The debugger does:
* Inject your expression into the paused VM context
* Execute it in the current scope
* Capture returned value
* Send result back to IDE

This is why evaluating expressions **can have side effects**

### 2.8 Debugging transformed code (minified, bundled, transpiled)
This is crucial for TS -> JS.

To map breakpoints to the original code, debuggers use:

**Source Maps**

A source map file answers:
> "Line 10 in generated code corresponds to line 3 in original file"

A debugger:
* Reads the source map
* Translates breakpoint
* Shows original source UI
* Pauses at correct generated location

**Without source maps**:
* Breakpoints become offset or incorrect
* Stack traces point to compiled JS, not TS

### 2.9 Debugging asynchronous code (Javascript)
Debugging async is complex.

Challenges:
* Execution threads don't remain active
* Call stack disappears during `await`
* Context jumps across event loop ticks

Modern V8 implements **async stack traces** by storing "promise parents".

So you see:
```
main()
  at doSomething()
    at await fetchData()
      at someAsyncFn()
```
This isn't the real stack - it's a reconstructed stack created by V8 debugger tooling.

### 2.10 Exception breakpoints
Debuggers can pause on:
* thrown exceptions
* caught exceptions
* uncaught errors

Internally:
* runtime checks for throw events
* debugger pauses before propagating exception
* debugger reports location & call stack

### 2.11 Remote debugging
Debugger connects over:
* Websockets (Node, Chrome)
* TCP (GDB remote)
* IDE adapters

Remote debugging works by:
1. Process starts with debugger server
2. IDE connects using a protocol
3. Breakpoints & control flow work normally

**Example (Node):**
```
node --inspect=0.0.0.0:9229
```
IDE connects to port 9229

### 2.12 Why debugger slow programs down
* VM must maintain extra metadata (symbols, maps)
* JIT optimization is disabled or downgraded
* Pausing/resuming introduces sync points
* Breakpoints insert overhead
* Source maps require lookup

This is why production debugging is slow vs. development mode

### 2.13 Time-travel debugging (advanced)
Modern debuggers (Chrome, replay.io, LLDB) allow:
* reverse stepping
* replaying execution
* examining past states

This works by recording:
* all inputs
* nondeterministic events
* memory writes

Replay systems record the entire execution log. This is advanced but useful to know exists.

### 2.14 Debugger vs Profier vs Tracer (differences)
| Tool | Purpose |
|------|---------|
| Debugger | Pause & inspect execution flow |
| Profiler | Measure CPU/heap usage over time |
| Tracer | Logs every instruction or event, no pause |
| Instrumenter | Injects logs or counters into code |

Debuggers lets you stop and inspect; profilers measure performance.

### 2.15 How IDEs (VS Code, Jetbrains) talk to debuggers
VS Code uses:
* **Debug Adapter Protocol (DAP)**
* Adapter translates IDE commands -> runtime debugger commands

**Example:**
```
VS Code -> Adapter -> Node Inspector Protocol -> Node runtime
```

### 2.16 Why debugging is deterministic (usually)
* Program pause stops the world
* No new events are processed
* No code runs unless you resume

This makes debugging repeatable.

Exception:
* multi-threaded programs
* race conditions
* timing-sensitive code

## Part 4: Hands-on Debugging
We will use Node.js examples, and the concepts apply to all debuggers (Go, Python, Java, C++ etc)

### Step 1: Create a simple file.
> Check out: basic_example.js

### Step 2: Run the Node's built-in debugger
Node has built-in inspector. Run:
```
node --inspect-brk index.js
```
What this does:
* `--inspect` opens a debug Websocket on port 9229
* `--inspect-brk` also breaks before executing the first line

You'll see:
```bash
Debugger listening on ws://127.0.0.1:9229/...
```

### Step 3: Open Chrome Devtools as a debugger
Open this in Chrome: `chrome://inspect`. You now have a full GUI debugger

### Step 4: Learn Breakpoints in practice
In the source panel:
1. Open `index.js`
2. Click next to the line numbers to set breakpoints

Example:
* Breakpoint at `return a + b`
* Breakpoint at `console.log(...)`

Now hit **Resume** (play button) and watch the debugger stop.

### Step 5: Step Through Execution
When debugger stops, try these:

* **Step Over (F10)**: Executes current line but doesn't go inside functions.
* **Step Into (F11)**: Goes inside called functions (eg. inside `add` when hitting `double`)
* **Step Out(Shift+F11)**: Finish current function and return to the caller.

This gives you initution for call stacks + execution flow.

### Step 6: Inspect Variables + Scope
Pause at the `add()` function. Look at right panel:

**Locals**
```
a: 5
b: 5
```

**Scope Chain**
* Local scope
* Closure scope
* Module scope
* Global scope

**Hover Inspection**

Hover over `n`, `a` or `b` -> Devtools shows values inline. This demonstrates how debuggers read memory values.

### Step 7: Watch Expressions
In Watch panel:
* Add `a`
* Add `b * 10`
* Add `typeof double`

Watches update live on each step. This teaches expression evaluation under the hood.

### Step 8: Call Stack Exploration
When inside `add()` you'll see:
```
add
double
(anonymous) <- entry point
```
You can click each stack frame and view variables *at that level* - demonstrating how the debugger walks stack frames.

### Step 9: Conditional Breakpoints
Right-click on a breakpoint -> "Edit breakpoint". Try:
```
a > 5
```
The debugger will stop **only when condition is true**. Debuggers internally evaluate the condition in the paused VM context.

### Step 10: Exception Breakpoints
In Devtools sidebar, enable:
* Pause on exceptions
* Pause on caught exceptions (optional)

## Advanced
1. Debugging **async functions**
2. Debugging **Promises**
3. Debugging **event loops & timers**
4. Debugging **errors & crashes**
5. Debuggin in **VS Code**
6. Debugging **real node apps**
7. Remote debugging (Docker, SSH, PM2, etc.)
8. Advanced breakpoints (logpoints, data breakpoints)

## Section 4B - Debugging Async code
> Checkout file: `advanced/async-example.js`

Debug it:
```
node --inspect-brk async-example.js
```

### What to observe?
1. Break before `await fetchUser(42)`
* Place breakpoint on this line and hit Resume.
* Then press **Step Over**
* You'll notice:
    * The debugger pauses immediately
    * But execution resumes only after the promise resolves.
    * Node/V8 jumps you to after `await`

This demonstates **how V8 pauses async execution**

## Section 4C - Debugging Promise Chains
> Checkout: `advanced/promise-chains.js`

Check: Pause on uncaught errors/exceptions

## Section 4D - Debugging Event Loop & Timers
> Checkout: `advanced/timers.js`

## Section 4E - Debugging Crashes
> Checkout: `advanced/debugging-crashes.js`
Enable:
* Pause on exceptions
* Pause on caught exceptions

You will land exactly on the offending line.

You can inspect:
* call stack
* local variables
* execution context

## Section 4F - Debugging in VS Code (Most used in Real work)
1. Open folder in VS Code.
2. Create `.vscode/launch.json`
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug File",
      "program": "${file}"
    }
  ]
}
```
Now press **F5** to launch debugger.

**What VS Code gives you:**
* Breakpoints
* Conditional breakpoints
* Logpoints (super useful)
* Variable panel
* Call stack
* Watch pane
* Terminal + Debug console
* Async call stack

## Section 4G - Debugging a Real Node Server
> Checkout: `advanced/server.js`

Debug with: `node --inspect server.js`

Set breakpoints inside request handler.

**Useful tricks**
* Debug multiple requests
* Inspect headers/body
* Trace async chain (timers, promises)
* Use VS Code's "Restart server on file change"

## Section 4H - Remote Debugging
**Debug a node process running on server:**
```
node --inspect=0.0.0.0:9229 app.js
```

SSH-port-forward:
```
ssh -L 9229:localhost:9229 user@server
```
Attach debugger from your local VS Code.

## Section 4I - Advanced Breakpoints
1. Conditional Breakpoint
Right-click -> Edit breakpoint
```
x > 10 && user.isAdmin
```

2. Logpoints (no stop)
Right-click -> Add Logpoint
```
User is %o
```
Debugger prints message **without halting execution**. Very help when logs are noisy

3. DOM Breakpoints (for browsers)

4. Data breakpoints (in languages with direct memory access)
Not available in JS, but exists in C++/Rust debuggers

## Part 3 - Deep Debugger Internals
We will go section by section:
* 3A - How breakpoints really work under the hood
* 3B - How a debugger attaches to a running process
* 3C - How source maps work (TS -> JS)
* 3D - How async debugging works internally
* 3E - How scopes, closures, variables are stored in V8

Each section will have:
* Theory
* Code example
* What the debugger is actually doing behind the scenes

## 3A - How Breakpoints Really Work
Breakpoints look simple ("pause here"), but internally, they're suprisingly complex.

### 3A-1: What is a breakpoint?
A breakpoint is not a **magical marker**. It is literally:

**A deliberate CPU instruction or bytecode instruction inserted into your program so the VM stops.**

In low-level CPUs, it inserts:
* an **INT 3 (interrupt)** instruction in x86
* which forces the CPU to trap into the debugger 

In JavaScript (V8), breakpoints exists at the **bytecode level**, not CPU level.

### 3A-2: How V8 represents breakpoints
When your JavaScript is parsed:
```
console.log("hello");
const x = 40 + 2;
```

V8 compiles it into **bytecode**. For example:
```
0: LdaConstant ...
1: Star r1
2: LdaSmi 40
3: Add r1, #2
4: Return
```
A breakpoint modifies this bytecode:
* At offset 3, V8 inserts a **DebugBreak** instruction.
* This "trap" instruction notifies the debugger.

### 3A-3: How stepping works
When you press: **Resume**

Debugger removes the break opcode -> original bytecode restored -> execution continues.

**Step Over / Step In / Step Out**

Debugger sets **temporary breakpoints** on the next instruction(s).

Stepping works by scheduling micro breakpoints dynamically.

### 3A Example: Viewing V8 bytecode
```
function add(a, b) {
    return a + b;
}
add(2, 3);
```

Run with V8 flags:
```
node --print-bytecode bytecode.js
```
You'll see output like:
```
0x... <Bytecode for function add>
0: Ldar a0
1: Add a1
2: Return
```

If you set a breakpoint inside DevTools, V8 replaces instruction #1 with a **DebugBreak**

### Summary of 3A
**Breakpoints work by:**
* Inserting "trap" bytecode instructions
* Pausing the VM thread
* Allowing the debugger to inspect scope/variables
* Restoring original bytecode upon resume