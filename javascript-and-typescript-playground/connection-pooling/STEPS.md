# Step by step things I have followed

## Step 1 - `naive.js`
The goal of this file is to demonstrate the problem. Every query open a brand new connection and closes it when done. No reuse whatsoever.

The key to notice:
* `new Client()` vs `new Pool()` - `pg` gives you two exports. `Client` is a single, manual connection. `Pool` is `pg`'s built-in pool (which we will ignore for now and build our own). We are using `Client` delibrately here to feel the pain.

`client.connect()` **is where all the cost is** - the actual `client.query()` call that follows is almost instant by comparison. The setup work (TCP, auth, parameter exchange) is what hurts.

`client.end()` **throws everything away** - every connection teardown is waste, because the very next query will rebuild everything from scratch.

## Step 2 - `pool.js`
A pool is essentially a manager that holds 3 things in memory:
```
Pool
 ├── idle[]      → connections that are open and available to use
 ├── busy[]      → connections currently being used by a query
 └── waiting[]   → callbacks from requests that arrived when all connections were busy
```
And it exposes exactly two operations:
* `acquire()` - give me a connection
* `release()` - I'm done, take it back

That's the entire surface area. Everything else is plumbing around these two.

### The Logic of `acquire()`
When someone calls `acquire()`, exactly one of three things is true:
```
Is there an idle connection?
  YES → take it out of idle[], put it in busy[], return it
  NO  → Have we hit max connections?
          NO  → create a new connection, put it in busy[], return it
          YES → I can't help you right now.
                Put your callback in waiting[]. You'll get a connection when someone releases one.
```

### The Logic of `release()`
When someone calls `release()`, exactly one of two things in true:
```
Is anyone waiting in waiting[]?
  YES → take the first waiter, give them this connection directly (skip idle entirely)
  NO  → put the connection back in idle[]
```
That's it. That is the entire pool algorithm. Now let's write it.

We'll build `pool.js` in **4 layers**, one at a time so each piece is clear before the next one builds on it. 
* **Layer 1** - The class skeleton and constructor
* **Layer 2** - `_createConnection()` - the internal helper that actually opens a DB connection
* **Layer 3** - `acquire()` - the full borrow logic including the waiting queue
* **Layer 4** - `release()` - returning a connection and serving waiters

Checkout the `pool.js` code. And **here are the few things to notice:**

1. **LIFO for idle, FIFO for waiting - and why they're different**. Idle connections use a stack (`pop`) - the most recently used one is handed out first because it's the "warmest". Waiting callers use a queue (`shift`) - because fairness matters there. The person who waited longest gets served first.

2. **The `resolve` trick in Path C of `acquire()`**. This is the most important line in the whole file: `this._waiting.push(resolve)`. We are not storing the Promise - we are storing the *resolution function itself*. This means `release()` can resolve someone else's Promise from a completely different call stack. This is what makes async queuing possible without any external library.

3. **Forgetting `release()` is a real bug**. Look at the comment in the demo section. If you call `acquire()` and never call `release()`, the connection never returns to the pool. Once all slots fill up, every future `acquire()` call pushes into `_waiting[]` and waits forever. This is called **connection pool exhausion** and it happens in production regularly.