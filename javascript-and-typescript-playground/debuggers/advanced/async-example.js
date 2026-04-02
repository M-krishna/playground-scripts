function fetchUser(id) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res({id, name: "krishna"});
        }, 1000);
    });
}

async function run() {
    console.log("Before fetch");
    const user = await fetchUser(42);
    console.log(`User: ${user}`);
    console.log("After fetch");
}

run();