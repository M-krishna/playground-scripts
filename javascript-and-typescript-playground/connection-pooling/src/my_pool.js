/**
 * This is me trying to recreate pool.js with my understanding.
 * 
 * So what are we trying to do? We are trying to implement a connection pool manager. What is a connection pool manager?
 * 
 * The connection pool manager manages http connections by keeping it open for some time. So that the application don't
 * have to constantly open and close connections.
 * 
 * So there are 3 states to it.
 *      * Idle connections
 *      * Busy connections
 *      * Waiting state (this is mainly for incoming http requests)
 * 
 * The Connection Pool Manager exposes two API's to the consumer.
 *      * acquire
 *      * Release
 * 
 * The `acquire` function gives the caller a connection. The `release` function, as the name suggests releases the connection.
 * There are 3 paths to the `acquire` function.
 *      * Path A: The _idle array is not empty (which means there is an idle connection available)
 *      * Path B: There are no idle connection (meaning the idle array is empty). So create a new connection and push it directly to the `_busy` array.
 *      * Path C: There are no idle connections and all the connections are busy, then we need to push the `resolve` function of the
 *                  Promise to the `_waiting` array.
 * 
 * The `release` function takes in a client and moves it to the `_idle` connection array. Meaning we have to remove from `_busy` array to
 * `_idle` array.
 * There are two paths to `release` function.
 *      * Path A: There is a waiting connection in the pipeline
 */


class ConnectionPoolManager {
    constructor(config) {
        const { maxConnection = 5, idleTimeoutMs = 10000, ...clientConfig } = config;

        this._max = maxConnection;
        this._idleTimeoutMs = idleTimeoutMs;
        this._clientConfig = clientConfig;

        this._idle = [];            // This holds the idle client connections
        this._busy = new Set();     // This holds the client connections that are actual making the query
        this._waiting = [];         // This is the incoming client requests which are nothing but functions

        this._totalCount = 0;

        console.log(`[Pool] Created. Max connections=${this._max} Idle Timeout Ms=${this._idleTimeoutMs}`);
    }
}


// Now we need a function that actually connects to the database
const { Client } = require('pg');

ConnectionPoolManager.prototype._createConnection = async function () {
    const client = new Client(this._clientConfig);

    await client.connect();

    this._totalCount++;

    return client;
}

ConnectionPoolManager.prototype.acquire = async function () {
    return new Promise((resolve, reject) => {

        // Path A: There is an idle connection available
        if (this._idle.length) {
            const client = this._idle.pop();
            this._busy.add(client);
            resolve(client);
            return;
        }

        // Path B: There are no idle connections, but there is a space to create a new connection
        if (this._totalCount < this._max) {
            try {
                const client = this._createConnection();
                this._busy.add(client);
                resolve(client);
            } catch (error) {
                reject(error);
            }
            return;
        }

        // Path C: There are no idle connections and there is no space to create a new one.
        this._waiting.push(resolve);
    })
}

ConnectionPoolManager.prototype.release = function (client) {

}