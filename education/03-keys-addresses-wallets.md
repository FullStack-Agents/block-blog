---
title: "Keys, Addresses, and Wallets"
date: "2026-08-06"
order: 3
description: "How ownership of Bitcoin Cash works — the private and public keys that control funds, the addresses you share to receive payments, and the wallets that keep it all safe."
section: "mastering-bitcoin-cash"
source: "mastering-bitcoin-cash"
video: "https://youtu.be/Q83x4EUKaxg"
tags: ["Bitcoin Cash", "keys", "addresses", "wallets", "security"]
---

# Keys, Addresses, and Wallets

Ownership of Bitcoin Cash is established through three things: **digital keys**, **Bitcoin Cash addresses**, and **digital signatures**. The keys are not stored on the network — they are created and kept by you, in a file or simple database called a **wallet**. Your keys are completely independent of the Bitcoin Cash protocol: they can be generated and managed by your wallet software without any connection to the blockchain or the internet.

Every Bitcoin Cash transaction requires a valid **signature** to be included in the blockchain, and that signature can only be produced with a valid private key. So anyone with a copy of your private keys has control of the Bitcoin Cash secured by them. This is the root of the phrase you'll hear everywhere in crypto: **not your keys, not your coins.**

## Keys come in pairs

Keys come in pairs: a **private key** (secret) and a **public key** (shareable). Think of the public key like a bank account number, and the private key like the secret PIN or the signature on a check that actually controls the account.

- The **public key** is used to receive Bitcoin Cash.
- The **private key** is used to sign transactions to spend it.

There is a mathematical relationship between the two that lets the private key create signatures which can be verified against the public key — without ever revealing the private key. When you spend Bitcoin Cash, you present your public key and a signature in a transaction. Everyone on the network can verify that signature and accept the transaction as valid, confirming that you owned the funds at the time of the transfer.

> **In most wallets**, the private and public keys are stored together as a *key pair* for convenience. But the public key can always be calculated from the private key, so storing only the private key is also possible.

## Private keys

A private key is simply a number, picked at random. Ownership and control over that number is the root of control over all the funds associated with its address. The private key must **remain secret at all times** — revealing it to anyone is equivalent to giving them control of your Bitcoin Cash. It must also be **backed up and protected from loss**, because if it's lost, it cannot be recovered, and the funds secured by it are gone forever.

Bitcoin Cash uses **elliptic-curve cryptography (ECC)**, specifically a curve called **secp256k1**. The private key is a random 256-bit number, and the public key is derived from it by a one-way mathematical operation:

```
K = k × G
```

where `k` is the private key, `G` is a fixed constant called the *generator point*, and `K` is the resulting public key. This operation is easy to do in one direction but practically impossible to reverse — you can't work out the private key from the public key. That's why you can share your public key (and the address derived from it) with anyone without giving away your private key.

> **A private key can be converted into a public key, but a public key cannot be converted back into a private key** — the math only works one way.

### Public key formats

Because the elliptic curve is symmetrical across the x-axis, public keys can be stored in two ways:

- **Uncompressed** — the full point, with both the x and y coordinates (65 bytes).
- **Compressed** — just the x coordinate plus a small marker for the sign of y (33 bytes). This saves space in every transaction.

Compressed public keys are now the default across Bitcoin Cash wallets, which meaningfully reduces the size of transactions and the blockchain.

## Addresses

A **Bitcoin Cash address** is a string of characters you share with anyone who wants to send you money. It's the only representation of your keys you'll routinely see, because it's the part you need to share with the world.

The address is derived from the public key using a one-way cryptographic hash — specifically **SHA-256** followed by **RIPEMD-160**:

```
A = RIPEMD160( SHA256( K ) )
```

![Private key, public key, and Bitcoin Cash address](/block-blog/images/mastering-bitcoin-cash/msbt_0401.png)

> **A Bitcoin Cash address is *not* the same as a public key.** Addresses are derived from a public key using a one-way function.

### CashAddr — the modern format

Today, Bitcoin Cash uses the **CashAddr** format, which was created specifically to avoid confusion with legacy Bitcoin (BTC) addresses. CashAddr addresses:

- Start with **`q`** for pay-to-public-key-hash (P2PKH) addresses — the common type for receiving payments.
- Start with **`p`** for pay-to-script-hash (P2SH) addresses.
- May optionally include a **`bitcoincash:`** prefix, e.g. `bitcoincash:q...`.

CashAddr is designed to be easy to share and copy (including via QR codes), and it includes a built-in checksum that detects errors — so a mistyped address is almost always caught before funds are sent to the wrong place.

### Legacy addresses

Older Bitcoin Cash addresses used a format called **Base58Check**. These are still valid and supported, but they're referred to as *legacy* addresses:

- **P2PKH** addresses start with a **`1`**.
- **P2SH** addresses start with a **`3`**.

![Public key to Bitcoin Cash address: conversion](/block-blog/images/mastering-bitcoin-cash/msbt_0405.png)

The important thing to remember: **always use the modern CashAddr format** (`q...` or `p...`) when sharing an address. It's the standard across today's wallets and avoids any confusion with Bitcoin (BTC) addresses.

## Wallets

A **wallet** is a container for your private keys — usually a structured file or simple database. It's important to understand that **a wallet contains keys, not coins**. The coins live on the blockchain as unspent transaction outputs (UTXOs); your wallet holds the keys that let you spend them.

Wallets come in a few different types, which differ in how they generate and manage keys.

### Nondeterministic (random) wallets

The earliest wallets were simply collections of randomly generated private keys — nicknamed "Just a Bunch Of Keys," or **JBOK**. Each key is independent and must be backed up individually. This makes them cumbersome to manage, back up, and import, so they've largely been replaced.

![Type-0 nondeterministic (random) wallet: a collection of randomly generated keys](/block-blog/images/mastering-bitcoin-cash/msbt_0408.png)

### Deterministic (seeded) wallets

**Deterministic** wallets solve the backup problem. All the private keys are derived from a single random number called a **seed**, using a one-way hash function. Because the seed is enough to re-create every key, a single backup at creation time is sufficient — and you can easily export or import the whole wallet by moving just the seed.

### Mnemonic code words

To make the seed easy to back up, most wallets present it as a sequence of **12 to 24 English words** — your **seed phrase** or *recovery phrase*. This is defined by a standard called **BIP-39** and is supported across the entire industry.

When you first create a wallet, it shows you this word sequence. **That sequence is your wallet backup.** Write it down and store it somewhere safe and offline. Anyone who has those words can re-create your wallet and take your funds, so never share them and never store them digitally in plain sight.

### Hierarchical Deterministic (HD) wallets

The most advanced form is the **hierarchical deterministic wallet**, or **HD wallet**, defined by the **BIP-32** standard. HD wallets organize keys in a **tree structure**: a parent key can derive a sequence of child keys, each of which can derive its own children, and so on to any depth.

![Type-2 hierarchical deterministic wallet: a tree of keys generated from a single seed](/block-blog/images/mastering-bitcoin-cash/msbt_0409.png)

HD wallets offer two big advantages:

1. **Organization** — different branches of the tree can be used for different purposes, such as one branch for receiving payments and another for change, or separate branches for different accounts or departments.
2. **Public-key-only operation** — you can derive public keys (and addresses) from an extended public key *without* the private keys. This lets a server or e-commerce site generate a fresh address for every transaction while holding no private keys at all — so there's nothing to steal.

![Creating master keys and chain code from a root seed](/block-blog/images/mastering-bitcoin-cash/msbt_0410.png)

Most modern Bitcoin Cash wallets are HD wallets following the **BIP-32** and **BIP-44** standards, backed up with a **BIP-39** mnemonic seed phrase. If you're choosing a wallet, look for one that uses these standards.

## Advanced keys and addresses

### Multi-signature (multisig)

A **multi-signature** address requires more than one signature to spend funds. In an **M-of-N** scheme, N public keys are recorded, and at least M of them must sign to unlock the funds. For example:

- A **2-of-3** setup with a buyer, seller, and arbitrator is a common **escrow** arrangement.
- A business might require **2-of-3** signatures from its executives so no single person can move company funds.

Multisig eliminates single points of failure and is a powerful security tool. On Bitcoin Cash, multisig is usually implemented through **pay-to-script-hash (P2SH)** addresses, which start with `p` in CashAddr format.

### Cold storage and paper wallets

**Cold storage** means keeping your private keys completely offline, protecting them from hackers, malware, and key-loggers. The most common methods are:

- **Paper wallets** — your private key (and often the address) printed on paper and stored in a safe.
- **Hardware wallets** — dedicated devices that keep keys in a secure element and sign transactions internally, never exposing the key to your computer or phone.

![An example of a simple paper wallet](/block-blog/images/mastering-bitcoin-cash/msbt_04_paper_wallet.png)

You can generate your own paper wallets with these free tools:

- [Bitcoin.com Paper Wallet](https://paperwallet.bitcoin.com/)
- [PSF Paper Wallet](https://paperwallet.psfoundation.info/)

Cold storage maximizes security but makes spending less convenient — you typically move funds to a "hot" wallet (like a mobile wallet) when you want to spend. A common strategy is to keep most of your savings in cold storage and only a small spending amount in a hot wallet.

## Wrap up

Ownership of Bitcoin Cash comes down to a few simple ideas:

1. **Keys** — a private key (secret) and a public key (shareable), derived from each other by one-way elliptic-curve math.
2. **Addresses** — the shareable strings (CashAddr, `q...`/`p...`) derived from your public key that people use to send you money.
3. **Wallets** — the software that holds your keys, ideally an HD wallet backed up with a 12–24 word seed phrase.

The golden rules: **never share your private keys or seed phrase**, **back them up offline**, and **use a fresh address for each payment** to protect your privacy. Get these basics right and you're well on your way to safely using Bitcoin Cash.

Ready for the next lesson? Head back to [BCH Education](#/education) to continue.
