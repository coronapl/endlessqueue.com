---
title: Domains don't need to be reachable to get a TLS certificate
tags: ["networking", "caddy"]
pubDate: 2026-09-05
type: til
---

My understanding was that having port 80 open was necessary to get a Let's
Encrypt TLS certificate. This is only true when using the `HTTP-01` challenge.
Let's Encrypt by default shares with the ACME client a token. To verify the
domain ownership, Let's Encrypt makes a request to
`http://<YOUR_DOMAIN>/.well-known/acme-challenge/<TOKEN>`. This option is
unfeasible if the domain is not reachable from the public internet. In fact,
recently I learned that your domain can point to a private IP address or to a
[shared address space like Tailnet IPs](/tils/tailnet-ips-not-private).

The solution for unreachable domains is using the `DNS-01` challenge. The ACME
client initiates the request to get a TLS certificate and receives a token from
the ACME server. Then, the server expects a TXT record
`_acme-challenge.<YOUR_DOMAIN>` where the value is derived from the shared token
and an account key linked to the ACME client. Once the DNS record is verified by
the server, the certificate is issued.

Caddy has support for several modules that handle the manipulation of DNS
records and enable getting certificates and renewing them using the `DNS-01`
challenge. The plugins are specific to the DNS provider. In my case, I used the
plugin to integrate with Cloudflare DNS. For that, it is necessary to build a
new Caddy binary with the module. Since I was using Docker already, I used the
`:builder` image shortcut:

```txt
FROM caddy:2.11.4-builder AS builder

RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    xcaddy build \
    --with github.com/caddy-dns/cloudflare

FROM caddy:2.11.4

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
```

Finally, in my Caddyfile I used the TLS directive:

```txt
myapp.mydomain.com {
  tls {
      dns cloudflare {env.CLOUDFLARE_API_TOKEN}
  }
  reverse_proxy myapp:8000
}
```

To my surprise, this process was almost instant for me. I could see the DNS
record only for a few seconds before it was deleted by the Caddy module. Though,
I can imagine that this can vary depending on the DNS propagation.

## References

- [Challenge Types](https://letsencrypt.org/docs/challenge-types/)
- [How to use DNS provider modules in Caddy 2](https://caddy.community/t/how-to-use-dns-provider-modules-in-caddy-2/8148)
- [Automatic HTTPS](https://caddyserver.com/docs/automatic-https)
- [Build from source](https://caddyserver.com/docs/build)
