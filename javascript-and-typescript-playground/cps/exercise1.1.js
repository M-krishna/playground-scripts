/**
 * Exercise 1.1:
 * 
 * Write three CPS functions - "incrementCPS(n, k)" calls "k(n + 1)"; "doubleCPS(n, k)" calls "k(n * 2)"; 
 * and "squareCPS(n, k)" calls "k(n * n)"
 * Compose them to compute "((x + 1) * 2) ^ 2" in CPS, without nesting allow callbacks more than once.
 */

/**
 * What does it mean by "without nesting allow callbacks more than once"
 * Lets look at a bad and good example.
 */

// Bad (Nested callbacks)

/* doSomething(value, (result1) => {
    doSomethingElse(result1, (result2) => {
        andThenThis(result2, (result3) => {
            console.log(result3);
        })
    })
}) */

// Good (Flattened with multiple callbacks)
function processValue(value, k) {
    k(value);       // First callback
    k(value * 2);   // Second callback
    k(value * 3);   // Third callback
}
// processValue(5, (result) => console.log(result));


// Start of three CPS functions 

function incrementCPS(n, k) {
    k(n + 1);
}

function doubleCPS(n, k) {
    k(n * 2);
}

function squareCPS(n, k) {
    k(n * n);
}

// End of three CPS functions

/**
 * In the second point, we have something that "Compose". What is that?
 * 
 * What is a compose function and how does it work?
 * 
 * Generally, a compose function takes in "n" number of functions as its
 * argument and composes them together and returns another function
 * We'll take a look at an example of a compose function that composes two
 * functions together.
 * 
 * One way to think about this, let's say we have two functions named "f" and "g"
 * If we want to compose both of them together, we can write "f compose g",
 * also, "f(g(<some_argument>))".
 * 
 * For our example, we'll create two functions named
 * plusOne - Which adds 1 to n, where n is an arbitrary number
 * multiplyTen - Which multiplies 10 to n, where n is an arbitrary number
 * 
 * In this example, we'll first plusOne and then multiply by ten and not
 * the other way around
 */

function plusOne(n) {
    return n + 1
}

function multiplyTen(n) {
    return n * 10
}

function compose(f, g) {
    return function (x) {
        return f(g(x))
    }
}

const plusOneAndMultiplyTen = compose(multiplyTen, plusOne);
console.log(plusOneAndMultiplyTen(16));


/**
 * What about a compose function that takes "n" number of functions as its
 * argument? So that we can compose as many functions as we want.
 * 
 * Let's take a look at how to implement that.
 */

// TypeCheck function
function functionTypeCheck(f) {
    if (typeof f !== "function") throw new TypeError(`Expected an argument of type "function", received: ${typeof f}`)
    return f
}

function composeN(...args) {
    args.map(functionTypeCheck);
    return function (x) {
        return args.reduceRight((acc, fn) => fn(acc), x)
    }
}

const plusOneAndMultiplyTenUsingComposeN = composeN(multiplyTen, plusOne)
console.log(plusOneAndMultiplyTenUsingComposeN(4))


// Now let's get back to the composeCPS function

function composeCPS(f, g) {
    [f, g].map(functionTypeCheck) // f and g should be functions
    return function (x, k) {
        // Here x is the input of type number
        // And k is the callback function
        if (typeof x !== 'number') throw new TypeError("Expected an argument of type number");
        return g(x, (y) => f(y, k));
    }
}

const incrementAndDouble = composeCPS(doubleCPS, incrementCPS);
const squareAndIncrementAndDouble = composeCPS(squareCPS, incrementAndDouble);
squareAndIncrementAndDouble(2, console.log) // should return 36