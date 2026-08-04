---
title: "What Is Bitcoin Cash?"
date: "2026-08-04"
order: 1
description: "An introduction to Bitcoin Cash — a peer-to-peer electronic cash system designed for everyday payments, its history, how it works, and how to get started."
source: "mastering-bitcoin-cash"
video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
tags: ["Bitcoin Cash", "basics", "intro", "history", "mining"]
---

# What Is Bitcoin Cash?

Bitcoin Cash (BCH) is a decentralized, peer-to-peer electronic cash system. Units of currency, called **bitcoins**, are used to store and transmit value among participants on the network. BCH is designed to be fast, secure, and borderless — a reliable medium of exchange for everyday payments, not just large transfers.

Because Bitcoin Cash is a public standard, it can be used in many ways: to buy and sell goods, send money to people or organizations, or extend credit. It can be exchanged for traditional currencies at exchanges. The protocol stack is open source and runs on everything from laptops to smartphones, making the technology easy to access.

Unlike traditional currencies, bitcoins are entirely virtual. There are no physical coins. Ownership is proven through cryptographic keys, which are typically stored in a digital wallet. Possession of the key that unlocks a transaction is the only requirement to spend bitcoin, putting control entirely in the hands of each user.

## A quick history

The underlying invention dates to **2008**, when a paper titled ["Bitcoin: A Peer-to-Peer Electronic Cash System"](https://bitcoin.com/bitcoin.pdf) was published under the pseudonym **Satoshi Nakamoto**. The bitcoin network launched in **2009**.

**Bitcoin Cash itself was created in August 2017** as a hard fork of the original Bitcoin network. The goal was to restore Bitcoin's original vision of on-chain, peer-to-peer electronic cash by raising the block size limit, allowing more transactions per block and keeping fees low even during periods of high usage. This split created two networks that share the same history up to the fork block, after which Bitcoin Cash continues on its own path.

> **Why does history matter?** Understanding that Bitcoin Cash is a *continuation* of the original Bitcoin design helps explain its focus on usability, low fees, and everyday payments rather than store-of-value alone.

## How Bitcoin Cash works

Bitcoin Cash is a **distributed, peer-to-peer system**. There is no central server or point of control. Several core mechanisms work together to make this possible:

### Mining and proof-of-work

New bitcoins are created through **mining**, which involves competing to solve a mathematical problem while processing transactions. Miners verify transactions and bundle them into **blocks**, which are added to the public ledger (the **blockchain**).

Mining uses a **proof-of-work** algorithm: a block header is hashed repeatedly until the result falls below a target value. Because the hash function (SHA-256) is computationally expensive to invert, this acts as a "quasi-random election" that decides which transactions enter a block and who claims the block reward. The probability of mining a block is proportional to the miner's hashing power, which today comes from specialized hardware called **ASICs**.

### Difficulty adjustment

The network regulates the mining difficulty so that, on average, a new block is produced about every **10 minutes** — regardless of how much computing power is online. Bitcoin Cash uses a difficulty adjustment algorithm (**ASERT**) that responds quickly to changes in total hashing power, keeping block times steady and the network usable.

### Monetary policy

Bitcoin Cash has a fixed, predictable monetary policy:

- The rate at which new bitcoins are created is **halved every four years**.
- The total supply is **capped at 21 million coins**, projected to be reached around the year **2140**.

Because issuance is capped and predictable, Bitcoin Cash cannot be inflated by "printing" money beyond the expected issuance rate.

## The problem it solves

### Digital money and the double-spend problem

Accepting digital money raises two basic questions:

1. **Can I trust it is authentic and not counterfeit?**
2. **Can I be sure no one else can claim the same money belongs to them?** — the "double-spend" problem.

Physical money handles double-spending easily because the same note cannot be in two places at once. Early digital currencies tried to solve these problems by clearing all transactions through **central authorities**. But central systems are easy to attack or shut down by governments and hackers, and many early digital currencies were litigated out of existence or collapsed.

### A decentralized solution

The breakthrough of the Bitcoin design is that it solves these problems **without a central authority**. Proof-of-work lets the decentralized network arrive at *consensus* about the state of transactions, preventing double-spending without a clearinghouse.

This is also a practical solution to a classic problem in distributed computing, the **Byzantine Generals' Problem** — how to agree on a course of action over an unreliable and potentially compromised network. The proof-of-work approach achieves consensus without a central trusted authority, and it has applications beyond currency, including elections, lotteries, asset registries, and digital notarization.

## What Bitcoin Cash is used for

Bitcoin Cash is a technology, but it expresses money — a language for exchanging value between people. Common uses include:

- **Everyday retail** — buying coffee, groceries, or other low-value goods.
- **High-value purchases** — art, luxury goods, and expensive assets.
- **International payments** — paying contractors or suppliers across borders without slow, expensive wire transfers.
- **Charitable donations** — global fundraising with a transparent public ledger.
- **Business-to-business trade** — faster import/export payments.
- **Mining** — an income stream for individuals and businesses that also secures the network.

## Getting started

### Wallets

To use Bitcoin Cash, all you need is a wallet. Wallets come in several forms:

- **Full clients (full nodes)** store the entire transaction history, manage your wallet, and connect directly to the network. They offer the most control and independence but put the burden of backups and security on you.
- **Lightweight clients** store your wallet but rely on third-party servers for access to the network. They are easier to use but introduce some counterparty trust.
- **Web clients** store your wallet on a server owned by a third party. They are the easiest to set up but carry the most counterparty risk — if the service is compromised, funds can be lost.

![Bitcoin.com's wallets](/block-blog/images/mastering-bitcoin-cash/msbt_01_wallets.png)

The choice of wallet depends on how much control you want. The general rule is simple: **not your keys, not your coins.**

### Addresses

To receive Bitcoin Cash, you share a **Bitcoin Cash address**. These use the modern **CashAddr** format:

- They start with `q` (pay-to-public-key-hash) or `p` (pay-to-script-hash), optionally with a `bitcoincash:` prefix.
- They are designed to be easy to share and copy, and to avoid confusion with legacy Bitcoin (BTC) addresses.
- Like an email address, you can share it and anyone can send money to it — and there is practically no limit to how many addresses you can create.

![Alice's new Bitcoin Cash address, in the Receive tab](/block-blog/images/mastering-bitcoin-cash/msbt_01_receive.png)

> **Security tip:** Bitcoin Cash is money that can be moved instantly anywhere in the world. Use a strong, unique password or passphrase to protect your wallet — ideally a long, randomly generated one — and never share your private keys or seed phrase with anyone.

### Acquiring your first Bitcoin Cash

There are several ways for a new user to get Bitcoin Cash:

- **Free faucets** — services that give away small amounts of BCH to new users.
- **Exchanges** — buy BCH with fiat currency on platforms like Coinbase.
- **Peer-to-peer** — buy directly from a friend who already owns BCH.
- **Local marketplaces** — find a seller in your area for an in-person cash trade (e.g., localbitcoincash.org).
- **Accepting payment** — sell a product or service for BCH.
- **Bitcoin Cash ATMs** — purchase BCH with cash at a physical kiosk.

![A Bitcoin Cash faucet](/block-blog/images/mastering-bitcoin-cash/msbt_01_faucet_1.png)

### Sending and receiving

Sending Bitcoin Cash is as simple as scanning a QR code or pasting an address. When you send a payment, your wallet constructs a transaction that assigns value to the recipient's address, signs it with your private key, and broadcasts it to the peer-to-peer network. In less than a second, well-connected nodes across the network receive the transaction.

![Confirming a purchase](/block-blog/images/mastering-bitcoin-cash/msbt_01_bought.png)

### Confirmations

At first, a transaction shows as **unconfirmed**. That means it has been propagated to the network but has not yet been included in a block. To be confirmed, it must be "picked up" by a miner and included in a block. Once a new block is created — on average within about 10 minutes — the transactions within it are considered confirmed and can be spent.

The ledger is **public**, so anyone can look up an address and see its balance and transaction history using a **blockchain explorer**.

## Wrap up

Bitcoin Cash combines several key innovations into one system:

- A **decentralized peer-to-peer network** (the protocol)
- A **public transaction ledger** (the blockchain)
- A **decentralized, deterministic currency issuance** (distributed mining)
- A **decentralized transaction verification system** (transaction scripts)

It represents the culmination of decades of research in cryptography and distributed systems — and it is, above all, money you can actually use. Now that you understand what Bitcoin Cash is, you're ready for the next lesson: setting up a wallet and taking custody of your own keys.

Ready for the next lesson? Head back to [BCH Education](/education) to continue.
