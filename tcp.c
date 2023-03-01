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

/* print debug info */
// #define DEBUG
/* connect the first ip from result of getaddrinfo() */
// #define SINGLE_IP

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

int connect_to(struct addrinfo *addr, struct timeval *rtt, struct timeval *timeout)
{
    int fd;
    struct timeval start;
    int ret;
    const int on = 1;
    char *ipver;
    char ipstr[INET6_ADDRSTRLEN];
    void *sin_addr;
    struct timeval timeout_tmp;
    fd_set fdrset, fdwset;
    socklen_t errlen;

    /* int flags; */
    int rv = 0;
    int error = 0;

#ifndef SINGLE_IP
    static int test_count = 0;
#endif

#ifndef SINGLE_IP
    /* try to connect for each of the entries: */
    while (addr != NULL)
    {
#endif
#ifdef DEBUG
        // different fields in IPv4 and IPv6:
        if (addr->ai_family == AF_INET) { // IPv4
            struct sockaddr_in *ipv4 = (struct sockaddr_in *)addr->ai_addr;
            sin_addr = &(ipv4->sin_addr);
            ipver = "IPv4";
        } else { // IPv6
            struct sockaddr_in6 *ipv6 = (struct sockaddr_in6 *)addr->ai_addr;
            sin_addr = &(ipv6->sin6_addr);
            ipver = "IPv6";
        }

        // convert the IP to a string and print it:
        inet_ntop(addr->ai_family, sin_addr, ipstr, sizeof ipstr);
        printf("%s: %s\n", ipver, ipstr);
#endif
        /* create socket */
        if ((fd = socket(addr->ai_family, addr->ai_socktype, addr->ai_protocol)) == -1)
        {
#ifndef SINGLE_IP
            goto next_addr0;
#else
            return -errno;
#endif
        }

        /* set nonbloack*/
        fcntl(fd, F_SETFL, O_NONBLOCK);
#ifndef SINGLE_IP
        if (setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on)) < 0)
        {
            goto next_addr1;
        }
#endif
        if (gettimeofday(&start, NULL) == -1)
        {
#ifndef SINGLE_IP
            goto next_addr1;
#else
            close(fd);
            return -errno;
#endif
        }

        /* connect to peer */
        if ((ret = connect(fd, addr->ai_addr, addr->ai_addrlen)) != 0) 
        {
#ifndef SINGLE_IP
            /* simulate ip1 connect fail */
            if (++test_count > 3)
            {
                test_count = 0;
                goto next_addr1;
            }
#endif

            if (errno != EINPROGRESS) 
            {
#ifdef DEBUG
                fprintf(stderr, "connect error: %s\n", strerror(errno));
#endif
                return -errno;
            }

            FD_ZERO(&fdrset);
            FD_SET(fd, &fdrset);
            fdwset = fdrset;

            memcpy(&timeout_tmp, timeout, sizeof(struct timeval));
            if ((ret = select(fd+1, &fdrset, &fdwset, NULL, (timeout_tmp.tv_sec + timeout_tmp.tv_usec) > 0 ? &timeout_tmp : NULL)) == 0) 
            {
#ifdef DEBUG
                fprintf(stdout, "tcping timeout.\n");
#endif
#ifndef SINGLE_IP
                goto next_addr1;
#else
                /* timeout */
                close(fd);
                return -ETIMEDOUT;
#endif
            }
            if (FD_ISSET(fd, &fdrset) || FD_ISSET(fd, &fdwset)) 
            {
                errlen = sizeof(error);
                if ((ret=getsockopt(fd, SOL_SOCKET, SO_ERROR, &error, &errlen)) != 0) 
                {
                    /* getsockopt error */
#ifdef DEBUG
                    fprintf(stderr, "getsockopt err, %s\n", strerror(errno));
#endif
#ifndef SINGLE_IP
                goto next_addr1;
#else
                    close(fd);
                    return -errno;
#endif
                }
                if (error != 0) 
                {
#ifdef DEBUG
                    fprintf(stdout, "connection closed.\n");
#endif
#ifndef SINGLE_IP
                goto next_addr1;
#else
                    close(fd);
                    return -errno;
#endif
                }
            }
            else 
            {
#ifdef DEBUG
                fprintf(stderr, "error: select: fd not set\n");
#endif
#ifndef SINGLE_IP
                goto next_addr1;
#else
                return -errno;
#endif
            }
        }

        /* OK, connection established */
        if (gettimeofday(rtt, NULL) == -1)
        {
#ifndef SINGLE_IP
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
#ifndef SINGLE_IP
next_addr1:
        close(fd);
next_addr0:
        addr = addr->ai_next;
    }
#endif
    rv = rv ? rv : -errno;
    return rv;
}
