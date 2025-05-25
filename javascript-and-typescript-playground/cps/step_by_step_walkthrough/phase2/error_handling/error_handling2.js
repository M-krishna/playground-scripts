/**
 * Divide two numbers using CPS
 */

function divideCps(a, b, onSuccess, onError) {
    if (b === 0) {
        onError("The value of b cannot be zero");
    } else {
        onSuccess(a / b);
    }
}

divideCps(1, 0, console.log, console.log);
divideCps(4, 2, console.log, console.log);


/**
 * Safe string to number conversion
 */

function safeParseIntCps(str, onSuccess, onError) {
    if (typeof onSuccess !== 'function' || typeof onError !== 'function') {
        onError(new TypeError("Expected an argument of type function"));
        return;
    }

    if (str == null) {
        onError("Input cannot be null");
        return;
    }

    const number = parseInt(str);
    if(Number.isNaN(number)) {
        onError(`${str} is not a number`);
        return
    } else {
        onSuccess(number);
    }
}

safeParseIntCps(1, console.log, console.log)
safeParseIntCps("12", console.log, console.log)
safeParseIntCps("k", console.log, console.log)


/**
 * Safe add CPS.
 */

function safeAddCps(a, b, onSuccess, onError) {
    try {
        if (typeof a !== "number" || typeof b !== 'number') throw new TypeError("Expected an argument of type number");
        onSuccess(a + b);
    } catch (err) {
        onError(err);
    }
}

// safeAddCps("1", "2", console.log, console.log) // throws error
safeAddCps(1, 2, console.log, console.log)


// A tightly coupled, sequential composeCps function
function composeCpsSequential(fCps, gCps) {
    return (firstInitialValue, secondInitialValue, onSuccess, onError) => {
        gCps(firstInitialValue, function (gResult) {
            gCps(secondInitialValue, function (gResult2) {
                fCps(gResult, gResult2, onSuccess, onError)
            }, onError);
        }, onError);
    }
}

const addNumbersCps = composeCpsSequential(safeAddCps, safeParseIntCps)

addNumbersCps(
    "10", "20",
    (result) => console.log(result),
    (err) => console.log(err)
)

addNumbersCps(
    "100", "20",
    (result) => console.log(result),
    (err) => console.log(err)
)

addNumbersCps(
    4, 2,
    (result) => console.log(result),
    (err) => console.log(err)
)

addNumbersCps(
    "l", 2,
    (result) => console.log(result),
    (err) => console.log(err)
)

addNumbersCps(
    "2", "p",
    (result) => console.log(result),
    (err) => console.log(err)
)


// How can we build a loosely coupled compose function
// TODO: Implement a loosely coupled compose function or try to find the pattern
// and extract it out