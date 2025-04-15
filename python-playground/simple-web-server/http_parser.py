
def parse_http_request(request_data: str) -> None:
    
    # Initialize empty structures
    request_line = ""
    headers = {}
    body = ""

    # Split the raw request by the sequence that separates headers from the body.
    # This finds the first occurance of the blank line
    parts = request_data.split('\r\n\r\n', 1)

    # The first part contains the request-line and header lines
    header_section = parts[0]

    # If there is a body, it will be in second part of the split
    if len(parts) > 1:
        body = parts[1]

    # Split the header section by line breaks to process each line
    lines = header_section.split('\r\n')

    # This first line is expected to be the Request-line
    if lines:
        request_line = lines[0]
    else:
        raise ValueError("Empty request received")

    # Parse the request line, should contain method, endpoint and HTTP version
    try:
        method, endpoint, http_version = request_line.split(' ', 2)
    except ValueError:
        raise ValueError(f"Malformed Request-line. Expected format: 'METHOD URI HTTP/VERSION'")

    # Process the remaining header lines
    for line in lines[1:]:
        # Skip empty lines
        if not line.strip():
            continue
        try:
            key, value = line.split(':')
        except ValueError:
            continue
        headers[key.strip().lower()] = value

    request_obj = {
        "method": method,
        "endpoint": endpoint,
        "version": http_version,
        "headers": headers,
        "body": body
    }

    return request_obj