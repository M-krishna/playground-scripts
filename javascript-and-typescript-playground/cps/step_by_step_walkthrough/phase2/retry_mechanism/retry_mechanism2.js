// Check out the README file for problem statement

/**
 * In the first version (retry_mechanism.js) of retry mechanism, we implemented a function which only works for
 * getData function.
 * 
 * Now we want to implement something more generic. We want to write a function that takes in another function,
 * and the maximum retry count and the initial delay.
 * 
 * This function should return another function, where we can pass the arguments of the original function and
 * the success and error continuations
 */


/**
 * For example, let say we have a function named `refreshUserData`.
 * And we want to have a retriable version of this function.
 * So we have to build a function named, for example `retryCps`, which looks like:
 * `retryCps(fn, maxRetries, initialDelay)`. When calling
 * `retryCps(refreshUserData, 3, 1000)`.
 * 
 * We will call the returned function from retryCps like, let's say the name of the function returned is
 * `retriableRefreshUserData`.
 * `retriableRefreshUserData(101, console.log, console.error)`
 */

// Let's implement retryCps function
function retryCps(fn, maxRetries, initialDelay) {
    if (typeof fn !== 'function') throw new TypeError("Expected an argument of type function");
    if (typeof maxRetries !== 'number' || typeof initialDelay !== 'number') throw new TypeError("Expected an argument of type function");

    // fn is a function that might take "n" number of arguments.
    // Along with that it must take the success and error continuation functions
    // For example, fn(arg1, arg2, ... argn, onSuccess, onError)
    return function (...args) {
        // Inside this function, we have to implement the retry logic
        // the retry logic retries the "fn" by passing the correct arguments to it.

        // Get the continuation functions out of the args array
        const errorContinuationFunction = args.pop();
        const successContinuationFunction = args.pop();
        const restArgs = args;

        let attempts = 0;

        function attempt() {
            fn(...restArgs, 
                (result) => {
                    successContinuationFunction(result);
                },
                (error) => {
                    if (attempts >= maxRetries) {
                        errorContinuationFunction(error);
                    } else {
                        attempts += 1;
                        const delay = initialDelay * Math.pow(2, attempts - 1); // Exponential backoff
                        console.log(`Attempt ${attempts} failed. Retrying in ${delay}ms...`);
                        setTimeout(attempt, delay);
                    }
                }
            )
        }
        attempt();
    }
}


// Let's implement a mock server
function mockServer(userId) {
    const randomNumber = Math.floor(Math.random() * 3); // random number from 0 to 2
    if (randomNumber === 2) {
        return { success: true, data: {
            userId,
            firstName: "krishna",
            age: 27,
            message: "Hello there"
        } };
    }
    return { success: false, error: "Something went wrong" };
}


// Let's implement a function that calls the mock server and fetches data
function getData(userId, onSuccess, onError) {
    const response = mockServer(userId);
    if (response.success) {
        onSuccess(response);
    } else {
        onError(response);
    }
}


// Let's hook getData function into retryCps function
const retriableGetData = retryCps(getData, 5, 1000);
retriableGetData(10, console.log, console.error);


// Let's create another function which takes 2 arguments and calls the server function
function login(username, password, onSuccess, onError) {
    const response = mockServer(username);
    if (response.success) {
        onSuccess(response);
    } else {
        onError(response);
    }
}

// Let's hook login function into retryCps function
const retriableLogin = retryCps(login, 5, 1000);
retriableLogin("krishna", "password", console.log, console.error);