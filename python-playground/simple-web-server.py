import socket

# Create a socket object (I need to explore other configs later)
socket_obj = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Bind the socket object to an address and a port
socket_obj.bind(('0.0.0.0', 8081))
print(f"server is listening on port: 8081")

# Listen to incoming connections
socket_obj.listen(1)

# Infinite loop that waits for an incoming connection request
while True:
    sock_connection, address_info = socket_obj.accept()              # Waits for an incoming connection (I assume this is a blocking request)
    request_data = sock_connection.recv(1024).decode("utf-8")        # The maximux size of the request data must be 1MB
    print(request_data)
    # Can I parse the request data to extract information like
    # 1. Request method
    # 2. Host
    # 3. User agent
    # 4. HTTP version
    # 5. Endpoint
    # 6. Data
    sock_connection.send("Hello from server!".encode("utf-8"))
    sock_connection.close()
    break