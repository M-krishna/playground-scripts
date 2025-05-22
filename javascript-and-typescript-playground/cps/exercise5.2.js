/**
 * Exercise 5.2: Expression Evaluator
 * 
 * Write a small arithmetic AST evaluator in direct style, then convert it to CPS so that each node's evaluation takes a
 * continuation
 */

/**
 * What is an expression?
 * Ans: An expression evaluates to something.
 * For example: 1 + 2 = 3 is an expression, because 1 + 2 evaluates to 3
 */

/**
 * we have to generate an AST for an expression
 * But generating one from scratch for the sake of learning CPS is a overkill.
 * So let's construct an AST randomly and evaluate it.
 */

/**
 * What is an AST? Abstract Syntax Tree
 * It is a form of representing source code in a tree structure. Its mainly useful in implementing compiler and interpreter.
 * For example, an expression 1 + 2 here is how an AST might look like
 */

const exampleAST = {
    type: "binOp",
    op: "+",
    left: {     // left is also an expression (nested)
        type: "number",
        value: 1
    },
    right: {    // right is also an expression (nested)
        type: "number",
        value: 2
    }
}


function evaluate(expression, env) {
    switch (expression.type) {
       case 'number': {
            return expression.value
       }
       case 'var':
            return env[expression.name];
        case 'binOp':
            const left = evaluate(expression.left);
            const right = evaluate(expression.right);
            switch (expression.op) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/': return left / right;
                default: throw new Error(`Unknown operator: ${expression.op}`)
            }
        default:
            throw new Error(`Unknown expression type: ${expression.type}`)
    }
}

console.log(evaluate(exampleAST, {}))


function evaluateCPS(expression, env, k) {
    switch (expression.type) {
        case 'number': k(expression.value); break;
        case 'var': k(env[expression.name]); break;
        case 'binOp': {
            evaluateCPS(expression.left, env, function (leftResult) {
                evaluateCPS(expression.right, env, function (rightResult) {
                    let result;
                    switch (expression.op) {
                        case '+': result = leftResult + rightResult; break;
                        case '-': result = leftResult - rightResult; break;
                        case '*': result = leftResult * rightResult; break;
                        case '/': result = leftResult / rightResult; break;
                        default: throw new Error(`Unknown operator: ${expression.op}`);
                    }
                    k(result);
                })
            })
            break;
        }
        default: throw new Error(`Unknown expression type: ${expression.type}`);
    }
}

evaluateCPS(exampleAST, {}, console.log)