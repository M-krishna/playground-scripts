// Addition
function add(x, y) {
    return x + y;
}

function addCPS(x, y, k) {
    k(x + y);
}

addCPS(10, 20, (result) => console.log(result));


// Multiplication and Addition
function mulAdd(a, b, c) {
    return a * b + c;
}

function mulAddCPS(a, b, c, k) {
    let mul = a * b;
    k(mul + c);
}

mulAddCPS(10, 20, 35, (result) => console.log(result));

// String concatenation
function greet(name) {
    return "Hello, " + name + "!";
}

function greetCPS(name, k) {
    k(`Hello ${name}!`);
}

greetCPS("Cheeks", console.log)

// Maximum of Two Numbers
function max(x, y) {
    return x > y ? x : y;
}

function maxCPS(x, y, k) {
    let max = x > y ? x : y;
    k(max);
}

maxCPS(40, 20, console.log);

// Square and Subtract One
function squareMinusOne(n) {
    return n * n - 1;
}

function squareMinusOneCPS(n, k) {
    let sq = n * n;
    k(sq - 1);
}

squareMinusOneCPS(5, console.log)

// Mapping over a List (Recursive)
function map(f, lst) {
    if(!lst.length) return []
    return [f(lst[0])].concat(map(f, lst.slice(1)))
}

const numbers = [1,2,3,4,5];
const doubled = map(x => x * 2, numbers);
console.log(doubled)

function mapCPS(f, lst, k) {
    if (lst.length === 0) {
        k([]);
    } else {
        mapCPS(f, lst.slice(1), function(rest) {
            k([f(lst[0])].concat(rest))
        })
    }
}

mapCPS(x => x * 2, [1,2,3,4,5], (result) => console.log(result))


// Factorial (Tail-Recursive CPS)
function fact(n) {
    return n === 0 ? 1 : n * fact(n - 1);
}

function factCPS(n, k) {
    if (n === 0) {
        k(1);
    } else {
        factCPS(n - 1, function(r) {
            k(n * r)
        })
    }
}

factCPS(6, (result) => console.log(result));

// Greatest Common Divisor (GCD)
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b)
}

function gcdCPS(a, b, k) {
    if (b === 0) {
        k(a);
    } else {
        gcdCPS(b, a % b, function(r) {
            k(r)
        })
    }
}

gcdCPS(123456, 789012, (result) => console.log(result));