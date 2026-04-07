/**
 * pool.js - A connection pool built from scratch
 * 
 * We are NOT using pg's built-in Pool class here.
 * We are building our own so we can understand exactly what is happening.
 * 
 * The only pg primitive we use is `Client` - a single raw connection.
 * Everything else (pooling, queuing, lifecycle) is written by us.
 * 
 * DESIGN OVERVIEW
 * ---------------
 * 
 * The pool holds three data structures in memory at all times
 * 
 *      this._idle          -> Client[] - connections open and ready to use
 *      this._busy          -> Set<Client> - connections currently running a query
 *      this._waiting       -> Function[] - resolve callbacks from callers who are waiting for a connection to become free
 * 
 * It exposes two public methods:
 *      
 *      acquire() -> Promise<Client> - borrow a connection from the pool
 *      release(client)              - return a connection to the pool
 * 
 * Everything else is private (prefixed with _)
 */

const { Client } = require('pg');

// =============================================================================
// LAYER 1 — Class skeleton and constructor
// =============================================================================


class ConnectionPool {
    /**
     * 
     * @param {object} config
     * @param {string} config.host
     * @param {number} config.port
     * @param {string} config.database
     * @param {string} config.user
     * @param {string} config.password 
     * @param {number} [config.max=5] - Maximum number of connections the pool will ever open
     * @param {number} [config.idleTimeoutMs=100000] - How long(ms) a connection can sit idle before being closed
     * 
     */
    constructor(config) {
        // Separate the pool specific options from the pg connection options.
        // pg's Client doesn't know about "max" or "idleTimeoutMs" - those are
        // our pool's own concepts. we pull them out and keep the rest for the Client
        const { max = 5, idleTimeoutMs = 10000, ...clientConfig } = config;

        this._clientConfig = clientConfig;  // passed to every new Client()
        this._max = max;                    // hard ceiling on total connections
        this._idleTimeoutMs = idleTimeoutMs;

        // The three core data structures (explained in the header above).
        this._idle = [];            // Client[] - available connections
        this._busy = new Set();     // Set<Client> - in-use connections
        this._waiting = [];         // Function[] - pending acquire() resolve callbacks.

        // _totalCount tracks how many connections exist right now (idle + busy)
        // We need this to know whether we are allowed to open a new one.
        // It must always equal: this._idle.length + this._busy.size
        this._totalCount = 0;

        console.log(`[Pool] Created. max=${this._max}, idleTimeoutMs=${this._idleTimeoutMs}`);
    }

    // Convenience getter so callers can inspect the pool state at any time.
    // We will use this in benchmark.js to print a status line.
    get stats() {
        return {
            idle: this._idle.length,
            busy: this._busy.size,
            waiting: this._waiting.length,
            total: this._totalCount
        }
    }
}


// =============================================================================
// LAYER 2 — _createConnection()
// =============================================================================
// This is the only place in the entire pool where a new Client is created
// and connected. All other methods call this — never `new Client()` directly.

ConnectionPool.prototype._createConnection = async function () {
    // Instantiate a raw pg client with the DB config
    const client = new Client(this._clientConfig);

    // THIS is the expensive call - TCP handshake + auth + parameter exchange.
    // From this point on, the Client has an open socket to PostgreSQL
    await client.connect();

    // Increment our counter. This must happen immediately after connect()
    // so _totalCount is always accurate
    this._totalCount++;

    console.log(`[Pool] New connection opened. Total: ${this._totalCount}`);

    // _setupIdleTimeout() will attach a timer to this connection.
    // If it sits idle for too long, the pool will close it automatically.
    // We define that method is Layer 4 - for now just know it exists.
    this._setupIdleTimeout(client);

    return client;
}


// =============================================================================
// LAYER 3 — acquire()
// =============================================================================
// The public method callers use to borrow a connection.
// Returns a Promise that resolves with a Client when one is available.

ConnectionPool.prototype.acquire = function () {
    // We return a Promise here because getting a connection might require
    // waiting - and waiting is inherently asynchronous.
    return new Promise(async (resolve, reject) => {
        
        // --- Path A: There is an idle connection available -----------
        if (this._idle.length) {
            // Take the last idle connection (stack order - LIFO).
            // LIFO (Last In, First Out) is intentional: the most recently used
            // connection is the "warmest" - its TCP socket is most likely still
            // active and its server-side state is freshest.
            const client = this._idle.pop();

            // Cancel its idle timeout - it's no longer sitting idle.
            // If we don't do this, the timer would fire and close an active connection.
            this._clearIdleTimeout(client);

            // Move it from idle -> busy.
            this._busy.add(client);

            console.log(`[Pool] Acquired idle connection. Stats:`, this.stats);
            resolve(client);
            return;
        }

        // --- Path B: No idle connection, but we haven't hit the max yet -----
        if (this._totalCount < this._max) {
            try {
                // Open a brand new connection. This is async - It does the full
                // TCP + auth dance. But we only pay this cost once per connection slot.
                const client = await this._createConnection();

                // New connection goes straight to busy - it was requested, not pre-warmed.
                this._busy.add(client);

                console.log(`[Pool] Acquired new connection. Stats:`, this.stats);
                resolve(client);
            } catch (err) {
                // If _createConnection() fails (DB is down, wrong password, etc.),
                // propagate the error to the caller instead of hanging forever.
                reject(err);
            }
            return;
        }

        // --- Path C: Pool is full and all connections are busy --------
        // We cannot create a new connection (would exceed max).
        // We cannot hand out an existing one (all are busy).
        // The only option is to queue the request and wait.
        //
        // We store the `resolve` function itself - not the whole Promise.
        // When a connection is released later, we call resolve(client) directly,
        // which resolves THIS promise and unblocks the caller.
        console.log(`[Pool] All connections busy. Request queued. Stats:`, this.stats);
        this._waiting.push(resolve);
    })
}


// =============================================================================
// LAYER 4 — release(), _setupIdleTimeout(), _clearIdleTimeout(), _closeConnection()
// =============================================================================

// release() - return a connection to the pool after use.
ConnectionPool.prototype.release = function (client) {
    // Remove from busy regardless of what happens next.
    this._busy.delete(client);

    // --- Case A: Someone is waiting for a connection ---------
    if (this._waiting.length) {
        // Take the oldest waiter (FIFO - First In, First Out).
        // FIFO is fair: whoever waited longest gets served first.
        const resolve = this._waiting.shift();

        // Hand the connection directly to the waiter - don't put it in idle first.
        // This avoids a round-trip through the idle array unneccessarily.
        this._busy.add(client);     // back to busy immediately for the next caller
        console.log(`[Pool] Connection handed to waiting request. Stats:`, this.stats);
        resolve(client);    // this resolves the pending acquire() Promise
        return;
    }

    // --- Case B: No one is waiting - return to idle ----------
    this._idle.push(client);

    // Restart the idle timeout. If nobody picks this up within idleTimeoutMs,
    // we'll close it to free server-side resources.
    this._setupIdleTimeout(client);

    console.log(`[Pool] Connection returned to idle. Stats:`, this.stats);
}

// _setupIdleTimeout() - attach a timer to a connection.
// If the connection sits idle longer than _idleTimeoutMs, close it.
ConnectionPool.prototype._setupIdleTimeout = function (client) {
    // Store the timer reference on the client object itself.
    // This is a little unconventional, but it keeps the timer co-located
    // with the connection it governs - no separate map needed.
    client._idleTimer = setTimeout(() => {
        console.log(`[Pool] Idle timeout reached. Closing connection. Total before: ${this._totalCount}`);
        this._closeConnection(client);
    }, this._idleTimeoutMs)
}

// _clearIdleTimeout() - cancel the timer before we hand the connection out.
ConnectionPool.prototype._clearIdleTimeout = function (client) {
    if (client._idleTimer) {
        clearTimeout(client._idleTimer);
        client._idleTimer = null;
    }
}

// _closeConnection() - cleanly close a connection and remove it from the pool.
ConnectionPool.prototype._closeConnection = function (client) {
    // Remove from idle (it should always be idle when we close it,
    // Since we only close on idle timeout - never while busy).
    this._idle = this._idle.filter((c) => c !== client);

    // Clear any dangling timer.
    this._clearIdleTimeout(client);

    // Tell PostgreSQL we're done. This sends a Terminate message and
    // closes the TCP socket on both ends.
    client.end().catch(() => {
        // Swallow errors here - if the connection was already broken,
        // end() might throw but we still want to decrement our counter.
    });

    this._totalCount--;

    console.log(`[Pool] Connection closed. Total now: ${this._totalCount}`);
}


// =============================================================================
// Demo — run the pool against real PostgreSQL
// =============================================================================
// This section is the hands-on proof that the pool works.
// We run 50 queries through the pool and watch how connections are reused.

const DB_CONFIG = {
    host: "localhost",
    port: 5432,
    database: "pooling_demo",
    user: "postgres",
    password: "postgres",
    max: 5,                 // pool will never open more than 5 connections
    idleTimeoutMs: 10000,
};

async function runWithPool(queryCount) {
    const pool = new ConnectionPool(DB_CONFIG);

    console.log(`\nRunning ${queryCount} queries WITH our hand-built pool...\n`);

    const start = performance.now();

    for (let i = 1; i <= queryCount; i++) {
        // acquire() hands us a connection - either idle, new, or after waiting.
        const client = await pool.acquire();

        const randomId = Math.ceil(Math.random() * 100);
        await client.query(`SELECT * FROM users WHERE id = $1`, [randomId]);

        // release() is critical. Forgetting this is a common real-world bug:
        // connections never return to the pool, it fills up, and all future
        // acquire() calls wait forever - a classic connection pool exhausion bug.
        pool.release(client);

        if (i % 10 === 0) {
            const elapsed = (performance.now() - start).toFixed(0);
            console.log(`   ${i}/${queryCount} queries done - ${elapsed}ms elapsed`);
        }
    }

    const total = performance.now() - start;
    const avg = total / queryCount;

    console.log("\n--- Results (with our pool) ---");
    console.log(`   Total time          : ${total.toFixed(2)}ms`);
    console.log(`   Query count         : ${queryCount}`);
    console.log(`   Avg per query       : ${avg.toFixed(2)}ms`);
    console.log(`   Final pool stats    : ${pool.stats}`);
    console.log("\n  Compare this average to naive.js. The difference is the connection overhead we eliminated.\n");
}

runWithPool(50).catch((err) => {
    console.error("Error: ", err.message);
    process.exit(1);
})