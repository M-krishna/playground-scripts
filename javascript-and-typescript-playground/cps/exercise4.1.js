/**
 * Exercise 4: Asynchronous Control Flow
 * 
 * Simulate I/O or timeouts purely in CPS to see how callbacks underpin async behavior
 * 
 * Exercise 4.1: Timeout sequence
 */

function waitCPS(ms, k) {
    setTimeout(() => k(), ms);
}

waitCPS(500, () => {
    console.log("Step 1");
    waitCPS(1000, () => {
        console.log("Step 2");
        waitCPS(1500, () => {
            console.log("Step 3");
        })
    })
})