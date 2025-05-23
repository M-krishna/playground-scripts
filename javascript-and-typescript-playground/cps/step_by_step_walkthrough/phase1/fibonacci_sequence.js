// Direct style (Recursive)

// What is fibanacci sequence?
// 0, 1, 1, 2, 3, 5, 8, 13, ...
function fibonacci(n) {
    // Base cases
    if (n === 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0,1];

    // Recursive case
    const sequence = fibonacci(n - 1);
    const nextNum = sequence[sequence.length - 1] + sequence[sequence.length - 2]
    sequence.push(nextNum);
    return sequence;
}


console.log(fibonacci(0)); // it should return []
console.log(fibonacci(1)); // it should return [0]
console.log(fibonacci(2)); // it should return [0, 1]
console.log(fibonacci(10)); // it should return [0,1,1,2,3,5,8,13,21,34]


// CPS style
function fibonacciCPS(n, k) {
    // Base cases
    if (n <= 0) {
        k([]);
    }
    if (n === 1) {
        k([0]);
    }
    if (n === 2) {
        k([0,1]);
    } else {
        // Recursive cases
        fibonacciCPS(n - 1, function (r) {
            const nextNum = r[r.length - 1] + r[r.length - 2]
            k([...r, nextNum])
        })
    }
}

fibonacciCPS(10, console.log)