const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/error") {
    throw new Error("Manual crash");
  }

  res.end("Hello");
});

server.listen(3000);
console.log("Running on 3000");
