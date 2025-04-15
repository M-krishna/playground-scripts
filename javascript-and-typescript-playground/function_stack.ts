function one(): string {
    return "One"
}

function two(): string {
    return "Two"
}

function three(): string {
    return "Three"
}

type MyFunction = (arg: any) => string;

let function_list: MyFunction[] = [one, two, three];


let start: MyFunction = function_list.pop();

while (start) {
    let return_value: string = start();
    console.log(return_value);
    start = function_list.pop();
}


// Modelling middleware
// create an App class, which when initialized, constructs an empty list(queue)
// This class contains a "use" method, which takes in functions and puts it in the queue
// This class contains an "execute" method which executes the functions that are present in the queue
// If the queue is empty, it says that its empty.


class App {
    queue: MyFunction[];
    constructor() {
	this.queue = [];
    }

    public use(f: MyFunction): void {
	this.queue.push(f);
    }

    public execute(): void {
	let front: MyFunction = this.queue.shift();
	while (front) {
	    const return_value = front();
	    console.log(return_value);
	    front = this.queue.shift();
	}
    }

    public print_queue(): void {
	for (let f of this.queue) {
	    console.log(f);
	}
    }

    public is_empty(): bool {
	return this.queue.length === 0;
    }
}

const app = new App();
console.log(app.is_empty());
app.use(one);
console.log(app.is_empty());
app.use(two);
app.use(three);
app.print_queue();
app.execute();
console.log(app.is_empty());






// lets say, the current function that gets executed requires the returned value of the previous function?
// How would you design that?
// cases to handle
// the first function that gets executed will not be able to get the value because that's the first to get executed
// the rest of the functions can get the return value only if the previous function returned something. If the previous gets return anything, the function that executing should process the undefined value.

function four(a: string): string {
    console.log(`Four got ${a}`);
    return "FOUR!"
}

function five(a: string): string {
    console.log(`Five got ${a}`);
    return "FIVE!"
}

function six(a: string): string {
    console.log(`Six got ${a}`);
    return "SIX!"
}

type MyNewFunctions = (a: string) => string;


class Middleware{
    queue: MyNewFunctions[];
    constructor() {
	this.queue = []
    }

    public use(f: MyNewFunctions): void {
	this.queue.push(f);
    }

    public execute(): void {
	let start: MyNewFunctions = this.queue.shift();
	let function_result: string;
	while (start) {
	   function_result = start(function_result);
	   console.log(`Function result of ${start.name} is ${function_result}`);
	   start = this.queue.shift();
	}
    }

    public is_empty(): bool {
	return this.queue.length === 0
    }
}

const m = new Middleware();
console.log(m.is_empty());
m.use(four);
m.use(five);
m.use(six);
console.log(m.is_empty());
m.execute();
