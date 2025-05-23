// Direct / Normal style factorial function (Recursive)
function factorial(n) {
    // Base case
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

console.log(factorial(5));


// CPS style
function factorialCPS(n, k) {
    if (n === 0) k(1);
    else {
        factorialCPS(n - 1, function (rest) {
            k(n * rest);
        })
    }
}

factorialCPS(6, console.log)