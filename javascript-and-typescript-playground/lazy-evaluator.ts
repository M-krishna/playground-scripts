// Introduction //

// Eager function
function sum(a: number, b: number): number {
    return a + b
}

console.log(sum(10 + 20, 100))

// Lazy function
type Lazy<T> = () => T
function lazySum(a: Lazy<number>, b: Lazy<number>): Lazy<number> {
    return () => a() + b();
}

console.log(lazySum(() => (10 + 20), () => 100)())
// End of Intro //


// Trying compute big //

// End of Trying to compute big // 
