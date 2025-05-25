// Checkout the README file for the problem statement

// But first, lets try to solve this problem in a traditional way without using CPS






// End of traditional way

function retryWithBackoffCps(
    operation,
    maxAttempts,
    initialDelay,
    successCont,
    failureCont
) {
    // Here "operation" is a function, that itself will take successCont and failureCont
    operation()
}


// Our mock server
function mockServer(onSuccess, onError) {
    function wrapper() {
        const randomNumber = Math.floor(Math.random() * 3); // generate random number upto 2
        if (randomNumber === 2) {
            onSuccess({"success": true, "data": "Hey there!"})
        } else {
            onError({"success": false, "data": "Something went wrong!"})
        }
    }
    setTimeout(wrapper, 1000);
}


function asyncOperationCps(url, onSuccess, onError) {

}


retryWithBackoffCps(
    someOperation,  // some async operation
    3,              // max attempt
    100,            // initial delay (100ms)
    console.log,
    console.error
);