// Check out the README file to know about Pipeline processor and the problem statement


function validateEmail(userData, successContinuation, errorContinuation) {
    // userData is an object
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(userData.email)) {
        successContinuation(userData);
    } else {
        errorContinuation("Email is not valid");
    }
}


function validatePassword(userData, successContinuation, errorContinuation) {
    // userData is an object
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (passwordRegex.test(userData.password)) {
        successContinuation(userData)
    } else {
        errorContinuation("Password must be minimum 8 characters, at least 1 letter and 1 number");
    }
}


const userData = {
    email: "xyz123@abc.com", password: "myOwnPassword"
}


// But let's first solve this problem in a traditional CPS way
function composeCps(fCps, gCps) {
    return function (initialData, onSuccess, onError) {
        gCps(initialData, function (gResult) {
            fCps(gResult, onSuccess, onError)
        }, onError);
    }
}

const validateEmailAndPassword = composeCps(validatePassword, validateEmail);
validateEmailAndPassword(userData, console.log, console.error);


const stages = [validateEmail, validatePassword];

// function pipelineProcessor(
//     userData,
//     stages,
//     successContinuation,
//     errorContinuation
// ) {
//     // can I compose the stages?
//     function compose(...args) {

//     }
// }