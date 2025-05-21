/**
 * Exercise 2.2: Chained Safe Ops
 * 
 * Use your `safeDivCPS` (refer exercise 2.1) and a CPS `sqrtCPS(x, onSuccess, onError)` 
 * (calls error if `x < 0`) to compute `sqrt(100 / n)`
 * 
 * Ensure that any error short-circuits the chain to the final error handler.
 */

function sqrtCPS(x, onSuccess, onError) {
    if (typeof x !== 'number') throw new Error("Expected an argument of type number");
    if (x < 0) onError(`x can't be ${x}. It should be greater than 0`);
    else onSuccess(Math.sqrt(x));
}

function safeDivCPS(a, b, onSuccess, onError) {
    if (b === 0) onError("Divide by zero error");
    else onSuccess(a / b);
}

function composeCPS(fCPS, gCPS) {
    return function (x, onSuccess, onError) {
        gCPS(x, function (resultFromG) {
            fCPS(resultFromG, onSuccess, onError)
        }, onError);
    }
}

const sqrtOfDivCPS = composeCPS(sqrtCPS, function (n, onSuccess, onError) {
    safeDivCPS(100, n, onSuccess, onError);
})

sqrtOfDivCPS(
    25,
    function (result) { console.log (result) },
    function (error) { console.log(error) }
);