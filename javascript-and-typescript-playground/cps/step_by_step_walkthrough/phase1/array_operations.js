/**
 * Implement the direct style and CPS style versions of
 * map, reduce and filter
 */


// Direct style implementation of map (recursive)
function map(f, lst) {
    if (typeof f !== 'function') throw new TypeError("Expected an argument of type function");
    if (lst.length === 0) return [];

    const [head, ...tail] = lst;
    return [f(head)].concat(map(f, tail));
}

console.log(map(x => x % 2 === 0, []))
console.log(map(x => x + 1, [1,2,3,4,5,6,7,8,9,10]))


// CPS style implementation of map (recursive)
function mapCPS(f, lst, k) {
    if (typeof f !== 'function') throw new TypeError("Expected an argument of type function");
    if (lst.length === 0) k([]);
    else {
        const [head, ...tail] = lst;
        mapCPS(f, tail, function (r) {
            k([f(head)].concat(r))
        })
    }

}

mapCPS(x => x * 2, [1,2,3,4,5,6,7], (result) => console.log(result))


// Direct style implementation of reduce (recursive)
function reduce(f, lst, acc) {
    if (typeof f !== 'function') throw new TypeError("Expected an argument of type function");
    if (!Array.isArray(lst)) throw new TypeError("Expected an argument of type Array");
    // Base case
    if (lst.length === 0) return acc;
    // Recursive case
    const [head, ...tail] = lst;
    return reduce(f, tail, f(acc, head));
}

console.log(reduce((acc, curr) => (curr + acc), [], 0))
console.log(reduce((acc, curr) => (curr + acc), [1,2,3,4,5], 0))


// CPS style implementation of reduce (recursive)
function reduceCPS(f, lst, acc, k) {
    if (typeof f !== 'function' || typeof k !== 'function') throw new TypeError("Expected an argument of type function");
    if (!Array.isArray(lst)) throw new TypeError("Expected an argument of type Array");
    // Base case
    if (lst.length === 0) k(acc);
    else {
        // Recursive case
        const [head, ...tail] = lst;
        reduceCPS(f, tail, f(acc, head), function (r) {
            k(r)
        });
    }
}

reduceCPS(
    (acc, curr) => curr * acc,
    [],
    0,
    console.log
);

reduceCPS(
    (acc, curr) => curr * acc,
    [10,20,3,2],
    1,
    console.log
);