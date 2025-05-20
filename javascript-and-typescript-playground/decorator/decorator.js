
function print_stack(func) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function argument');
    }

    let depth = 0;
    const MAX_DEPTH = 1000; // To prevent stack overflow

    function wrapper(...args) {
        try {
            // Prevent stack overflow
            if (depth >= MAX_DEPTH) {
                throw new Error('Maximum call stack depth exceeded');
            }

            const indent = " ".repeat(depth);
            console.log(`${indent} Entering ${func.name}`);
            console.log(`${indent} Args: ${JSON.stringify(args)}`);

            depth += 1;
            const result = func(...args);
            depth -= 1;

            console.log(`${indent} Exiting ${func.name}`);

            return result;
        } catch (error) {
            console.log(`Error in ${func.name}`)
        }
    }

    return wrapper
}


// We can use the above HOF with any recursive functions

// Let's create a recursive function
let decorated_hello;

function hello(number) {
    if (number <= 10) return
    return decorated_hello(number - 1)
}

decorated_hello = print_stack(hello);
decorated_hello(20);