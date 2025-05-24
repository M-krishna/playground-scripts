/**
 * Question: Simple calculator that chains operations
 * 
 * What are we supposed to do?
 * ---------------------------
 * Instead of calculating (5 + 3) * 2 - 1 all at once, we want to build a calculator where each operation passes its result to
 * the next operator in the chain. 
 * 
 * What makes this a good CPS exercise?
 * ------------------------------------
 * Normal calculator thinking: "Give me two numbers and an operator, I'll return the result"
 * CPS calculator thinking: "Give me two numbers, an operator, and tell me what to do with the results when I'm done."
 * 
 * The Chaining aspect
 * -------------------
 * This is where it gets interesting for learning CPS. You want to be able to say things like:
 * Start with 10
 * Add 5 to it
 * Then multiply that result by 2
 * Then subtract 3 from that result
 * Finally, tell me what the answer is
 * 
 * Each step doesn't know or care what comes next - it just does its job and pass the result forward.
 * 
 * Why this teaches CPS well
 * -------------------------
 * Explicit sequencing: You have to think about "what happens next" at each step.
 * Result passing: Each operation must hand off its result rather than returning it.
 * Continuation composition: You learn how to chain multiple continuations together.
 * Real-world analogy: It's easy to visualize and understand
 * 
 * What you're building toward
 * ---------------------------
 * By the end, you should be able to express complex calculations where:
 * Operations are decoupled from each other
 * You can easily insert new operations in the middle of the chain
 * Error handling can be built into the flow
 * You can potentially make operations async later
 * 
 * The beauty is once you understand how to chain simple math operations this way, you'll see the same pattern everywhere:
 * chaining database queries, chaining API calls, chaining file operations etc.
 */


// Let's start with CPS functions for operators (+, -, *, /)
function addCPS(a, b, k) {
    k(a + b);
}

function subtractCPS(a, b, k) {
    k(a - b);
}

function multiplyCPS(a, b, k) {
    k(a * b);
}

function divideCPS(a, b, k) {
    k(a / b);
}

// Now that we have the operators ready in CPS style, lets do some operations
// Let's calculate the original question: (5 + 3) * 2 - 1 

addCPS(5, 3, function (addResult) {
    multiplyCPS(addResult, 2, function (multiplyResult) {
        subtractCPS(multiplyResult, 1, function (finalResult) {
            console.log(finalResult);
        })
    })
}) // We should get 15 as the result

/**
 * Next Natural Steps for the Calculator
 * 
 * Flattening the nesting: Those nested callbacks create a "pyramid of doom". Can you create a helper function to make
 * chaining more readable?
 * 
 * Error handling: What happens if someone tries to divide by zero? How would you handle error in a CPS style?
 * 
 * Dynamic operations: Instead of hardcoding the sequence, could you accept an array of operations and values to execute?
 * 
 * Branching logic: What if you wanted to do different operations based on intermediate results? (Eg. if the result is 
 * negative, multiply by -1)
 * 
 * State preservation: Could you build a calculator that remembers previous result and can reference them?
 * 
 * The nested structure might look awkward now, but it's actually setting you up perfectly to understand more advanced patterns
 * like monads and async workflows later.
 */


// May be I can tackle the first problem using a composeCps function?
// A composeCps function which takes 2 CPS functions as its argument
function composeCps(fCps, gCps) {
    return function (initialValue, continuationFunction) {
        gCps(initialValue, (gResult) => {
            fCps(gResult, (fResult) => {
                continuationFunction(fResult)
            })
        })
    }
}

// Now that the compose function is ready, let's create our calculation functions
function add3Cps(someValue, k) {
    addCPS(someValue, 3, k)
}

function multiply2Cps(someValue, k) {
    multiplyCPS(someValue, 2, k)
}

function subtract1Cps(someValue, k) {
    subtractCPS(someValue, 1, k)
}

const add3AndMultiply2 = composeCps(multiply2Cps, add3Cps);
const add3AndMultiply2Andsubtract1 = composeCps(subtract1Cps, add3AndMultiply2);

add3AndMultiply2Andsubtract1(5, console.log)

