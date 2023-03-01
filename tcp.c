#include <errno.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <sys/types.h>
#include <unistd.h>
#include <fcntl.h>

#include "tcp.h"

// connect the first ip from result of getaddrinfo()
#define CONNECT_SINGLE_IP

int lookup(char *host, char *portnr, int aifamily, struct addrinfo **res)
{
    struct addrinfo hints;
    memset(&hints, 0, sizeof(struct addrinfo));
    hints.ai_family = aifamily;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_NUMERICSERV;
    hints.ai_protocol = 0;

    return getaddrinfo(host, portnr, &hints, res);
}

int connect_to(struct addrinfo *addr, struct timeval *rtt)
{
    int fd;
    struct timeval start;
    int connect_result;
    const int on = 1;
    /* int flags; */
    int rv = 0;

#ifndef CONNECT_SINGLE_IP
    /* try to connect for each of the entries: */
    while (addr != NULL)
    {
#endif
        /* create socket */
        if ((fd = socket(addr->ai_family, addr->ai_socktype, addr->ai_protocol)) == -1)
        {
#ifndef CONNECT_SINGLE_IP
            goto next_addr0;
#else
            return -errno;
#endif
        }
        if (setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on)) < 0)
        {
#ifndef CONNECT_SINGLE_IP
            goto next_addr1;
#else
            close(fd);
            return -errno;
#endif
        }
        if (gettimeofday(&start, NULL) == -1)
        {
#ifndef CONNECT_SINGLE_IP
            goto next_addr1;
#else
            close(fd);
            return -errno;
#endif
        }

        /* connect to peer */
        if ((connect_result = connect(fd, addr->ai_addr, addr->ai_addrlen)) == 0)
        {
            if (gettimeofday(rtt, NULL) == -1)
            {
#ifndef CONNECT_SINGLE_IP
                goto next_addr1;
#else
                close(fd);
                return -errno;
#endif
            }
            rtt->tv_sec = rtt->tv_sec - start.tv_sec;
            rtt->tv_usec = rtt->tv_usec - start.tv_usec;
            close(fd);
            return 0;
        }
#ifndef CONNECT_SINGLE_IP
next_addr1:
        close(fd);
next_addr0:
        addr = addr->ai_next;
    }
#endif
    rv = rv ? rv : -errno;
    return rv;
}
