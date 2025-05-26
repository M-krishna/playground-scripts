// Checkout the README file for the problem statement

// Mock server
function mockServer(onSuccess, onError) {
    const randomNumber = Math.floor(Math.random() * 3); // random number
    if (randomNumber === 2) {
        onSuccess({ success: true, data: "Hello there" })
        return;
    }
    onError({ success: false, error: "Something went wrong" });
    return;
}


function getData(maxRetries, initialDelay, onSuccess, onError) {
    let attempts = 1;

    function attempt() {
        console.log(`Attempt number: ${attempts}`);
        mockServer(onSuccess, function (err) {
            if (attempts > maxRetries) {
                onError(err);
            } else {
                const delay = initialDelay * attempts; // Linear backoff
                attempts += 1;
                setTimeout(attempt, delay);
            } 
        })
    }
    attempt();
}


getData(3, 1000, console.log, console.error);