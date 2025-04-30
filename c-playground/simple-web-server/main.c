#include <stdio.h>
#include <sys/socket.h>

int main() {
    int sock_descriptor = socket(PF_INET, SOCK_STREAM, 0); // create a socket
    if (sock_descriptor == -1) {
        perror("Socket creation failed");
        return 1;
    }

    // configure the server address
    return 0;
}