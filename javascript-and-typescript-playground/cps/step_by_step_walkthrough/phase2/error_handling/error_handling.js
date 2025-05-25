/**
 * Error handling mechanism: Create a CPS-based error handling mechanism (like a Maybe monad)
 * 
 * Problem statement: Imagine you have a system where you want to greet a user by their name. However fetching the user data
 * might fail (eg. the user doesn't exist or the data source is unavailable)
 * 
 * Your task:
 * Create a CPS-based system to:
 * getUserByIdCPS(userId, onSuccess, onError):
 *  This function simulates fetching a new user
 *  It should take a userId
 *  If userId is 1: it "succeeds" and calls onSuccess with a user object like { id: 1, name: "Alice" }
 *  If userId is any other value: It "fails" (simulating user not found) and calls onError with an error message like
 *  "user not found"
 */


function getUserByIdCPS(userId, onSuccess, onError) {
    if (typeof userId !== 'number') {
        onError(new TypeError("Expected an argument of type number"));
        return;
    }
    if (userId === 1) onSuccess( { id: 1, name: "Alice" } );
    else onError(`user with id ${userId} not found`);
}

getUserByIdCPS(1, console.log, console.log);
getUserByIdCPS(2, console.log, console.log);

/**
 * greetUserCPS(user, onSuccess, onError):
 *  This function takes a user object
 *  If the user object has a "name" property. It "succeeds" and calls onSuccess with a greeting string like
 *  "Hello, [name]!"
 *  If the user object is null, undefined, or doesn't have a "name" property: it "fails" and calls "onError" with an error
 *  message like "Invalid user object"
 */

function greetUserCPS(user, onSuccess, onError) {
    if (typeof user !== 'object') onError("Invalid user object");
    else if (Object.keys(user).filter(x => x === "name").length !== 1) onError("user object doesn't have the name property");
    else onSuccess(`Hello, ${user.name}`);
}

const user = { id: 1, name: "Alice" };
const user2 = { id: 2, age: 23 };

greetUserCPS(user, console.log, console.log);
greetUserCPS(user2, console.log, console.log);

/**
 * Combine these two functions:
 * Write a way to call getUserByIdCPS and if its successful, use its result to call greetUserCPS.
 *  If getUserByIdCPS fails, greetUserCPS should not be called, and the overall operation should report the error from
 *  getUserByIdCPS
 *  If getUserByIdCPS succeeds but greetUserCPS fails (eg. user object is malformed, though our simple getUserByIdCPS won't
 *  produce this), the overall operation should report the error from greetUserCPS
 */

function composeCPS(fCps, gCps) {
    return function (initialValue, onSuccess, onError) {
        gCps(initialValue, function (gResult) {
            fCps(gResult, onSuccess, onError);
        }, onError)
    }
}

const fetchAndGreetUser = composeCPS(greetUserCPS, getUserByIdCPS);
fetchAndGreetUser(1, console.log, console.log)
fetchAndGreetUser(2, console.log, console.log)