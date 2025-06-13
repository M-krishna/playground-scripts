// Try build a web server only using functions without any dependency

const http = require('http');
const url = require('url');

const PORT = 3001;

function parseRequest(nodeReq) {
    const parsedUrl = url.parse(nodeReq.url);
    return {
        method: nodeReq.method,
        url: nodeReq.url,
        path: parsedUrl.pathname,
        query: parsedUrl.query,
        headers: nodeReq.headers,
        body: null // for now we'll not parse the body
    }
}

function rootHandler(req) {
   return {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Hello, functional world'
   } 
}

function homeHandler(req) {
    return {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: 'This is a functional web server built with pure functions'
    }
}

function notFoundHandler(req) {
    return {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
        body: '404 Not Found'
    }
}

const routes = {
    "GET /": rootHandler,
    "GET /home": homeHandler,
    '*': notFoundHandler
}

function handleRequest(parsedReq) {
    // based on the path, we can handle things right?
    const route = `${parsedReq.method} ${parsedReq.path}`
    const handler = routes[route] || routes['*'];
    return handler();
} 

function sendResponse(responseObject, nodeRes) {
    nodeRes.writeHead(responseObject.status, responseObject.headers || {})
    nodeRes.end(responseObject.body || '')
}


function server(nodeReq, nodeRes) {
    const request = parseRequest(nodeReq);
    const response = handleRequest(request);
    sendResponse(response, nodeRes);
}

function createServer(serverFunc, port) {
    const httpServer = http.createServer(serverFunc)

    httpServer.listen(PORT, () => {
        console.log(`server started and listening on port: ${PORT}`);
    })
}


if (require.main === module) {
    createServer(server, PORT);
}