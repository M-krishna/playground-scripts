/**
 * Exercise 2.2: Chained Safe Ops
 * 
 * Use your `safeDivCPS` and a CPS `sqrtCPS(x, onSuccess, onError)` (calls error if `x < 0`) to compute `sqrt(100 / n)`
 * 
 * Ensure that any error short-circuits the chain to the final error handler.
 */

function sqrtCPS(x, onSuccess, onError) {
    if (typeof x !== 'number') throw new Error("Expected an argument of type number");
}