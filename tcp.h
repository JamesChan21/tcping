#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <sys/time.h>

#ifndef TCP_H_DEFINED
#define TCP_H_DEFINED
// aifamily: AF_INET/AF_INET6
int lookup(char *host, char *portnr, int aifamily, struct addrinfo **res);
int connect_to(struct addrinfo *addr, struct timeval *rtt, struct timeval *timeout);
#endif /* TCP_H_DEFINED */
