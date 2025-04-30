#!/usr/bin/env python3
import sys
import socket
import signal
from contextlib import contextmanager
from http_parser import parse_http_request
from client_response import construct_client_response

BUFFER_SIZE = 1024
HOST = "127.0.0.1"
PORT = 8081


@contextmanager
def create_socket_server(host, port):
    socket_obj = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        socket_obj.bind((host, port))
        yield socket_obj
    finally:
        socket_obj.close()


def handle_client_connection(client_socket, client_address):
    active_connections = 0
    try:
        print(f"New connection from: {client_address}")
        active_connections += 1
        print(f"Active connections: {active_connections}")
        request_data = b""
        while True:
            chunk = client_socket.recv(BUFFER_SIZE)
            request_data += chunk
            if len(chunk) < BUFFER_SIZE:
                break
        
        if request_data:
            request_obj = parse_http_request(request_data.decode("utf-8"))
            response = construct_client_response()
            client_socket.send(response)
            # Adding a small delay to simulate processing
            time.sleep(0.1)
    except Exception as e:
        print(f"Error handling client request: {e}")
    finally:
        print(f"Connection closed from: {client_address}")
        active_connections -= 1
        client_socket.close()


def main():
    def signal_handler(sig, frame):
        print("\nShutting down server...")
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)

    with create_socket_server(HOST, PORT) as server_socket:
        server_socket.listen(5)
        print(f"Server listening on {HOST}:{PORT}")

        while True:
            try:
                client_socket, address = server_socket.accept()
                print(f"Connection from address: {address}")
                handle_client_connection(client_socket, address)
            except Exception as e:
                print(f"Error accepting connection: {e}")


if __name__ == "__main__":
    main()

# Create a socket object (I need to explore other configs later)
# socket_obj = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Bind the socket object to an address and a port
# socket_obj.bind(('0.0.0.0', 8081))
# print(f"server is listening on port: 8081")

# Listen to incoming connections
# socket_obj.listen(1)

# Infinite loop that waits for an incoming connection request
# while True:
#     try:
#         sock_connection, address_info = socket_obj.accept()              # Waits for an incoming connection (I assume this is a blocking request)
#         request_data = sock_connection.recv(1024).decode("utf-8")        # The maximux size of the request data must be 1MB
#         request_obj = parse_http_request(request_data)                   # Parse the http request
#         response = construct_client_response()
#         sock_connection.send(response)
#         sock_connection.close()
#     except Exception as e:
#         print(f"Error: {e}")