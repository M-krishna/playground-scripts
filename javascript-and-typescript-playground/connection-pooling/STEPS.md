# Step by step things I have followed

## Step 1 - `naive.js`
The goal of this file is to demonstrate the problem. Every query open a brand new connection and closes it when done. No reuse whatsoever.

The key to notice:
* `new Client()` vs `new Pool()` - `pg` gives you two exports. `Client` is a single, manual connection. `Pool` is `pg`'s built-in pool (which we will ignore for now and build our own). We are using `Client` delibrately here to feel the pain.

`client.connect()` **is where all the cost is** - the actual `client.query()` call that follows is almost instant by comparison. The setup work (TCP, auth, parameter exchange) is what hurts.

`client.end()` **throws everything away** - every connection teardown is waste, because the very next query will rebuild everything from scratch.