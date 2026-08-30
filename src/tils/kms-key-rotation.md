---
title: KMS key rotation is not for re-encrypting data
tags: ["aws", "kms", "cryptography"]
pubDate: 2026-08-30
type: til
---

I always had the wrong belief that KMS key rotation would magically mean
automatic re-encryption of all of the data. Essentially, if a key is leaked, a
key rotation would guarantee that the old key can't be used anymore. Reading
about this proved that I could not be more wrong. Key rotation is mostly a
measure for controlling the amount of data that is encrypted with a single key,
not for protecting against key leaks.

> Key rotation has no effect on the data that the KMS key protects. It does not
> rotate the data keys that the KMS key generated or re-encrypt any data
> protected by the KMS key. Key rotation will not mitigate the effect of a
> compromised data key.

KMS key rotation just means generating new cryptographic material for encryption
and decryption. All previous material is only available for decrypting data.
This makes a lot of sense considering that re-encrypting all data would be an
extremely expensive operation.

There is a risk that after encrypting a big amount of messages with a single
key, the encrypted data can start having subtle patterns. Though, this risk is
very low with KMS keys as they are mostly used to encrypt other keys that
actually encrypt the data. These keys are called "data keys". DynamoDB, for
instance, has an entire hierarchy of keys that are used for encrypting the
table:

```txt
KMS Key -> Table Key -> Data Encryption Key -> Data
```

## References

- [AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html)
- [Rotate AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html)
- [DynamoDB encryption at rest usage notes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/encryption.usagenotes.html)
