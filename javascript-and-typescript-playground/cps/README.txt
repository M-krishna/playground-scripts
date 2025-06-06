CPS (Continuation Passing Style)
--------------------------------

What is a Continuation?
-----------------------

A Continuation is just a function you hand your code, telling it "when you're done, call me with the result".

In CPS:
* No "return" - you invoke the continuation instead
* Extra parameter - you add "k" (or "next", "done") as the last argument.

This contrasts with direct style, where you'd write `return result;`. In CPS, you write `k(result)`

1. Addition in Direct Vs CPS
----------------------------

Direct style (normal)
---------------------
```
function add(a, b) {
    return a + b;
}

let sum = add(1,2);
console.log(sum);
```

CPS style:
----------
```
function add(a, b, k) {
    k(a,b);
}

add(1, 2, (result) => console.log(result));
```
Here "k" is the continuation that receives the sum and does the "console.log"

2. Chaining Two Operations
--------------------------
Suppose you want to concatenate two strings and capitalize the result.

Direct style (normal)
---------------------
```
function concat(x, y) {
    return x + y;
}

function capitalize(s) {
    return s.toUpperCase();
}

let result  = capitalize(concat("hello", "world!"));
console.log(result);
```

CPS style
---------
```
function concat(a, b, next) {
    next(a + b);
}

function capitalize(s, next) {
    next(s.toUpperCase());
}

concat("hello", "world", (str) => {
    capitalize(str, (result) => console.log(result));
});
```

3. Simple Asynchronous Demo
---------------------------
CPS shines for non-blocking I/O. Here's a tiny nodejs style example (reading a file).
```
const fs = require('fs');

function readFileCPS(path, encoding, k) {
    fs.readFile(path, encoding, function (err, data) {
        if (err) return console.error(err);
        k(data);
    })
}

readFileCPS("./message.txt, "utf-8", function(text) {
    console.log("file contains:", text)
})
```

4. Recursive Example: Factorial
-------------------------------

Direct (non-tail-recursive)
---------------------------
```
function factorial(n) {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

console.log(factorial(5));
```

CPS style (tail-position calls)
-------------------------------
```
function factorialCPS(n, k) {
    if (n === 0) { k(1) }
    else {
        factorialCPS(n - 1, function(r) {
            k(n * r)
        });
    }

}

factorialCPS(5, function(result) {
    console.log(result);
})
```

5. Converting Direct to CPS: Step by Step
-----------------------------------------
1. Identify the return value
2. Add a continuation parameter `k`
3. Replace each `return X;` with `k(x)`
4. Wrap any subsequent work inside a nested continuation if you had to wait for a recursive result.

For instance, turning:
```
function squarePlusOne(x) {
    return x * x + 1;
}

console.log(squarePlusOne(5))
```

into CPS:
```
function squarePlusOneCPS(x, k) {
    let square = x * x;
    k(square + 1);
}

squarePlusOneCPS(5, (result) => console.log(result));
```

Why CPS matters for Beginners
* Explicit flow: You always know "what happens next"
* Easy async: Callbacks are just continuous
* Foundations to advanced patterns: Promises, async/await, generators, coroutines, and even compilers use CPS under the hood

Exercise
--------
Convert this simple function in CPS:
```
function greet(name) {
    return "Hello, " + name + "!";
}
```

CPS:
---
```
function greetCPS(name, k) {
    k(`Hello ${name}!`);
}

greetCPS("krishna", console.log)
```


Next steps
----------
1. Compose CPS functions together
2. Introduce error handling via dual continuations
3. Use accumulators for true tail-recursion
4. Model asynchronous control flow with timeouts and I/O
5. Transform non-trivial direct-style function into CPS


Check out `cps/exercise*.js` file to know about the implementation details.