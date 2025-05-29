
/**
 * Let's first come up with something.
 * Basically we want to build validators.
 * Given a value, we want to validate it.
 * For example, if given an "email" we want to validate it.
 * Check if the email is a valid email.
 * Check if the value (email) is available or not
 * 
 * What we want to do?
 * -------------------
 * We want to build validators and chain them together and finally pass the email as the value to it.
 * In this example, we want to accumulate the errors.
 */


// *************** Validators ************* /
function createValidatorFunction(validatorFn, errorMessage) {
    return function (value, onSuccess, onError) {
        if (validatorFn(value)) onSuccess(value);
        else onError(errorMessage);
    }
}

const required = createValidatorFunction(
    value => value !== null && value !== '',
    "Email is required"
);

const isEmail = createValidatorFunction(
    value => value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    'Must be a valid email address'
)

// *************** End of Validators ************* /


// *************** Chain Validators ************************ /
function chainValidators(value, validators, onSuccess, onError) {
    // Remember we want to accumulate the errors
    let errors = [];
    let completed = 0;

    if (validators.length === 0) {
        onSuccess(value);
        return;
    }
    
    for (let i = 0; i < validators.length; i++) {
        validators[i](value, () => {
            completed++;
            if (completed >= validators.length && errors.length === 0) {
                onSuccess(value);
            }
        }, (error) => {
            errors.push(error);
            completed++;
            if (completed >= validators.length) {
                onError(errors);
            }
        })
    }
}
// *************** End of Chain Validators ***************** /

const validators = [required, isEmail];

chainValidators(
    "test@example.com",
    validators,
    console.log,
    console.error
);

chainValidators(
    "",
    validators,
    console.log,
    console.error
);