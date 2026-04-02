function job() {
    return Promise.resolve(10)
        .then(x => x * 2)
        .then(x => x + 5)
        .then(x => {
            throw new Error("Something went wrong");
        })
}

job();