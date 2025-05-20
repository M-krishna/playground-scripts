// Continuous passing style

// Implementing Identity function in a tradtional way
function identity(x) {
    return x;
}

console.log(identity(1)); // prints 1

// Implementing Identity function in CPS
function identity_cps(x, cc) {
    cc(x);
}

identity_cps(1, (x) => console.log(x)); // prints 1



// Add function in traditional way
function add(a, b) {
    return a + b;
}

let sum = add(1,2);
console.log(sum)

// Add function in CPS style
function add_cps(a, b, k) {
    k(a,b);
}

add_cps(1, 2, (result) => console.log(result));


// Chaining function together
// Lets say we want to concatenate two string together and capitalize it

// concat and capitalize function in Traditional way
function concat(a, b) {
    return a + b
}

function capitalize(str) {
    return str.toUpperCase()
}

let result = capitalize(concat("hello", "world!"));
console.log(result);

// concat and capitalize function using CPS style
function concat_cps(a, b, k) {
    k(a + b);
}

function capitalize_cps(str, k) {
    k(str.toUpperCase());
} 

concat_cps("hello", "world!", (str) => {
    capitalize_cps(str, (result) => console.log(result));
})


// Simple Asynchronous Demo
const fs = require('fs');

function readFileCPS(path, encoding, k) {
    fs.readFile(path, encoding, function (err, data) {
        if (err) console.error(err);
        k(data);
    });
};

readFileCPS("./message.txt", "utf-8", (text) => console.log(text));


// Recursive factorial
function factorial(n) {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}
console.log(factorial(5));


// CPS style
function factorialCPS(n, k) {
    if (n === 0) {
        k(1);
    } else {
        factorialCPS(n - 1, function (r) {
            k(n * r)
        })
    }
}

factorialCPS(5, (result) => console.log(result));


function greetCPS(name, k) {
    k(`Hello ${name}!`);
}