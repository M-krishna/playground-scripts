/**
 * 2. Error handling with Dual Continuations
 * 
 * Extend CPS functions to accept both a success and error continuation
 * 
 * Exercise 2.1: Safe Division
 * 
 * Let's first look at the direct version of the safe division function
 */

function safeDiv(a, b) {
    if (b === 0) throw new Error("Divide by zero error");
    else return a / b;
}

console.log(safeDiv(4, 2));
// console.log(safeDiv(4, 0)); // throws "Divide by zero error"


function safeDivCPS(a, b, onSuccess, onError) {
    if (b === 0) onError("Divide by zero error");
    else onSuccess(a / b);
}

safeDivCPS(4, 2, (r) => console.log(r), (err) => {
    throw new Error(err)}
);
// safeDivCPS(4, 0, (r) => console.log(r), (err) => { throw new Error(err) });