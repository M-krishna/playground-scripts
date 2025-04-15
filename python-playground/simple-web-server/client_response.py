def construct_client_response():
    result: str = ""

    # Status line Format: HTTP_VERSION STATUS_CODE REASON\r\n
    # Eg. HTTP/1.1 200 OK\r\n
    # Eg. HTTP/1/1 500 Internal Server Error\r\n
    status_line: str = "HTTP/1.1 200 OK\r\n"


    body: str = "<html><head><title>Test</title></head><body><p>Hello from server!</p></body></html>"

    # Headers format: Each header is on its own line and must follow the "Key:Value" format ending with \r\n
    # Content-Type: text/html\r\n
    # Content-Length: 123\r\n
    # Connection: close\r\n
    # Finally a mandatory empty line \r\n
    headers: str = f"Content-Type: text/html\r\nContent-Length: {len(body.encode('utf-8'))}\r\nConnection: close\r\n\r\n"


    result = status_line + headers + body
    return result.encode("utf-8")   # Finally we encode the result to utf-8 before writing it to the socket