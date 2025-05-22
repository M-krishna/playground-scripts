/**
 * Exercise 3.2: List Reversal
 * 
 * Write a direct-style `reverse(lst)` using an accumulator, then a CPS version `reverseCPS(lst, acc, k)`
 */

// Lets first implement a reverse function without accumulator
function reverse(lst) {
    if (typeof lst !== 'object') throw new TypeError("Expected an argument of type array");
    if (lst.length === 0) return [];
    else {
        const [head, ...tail] = lst;
        return [...reverse(tail), head];
    }
}

console.log(reverse([1,2,3,4,5]));
console.log(reverse([]));
console.log(reverse(reverse([1,2,3,4,5])))


// Now let's implement `reverse(lst)` using an accumulator
function reverseAcc(lst, acc) {
    if (typeof lst !== 'object' || typeof acc !== 'object') throw new TypeError("Expected an argument of type array");
    if (lst.length === 0) return acc;
    else {
        const [head, ...tail] = lst;
        return reverseAcc(tail, [head, ...acc])
    }
}

console.log(reverseAcc([], []))
console.log(reverseAcc([1,2,3,4,5], []))
console.log(reverseAcc(reverseAcc([1,2,3,4,5], []), []))


// Now let's implement reverseAccCPS
function reverseAccCPS(lst, acc, k) {
    if (typeof lst !== 'object' || typeof acc !== 'object') throw new TypeError("Expected an argument of type array");
    if (typeof k !== 'function') throw new TypeError("Expected an argument of type function");
    if (lst.length === 0) k(acc);
    else {
        const [head, ...tail] = lst;
        reverseAccCPS(tail, [head, ...acc], function (r) {
            k(r);
        })
    }
}

reverseAccCPS([10, 20, 30, 40, 50], [], console.log)