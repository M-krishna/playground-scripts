/**
 * Accumulator-Based Tail Recursion
 * 
 * Convert recursive CPS functions into truly tail-recursive form with an accumulator.
 * 
 * Exercise 3.1: Tail-Recursive Factorial
 * 
 * Starting from non-accumulator `factCPS(n, k)`, write `factCPS(n, acc, k)` so that the recursive call is in immediate
 * tail position and uses `acc` to accumulate the product.
 */


// Let's first take a look at regular factorial function (recursive version)
function factorial(n) {
    if (n === 0) return 1;  // Base Case
    return n * factorial(n - 1);
}

console.log(factorial(5));


// Second let's implement the CPS version of the above factorial function
function factorialCPS(n, k) {
    if (n === 0) k(1);
    else factorialCPS(n - 1, function (r) {
        k(n * r)
    })
}

factorialCPS(5, console.log);


// Third let's implement a regular factorial function with accumulator
function factorialAcc(n, acc) {
    if (n === 0) return acc;
    else return factorialAcc(n - 1, acc * n);
}

console.log(factorialAcc(0, 1));
console.log(factorialAcc(5, 1));


// Fourth let's implement the CPS version of the above factorialAcc function
function factorialAccCPS(n, acc, k) {
    if (typeof k !== 'function') throw new TypeError("Expected an argument of type function");
    if (n === 0) k(acc);
    else factorialAccCPS(n - 1, acc * n, function (r) {
        k(r)
    });
}


factorialAccCPS(0, 1, console.log);
factorialAccCPS(6, 1, console.log);