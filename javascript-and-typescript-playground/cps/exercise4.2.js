/**
 * Exercise 4.2: Mock I/O Read
 * 
 * Build `readLineCPS(prompt, k)` that simulates prompting the user (eg. via prompt() in a browser) and passes the input to
 * k.
 * 
 * NOTE: Run the below code in a browser environment, since node doesn't have a prompt function
 */

function readLineCPS(_prompt, k) {
    const result = prompt(_prompt);
    setTimeout(() => k(result), 0); // Used setTimeout here to simulate async behavior
}

readLineCPS("what is your name?", console.log);