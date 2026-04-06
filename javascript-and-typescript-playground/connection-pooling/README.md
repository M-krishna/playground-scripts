# Connection Pooling - From Problem to Solution

## Table of Contents
1. What are we even talking about?
2. The problem: What Happens Without Pooling
3. Why Is Opening a Connection Expensive?
4. Measuring the Pain
5. The Solution: Connection Pooling
6. How a Pool Works - Step by Step
7. What We Are Building
8. Project Setup

## 1. What Are We Even Talking About?
When your Node.js application needs to read or write data, it talks to PostgreSQL over a **connection** - a persistent, stateful channel between your app and the database server.

Think of it like a phone call:
* You dial (TCP handshake)
* The other side picks up and verifies who you are (authentication)
* You have a conversation (queries)
* You hang up (connection close)

Every time you have to ask the database something, you have two options:

**Option A -- Call every time you need something:** Dial -> verify -> ask -> hang up -> dial again -> verify -> ask -> hang up.. 

**Option B -- Keep the line open:** Dial -> verify -> ask -> ask -> ask -> ask -> ask -> eventually hang up.

Connection pooling is **Option B**, done systematically.

## 2. The Problem: What Happens Without Pooling
Imagine a web server handling incoming HTTP requests. For each request that needs database data, the naive approach is:
```
HTTP Request arrives
  → app opens a new DB connection
    → app runs the query
      → app closes the connection
        → HTTP Response sent
```

This works fine for 1 request. Now imagine 100 requests arriving per second.

**Problem 1: Every connection costs time**

Opening a connection is not free. It involves multiple round trips between your app and the database before a single query runs. On a local machine this might be ~5ms. Over a network, it could be ~50-100ms or more. If your query itself takes 10ms, you are spending 5x more time just *opening the connection*  than actually running the query.

**Problem 2: Every connection costs resources on the database server**

PostgreSQL spawns a **new OS process** for every connection. Each process consumes:
* Memory (~5-10MB per connection)
* CPU time (for process management)
* File descriptors

PostgreSQL has a hard limit (`max_connections`, default: **100**). If 100 connections are open and a 101st request arrives, it gets:
```
FATAL: sorry, too many clients already
```

Your app crashes - not because the database is broken, but because it ran out of connection slots.

**Problem 3: Connection Storms**

When traffic spikes suddenly (eg., a spike after a deployment or a flash sale), every new request races to open a fresh connection at the same moment. This floods the database with connection requests simultaneosly - exactly when the database is already under load. The result is a cascade of slow queries and timeouts.

### The Timeline Without Pooling
```
Request 1:  [--- open conn (8ms) ---][- query (5ms) -][close]
Request 2:  [--- open conn (7ms) ---][- query (5ms) -][close]
Request 3:  [--- open conn (9ms) ---][- query (5ms) -][close]
            ^^^^^^^^^^^^^^^^^^^^^^^^^
            This overhead repeats for EVERY request
```

Total time per request: ~13ms, of which only 5ms is real work. The rest is overhead.

## 3. Why Is Opening a Connection Expensive?
It helps to know exactly what happens during `pg.connect()`. There are more steps than you'd expect:

### Step 1: TCP Handshake (3 rounds trips)
Before anything database-related happens, your app and PostgreSQL must establish a TCP connection:
```
App  →  SYN         →  DB
App  ←  SYN-ACK     ←  DB
App  →  ACK         →  DB
```
This is the internet's way of saying "hello, are you there?" - and it cannot be skipped.

### Step 2: TLS Handshake (if using SSL)
If the connection is encrypted (which it should be in production), there is an additional TLS handshake on top of TCP handshake. This involves exchanging certificates, agreeing on cipher suites, and generating session keys. Add another 1-2 round trips.

### Step 3: PostgreSQL Authentication
PostgreSQL now asks: who are you? and are you allowed in?
```
App  →  StartupMessage (username, database name)  →  DB
App  ←  AuthenticationRequest (MD5 or SCRAM)      ←  DB
App  →  Password / credentials                    →  DB
App  ←  AuthenticationOK                          ←  DB
```

### Step 4: Server Parameters Exchange
After login, PostgreSQL sends the app a set of configuration parameters (timezone, encoding, server version, etc). The client parses all of this before it is considered "ready."

### Step 5: Finally - Ready for Query
Only now your application can send its first `SELECT` or `INSERT`.

**All of steps 1-4 happen before a single line of your SQL runs**.

On localhost this entire process takes ~3-10ms. Over a real network (eg., your app server in Mumbai talking to a DB in Singapore), this can be 80-200ms per connection.

## 4. Measuring the Pain
Here is what a simple benchmark looks like (you will run this yourself later):

**Without pooling - create a new connection per query**
```js
async function queryWithoutPool(sql) {
  const client = new Client(config);
  await client.connect();       // <-- expensive every time
  const result = await client.query(sql);
  await client.end();
  return result;
}
```
Running 50 sequential queries this way:
```
Total time: ~650ms
Average per query: ~13ms
  - Connection overhead: ~8ms
  - Actual query: ~5ms
```

**With Pooling - reuse existing connections**
```js
const pool = new Pool({ ...config, max: 10 });

async function queryWithPool(sql) {
  const client = await pool.connect();  // <-- gets an already-open connection
  const result = await client.query(sql);
  client.release();
  return result;
}
```
Running the same 50 sequential queries:
```
Total time: ~270ms
Average per query: ~5.4ms
  - Connection overhead: ~0.4ms (first time only)
  - Actual query: ~5ms
```
The pool paid the connection cost once (or a few times for warm-up), then reused those connections for all subsequent queries.

## 5. The Solution: Connection Pooling
A connection pool is a **manager that sits between your application and the database.** It:
1. Opens a fixed number of connections when it starts up (or lazily as needed)
2. Keeps those connections alive and idle when not in use.
3. Hands the connection to your code when requested (`acquire`)
4. Takes it back when your code is done (`release`)
5. Reuses the same connection for the next request.

```
                        ┌─────────────────────────────┐
                        │       Connection Pool       │
                        │                             │
  App Request 1 ──────► │  conn-1 [BUSY]              │ ──► PostgreSQL
  App Request 2 ──────► │  conn-2 [BUSY]              │ ──► PostgreSQL
  App Request 3 ──────► │  conn-3 [IDLE] ◄── waiting  │ ──► PostgreSQL
                        │  conn-4 [IDLE]              │ ──► PostgreSQL
                        │  conn-5 [IDLE]              │
                        └─────────────────────────────┘
```

### Key Properties of a Pool
| Property | Description | Typical Default |
|----------|-------------|-----------------|
| `min` | Minimum connection kept alive at all times | 2 |
| `max` | Maximum connections allowed (hard limit) | 10 |
| `idleTimeoutMs` | How long an idle connection lives before being closed | 30,000ms |
| `connectionTimeoutMs` | How long to wait for a free connection before throwing | 5,000ms |

### The Waiting Queue
What happens when all connections are busy and a new request arrives?

**Without a queue:** crash, error or dropped request.

**With a queue:** the request waits in line. As soon as any connection is released, it is handed to the next waiter. This is the difference between a graceful system and a brittle one.

```
All 10 connections are busy.

Request 11 arrives → joins waiting queue
Request 12 arrives → joins waiting queue

conn-3 is released by Request 4 →
  conn-3 is immediately given to Request 11
  Request 11 runs its query
```

## 6. How a Pool Works - Step by Step
Let's trace through a request lifecycle in detail:

### Cold Start (Pool is empty)
```
Request arrives -> pool has 0 connections -> pool opens a new connection -> runs query -> connection returned to pool (not closed)
```

### Warm Pool (Connections already exist)
```
Request arrives -> pool has idle connections -> pool hands it over -> runs query -> connection returned to pool
```
No TCP handshake. No authentication. No parameter exchange. Just the query.

### Pool is Full and All Busy
```
Request arrives -> pool has 10/10 busy connections -> request queued -> waits...
    -> another request finishes -> releases connection -> queued request gets it -> runs query
```

### Idle Connection Cleanup
Connections left idle for too long are closed. This prevents holding DB resources unnecessarily when traffic is low.
```
conn-8 has been idle for 30 seconds -> pool closes conn-8 -> removes from pool
Next Request: pool opens a fresh connection to fill the gap
```

### State Machine of a Single Connection
```
[created] → [idle] → [busy] → [idle] → [busy] → [idle] → [closed]
                ↑                   |
                └─── released ──────┘
```

## 7. What We Are Building
We will build a connection pool from scratch in Node.js, backed by a real PostgreSQL instance running in Docker.

**What our pool will do:**
* Maintain a set of live PostgreSQL connections
* Expose an `acquire()` method - borrows a connection from the pool
* Expose a `release()` method - returns the connection to the pool
* Queue incoming requests when all connections are busy
* Clean up idle connections after a timeout

**What will we initially skip (to stay focused)**
* Health checks / broken connection detection
* Connection retry on failure
* Pool draining / graceful shutdown
* TLS / SSL configuration
* Metrics and Observability

These are important in production but would distract from understanding the core concept.

### File Structure
```
connection-pooling/
├── docker-compose.yml       # PostgreSQL container setup
├── src/
│   ├── naive.js             # Approach without pooling (baseline)
│   ├── pool.js              # Our hand-built connection pool
│   └── benchmark.js         # Compare naive vs pool performance
├── README.md
└── package.json
```

## 8. Project Setup

### Prerequisites
* Node.js (v18 or later)
* Docker and Docker compose

### Start Postgres
```
docker compose up -d
```
This starts a postgres instance on `localhost:5432` with:
* Database: `pooling_demo`
* User: `postgres`
* Password: `postgres`

### Install dependencies
```
npm install
```

### Run the Benchmark
```bash
# See what it looks like WITHOUT pooling
node src/naive.js

# See what it looks like WITH our pool
node src/pool.js

# Compare both side by side
node src/benchmark.js
```

### `pg` Dependency
The only one dependency, `pg`, which is the official Postgres client for Node.js