#include <stdio.h>
#include <errno.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include <sys/time.h>

#include "tcp.h"

#define abs(x) ((x) < 0 ? -(x) : (x))

static volatile int stop = 0;

void usage(void)
{
    fprintf(stderr, "tcping, (C) 2003 folkert@vanheusden.com\n\n");
    fprintf(stderr, "hostname		hostname (e.g. localhost)\n");
    fprintf(stderr, "-p portnr		portnumber (e.g. 80)\n");
    fprintf(stderr, "-c count		how many times to connect\n");
    fprintf(stderr, "-i interval		delay between each connect\n");
    fprintf(stderr, "-v ip version		4: ipv4, 6: ipv6 (default ipv4)\n");
    fprintf(stderr, "-t timeout(sec)		timeout (sec) for server response\n");
    fprintf(stderr, "-u timeout(usec)	timeout (usec) for server response\n");
    fprintf(stderr, "-f			flood connect (no delays)\n");
    fprintf(stderr, "-q			quiet, only returncode\n\n");
}

void handler(int sig)
{
    stop = 1;
}

int main(int argc, char *argv[])
{
    char *hostname = NULL;
    char *portnr = "7";
    char *cptr;
    int c;
    int count = -1, curncount = 0;
    int wait = 1, quiet = 0;
    int ok = 0, err = 0;
    double min = 999999999999999.0, avg = 0.0, max = 0.0;
    long timeout_sec = 0, timeout_usec = 0;
    struct addrinfo *resolved;
    struct timeval timeout;
    int errcode;
    int seen_addrnotavail;
    int aifamily = AF_INET;

    while((c = getopt(argc, argv, "h:p:c:i:v:t:u:fq?")) != -1)
    {
        switch(c)
        {
            case 'p':
                portnr = optarg;
                break;

            case 'c':
                count = atoi(optarg);
                break;

            case 'i':
                wait = atoi(optarg);
                break;

            case 'v':
                if(!strcmp(optarg, "6") )
                    aifamily = AF_INET6;
                else if(!strcmp(optarg, "4"))
                    aifamily = AF_INET;
                break;
            case 't':
                cptr = NULL;
                timeout_sec = strtol(optarg, &cptr, 10);
                if (cptr == optarg)
                    usage();
                 break;
            case 'u':
                cptr = NULL;
                timeout_usec = strtol(optarg, &cptr, 10);
                if (cptr == optarg)
                    usage();
                 break;
            case 'f':
                wait = 0;
                break;

            case 'q':
                quiet = 1;
                break;

            case '?':
            default:
                usage();
                return 0;
        }
    }

    if (optind >= argc)
    {
        fprintf(stderr, "No hostname given\n");
        usage();
        return 3;
    }
    hostname = argv[optind];

    timeout.tv_sec=timeout_sec + timeout_usec / 1000000;
    timeout.tv_usec=timeout_usec % 1000000;

    signal(SIGINT, handler);
    signal(SIGTERM, handler);

    if ((errcode = lookup(hostname, portnr, aifamily, &resolved)) != 0)
    {
        fprintf(stderr, "%s\n", gai_strerror(errcode));
        return 2;
    }

    if (!quiet)
        printf("PING %s:%s\n", hostname, portnr);

    while((curncount < count || count == -1) && stop == 0)
    {
        double ms;
        struct timeval rtt;

        if ((errcode = connect_to(resolved, &rtt, &timeout)) != 0)
        {
            if (errcode != -EADDRNOTAVAIL)
            {
                printf("error connecting to host (%d): %s\n", -errcode, strerror(-errcode));
                err++;
            }
            else
            {
                if (seen_addrnotavail)
                {
                    printf(".");
                    fflush(stdout);
                }
                else
                {
                    printf("error connecting to host (%d): %s\n", -errcode, strerror(-errcode));
                }
                seen_addrnotavail = 1;
            }
        }
        else
        {
            seen_addrnotavail = 0;
            ok++;

            ms = ((double)rtt.tv_sec * 1000.0) + ((double)rtt.tv_usec / 1000.0);
            avg += ms;
            min = min > ms ? ms : min;
            max = max < ms ? ms : max;

            printf("response from %s:%s, seq=%d time=%.2f ms\n", hostname, portnr, curncount, ms);
            // if (ms > 500) break; /* Stop the test on the first long connect() */
        }

        curncount++;

        if (curncount != count)
            sleep(wait);
    }

    if (!quiet)
    {
        printf("--- %s:%s ping statistics ---\n", hostname, portnr);
        printf("%d responses, %d ok, %3.2f%% failed\n", curncount, ok, (((double)err) / abs(((double)curncount)) * 100.0));
        printf("round-trip min/avg/max = %.1f/%.1f/%.1f ms\n", min, avg / (double)ok, max);
    }

    freeaddrinfo(resolved);
    if (ok)
        return 0;
    else
        return 127;
}
