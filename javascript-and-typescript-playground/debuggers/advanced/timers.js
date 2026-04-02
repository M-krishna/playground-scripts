console.log("A");

setTimeout(() => {
    console.log("B");
})

Promise.resolve().then(() => {
    console.log("C")
})

console.log("D")