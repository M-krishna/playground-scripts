# Rety Mechanism

Retry mechanism - Build a function that retries operations with backoff.

"Retry mechanism" - This means that if a particular operation (which you pass to your
function) fails, your function should immediately attempt to execute that operation again.
It shouldn't immediately give up on the first failure.

Why is this useful?
-------------------
Many real-world operations are susceptible to transient failures:
* Network requests: A temporary netwoek glitch, a server being momentarily overloaded,
a brief DNS lookup failure
* Database operations: A brief lock contention, a temporary connection drop.
* Resource availability: A file might be temporarily in use, a queue might be momentarily full.
Retrying these operations can turn a transient failure into a successful outcome without human intervention

Operations (in CPS context)
------------------------------
* In CPS context, an "operation" isn't just a function that returns a value or throws an error.
* It's a function that takes arguments, and then takes at least two more arguments:
`successContinuation` and `errorContinuation`.
* So, the operation you'll be trying will likely have a signature like:
`myUnreliableCpsOperation(arg1, arg2, successContinuation, errorContinuation)`

With Backoff
---------------
This is the crucial part that distinguishes a sophisticated retry mechanism from a simple
one. "Backoff" means that the delay between retry attempts should "increase" over time.

Why Backoff
-----------
* **Don't overwhelm the failing service:** If a service is down or overloaded, retrying immediately and aggresively will only make the problem worse, contributing to the 
overload.
* **Give the system time to recover:** Increasing the delay gives the underlying cause of
failure (eg. a server restarting, network congestion clearing) time to resolve itself.
* **Prevent "thundering herd" problems:** If many clients retry at the exact same moment after a failure, they can collectively overwhelm the service again. Backoff(especially with some "jitter" - a random component added to the delay) helps spread out these retries.

Common Backoff Strategies
-------------------------
* **Linear Backoff:** delay increases by a fixed amount (eg. 1s, 2s, 3s, 4s,....)
* **Exponential Backoff:** Delay doubles or multiples by a factor for each subsequent attempt
(eg. 1s, 2s, 4s, 8s, ...). This is the most common and generally recommended strategy.

Goal:
-----
* Building a function (lets call it `retryCps`) that would look something like this: `retryCps(operationToRetry, maxRetries, initialDelayMs)`
* This `retryCps` function itself should then return another CPS function.
* This returned CPS function is the one you'd actually call to execute the retriable operation.