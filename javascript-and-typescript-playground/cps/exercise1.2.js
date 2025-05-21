/**
 * Exercise 1.2:
 * 
 * Generic CPS Map + Filter
 * 
 * Given `mapCPS(f, lst, k)` from before (refer exercise.js) and a new `filterCPS(pred, lst, k)`,
 * implement `filterCPS` so that it only keeps elements where `pred(x)` is true (in CPS).
 * 
 * Then compose them to filter even numbers and then double each one - all in CPS
 */

/**
 * How a regular map function would look like?
 * It takes in a function and an iterable(array) as its argument.
 * It applies the function to each of the element in the array and returns the result.
 * Finally the map function returns a brand new array
 * Lets take a look at the implementation
 */
function map(f, lst) {
    if (typeof f !== 'function') throw new TypeError("Expected an argument of type function");
    if (lst.length === 0) return [];    // Base case for recursion
    return [f(lst[0])].concat(map(f, lst.slice(1)))
}

const squareResult = map((x) => x * x, [1,2,3,4,5])
console.log(squareResult)

/**
 * A map continuation passing style function takes in 3 arguments
 * f - a function
 * lst - a list/array (iterable)
 * k - continuation function or callback function
 */
function mapCPS(f, lst, k) {
    if (typeof f !== 'function' || typeof k !== 'function') throw new TypeError("Expected argument of type function");
    if (lst.length === 0) {
        k([]);
    } else {
        const [head, ...tail] = lst;
        mapCPS(f, tail, function (rest) {
            k([f(head)].concat(rest))
        })
    }
}

function double(x) {
    return x * 2;
}

function plusOne(x) {
    return x + 1;
}


mapCPS(plusOne, [20, 5, 6, 99, 100], console.log)


/**
 * Now that we've implemented mapCPS, lets implement filterCPS
 * 
 * Lets first take a look at filter function
 * filter function takes in two things
 * lst - a list/array (an iterable)
 * f   - a callback function which should return a boolean
 * 
 * Input - [1,2,3,4,5]
 * Callback function - (x) => x > 1
 * Output - [2,3,4,5]
 */
function filter(pred, lst) {
    if (typeof pred !== 'function') throw new TypeError("Expected an argument of type function");
    if (lst.length === 0) return []
    const [head, ...tail] = lst;
    if (pred(head)) return [head, ...filter(pred, tail)];
    else return filter(pred, tail)
}

const filterResult = filter(x => x % 2 === 0, [1,2,3,4,5,6,7,8,9,10])
console.log(filterResult)


// Now let's implement filterCPS function
function filterCPS(pred, lst, k) {
    if (typeof pred !== 'function' || typeof k !== 'function') throw new TypeError("Expected an argument of type function");
    if (lst.length === 0) {
        k([]);
    } else {
        const [head, ...tail] = lst;
        filterCPS(pred, tail, function (rest) {
            if (pred(head)) {
                k([head, ...rest])
            } else {
                k(rest)
            }
        })
    }
}

filterCPS(x => x % 2 !== 0, [1,2,3,4,5,6,7,8,9,10], console.log);

// Now that we have mapCPS and filterCPS, let's implement our exercise question
// Filter even numbers and double them using CPS

// Let's first write our composeCPS function
function composeCPS(fCPS, gCPS) {
    return function (x, k) {
        gCPS(x, function (resultFromG) {
            fCPS(resultFromG, k)
        })
    }
}

// Define predicate functions for even and double
function isEven(n) {
    return n % 2 === 0;
}

function double(n) {
    return n * 2;
}

// Create CPS versions for filter and map
function filterEvenCPS(lst, k) {
    filterCPS(isEven, lst, k);
}

function mapDoubleCPS(lst, k) {
    mapCPS(double, lst, k);
}

const evenAndDouble = composeCPS(mapDoubleCPS, filterEvenCPS);
evenAndDouble([1,2,3,4,5,6,7,8,9,10], console.log)