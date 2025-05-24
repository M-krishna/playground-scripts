Step by step walkthrough in phases
----------------------------------

Phase 1: Master the fundamentals
--------------------------------

1. Convert basic arithmetic functions to CPS
2. Transform conditional logic (if/else) to CPS
3. Convert simple loops to CPS recursion

Practice exercises:
-------------------
* Factorial function (normal -> CPS)
* Fibonacci sequence
* Array operations (map, filter, reduce) in CPS
* Simple calculator that chains operations


Phase 2: Control Flow Mastery
-----------------------------
Build real utilities:

1. Error handling system: Create a CPS-based error handling mechanism (like a Maybe monad)
2. Rety mechanism: Build a function that retries operation with backoff.
3. Pipeline processor: Chain multiple transformations with early exit conditions

Key project: Build a validation library where you chain validation rules, accumulate errors, and only proceed if all validations pass