---
title: Tailnet IPs are not private addresses
tags: ["networking", "tailscale"]
pubDate: 2026-08-31
type: til
---

Turns out that nothing is stopping you from creating an A DNS record that points
to a private IP address or, essentially, to any IP address. Adding a custom
domain to a Tailscale machine is as simple as creating an A record that points
to the IPv4 address of the machine in the tailnet. The dig command can be used
to verify this:

```txt
$ dig mydomain.com
...
;; QUESTION SECTION:
;mydomain.com.                   IN      A

;; ANSWER SECTION:
mydomain.com.            300     IN      A       100.x.x.x
```

Another learning is that tailnet addresses are actually not private addresses.
They just use a range of IP addresses (100.64.0.0/10) that are not routable from
the public internet and, therefore, they behave similar to private addresses.
This address space is commonly used by ISPs for Carrier-Grade NAT (CGN) to avoid
using up more limited IPv4 addresses.

## References

- [What are these 100.x.y.z addresses?](https://tailscale.com/docs/concepts/tailscale-ip-addresses)
- [RFC6598](https://www.rfc-editor.org/rfc/rfc6598.html)
