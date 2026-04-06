/**
 * naive.js - Querying PostgreSQL WITHOUT a connection pool.
 * 
 * The goal of this file is to show the problem clearly.
 * Every query goes through the full connection lifecycle:
 *  open -> authenticate -> query -> close
 * 
 * This is not wrong for a single query. It becomes a serious problem at scale - which we will measure at the bottom.
 */

const { Client } = require('pg');

// ---------------------------------------------------------------------------
// DB config
// ---------------------------------------------------------------------------
// These match the values in docker-compose.yml exactly.
// In a real app these would come from environment variables, never hardcoded.

const DB_CONFIG = {
    host: "localhost",
    port: 5432,
    database: "pooling_demo",
    user: "postgres",
    password: "postgres"
};

// ---------------------------------------------------------------------------
// The naive query function
// ---------------------------------------------------------------------------
// This is the core of what we want to study.
// Notice: a brand new Client is created every single time this is called.

async function queryWithoutPool(sql, params=[]) {
    // Step 1: Create a new client instance
    // At this point, no network activity has happened yet.
    // We have just created a javascript object with config attached to it.
    const client = new Client(DB_CONFIG);

    // Step 2: Connect - this is where the expensive work happens.
    // Under the hood, this does:
    //  a) TCP handshake with the PostgreSQL server
    //  b) SSL handshake (if configured)
    //  c) PostgreSQL startup message (sends username, database name)
    //  d) Authentication challenge-response (password verification)
    //  e) Server sends back its parameters (timezone, encoding, etc.)
    await client.connect();

    // Step 3: Run the actual query
    // By the time we get here, we've already done all the expensive setup.
    // The query itself is often the fastest part.
    const result = await client.query(sql, params);

    // Step 4: Close the connection.
    // This sends a Terminate message to PostgreSQL and closes the TCP socket.
    // PostgreSQL frees the process it had spawned for this connection.
    // All that setup work from Step 2? Gone. Next query starts from scratch.
    await client.end();

    return result;
}

// ---------------------------------------------------------------------------
// Setup — create a table and seed some data
// ---------------------------------------------------------------------------
// We need something to query against. This function runs once before our
// benchmark to make sure the table exists and has rows.

async function setup() {
    console.log("Setting up database...");

    // Drop and recreate the table so this script is safe to run multiple times.
    await queryWithoutPool(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL 
        )
    `);

    // Clear any existing rows so we always start clean.
    await queryWithoutPool(`TRUNCATE TABLE USERS`);

    // Insert 100 sample rows. We will query these during the benchmark.
    // We build one big insert to avoid 100 separate round trips during setup.
    const values = Array.from({ length: 100}, (_, i) =>
        `('User ${i+1}', 'user${i + 1}@example.com')`
    ).join(", ");

    await queryWithoutPool(`INSERT INTO USERS (name, email) VALUES ${values}`);

    console.log("   -> Table created, 100 rows inserted.\n");
}

// ---------------------------------------------------------------------------
// Benchmark — run N queries and measure total time
// ---------------------------------------------------------------------------

async function runBenchmark(queryCount) {
    console.log(`Running ${queryCount} queries WITHOUT a connection pool...`);
    console.log("Each query open a new connection and closes it when done.\n");

    const start = performance.now();

    for (let i = 1; i < queryCount; i++) {
        // We pick a random User ID each time so every query is a real DB read.
        const randomId = Math.ceil(Math.random() * 100);

        const queryStartTime = performance.now();
        await queryWithoutPool(`SELECT * FROM users WHERE id = $1`, [randomId]);
        const queryEndTime = performance.now() - queryStartTime;
        console.log(`The time it takes to finish executing a single query: ${queryEndTime.toFixed(2)}ms`)

        // Print a small progress indicator every 10 queries so we can see
        // the script is not frozen - it really is that slow.

        if (i % 10 === 0) {
            const elapsed = (performance.now() - start).toFixed(0);
            console.log(`   ${i}/${queryCount} queries done - ${elapsed}ms elapsed so far`);
        }
    }

    const total = performance.now() - start;
    const avg = total / queryCount;

    console.log("\n --- Results (without pool) ---");
    console.log(`   Total time: ${total.toFixed(2)}ms`);
    console.log(`   Query count: ${queryCount}`);
    console.log(`   Avg per query: ${avg.toFixed(2)}ms`);
    console.log(
        "\n     Notice how much of that average is connection overhead, not query time."
    );
    console.log("   Run benchmark.js after building pool.js to see the difference.\n");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
async function main() {
    try {
        await setup();
        await runBenchmark(50);
    } catch (err) {
        // If Postgres is not running, the error message here will tell you exactly that.
        // Make sure you ran: docker compose up -d or npm run db:up
        console.error("Error: ", err.message);
        process.exit(1);
    }
}

main();