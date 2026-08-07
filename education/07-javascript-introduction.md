---
title: "Introduction to JavaScript Development with Bitcoin Cash"
date: "2026-08-07"
order: 7
description: "An orientation for JavaScript developers new to Bitcoin Cash — the Cash Stack, why you should skip testnet and build on mainnet, and the best ways to get your first BCH."
section: "javascript-development"
tags: ["JavaScript", "Bitcoin Cash", "Cash Stack", "minimal-slp-wallet", "developer", "tutorial"]
---

# Introduction to JavaScript Development with Bitcoin Cash

Bitcoin Cash is not just a currency — it's a developer platform. With a little
JavaScript you can read the blockchain, build wallets, send payments, and even
create your own tokens. This lesson is the first in a series that will take you
from "hello world" to building real applications on Bitcoin Cash.

If you're coming from a web development background, most of what you already
know — JavaScript, Node.js, npm, REST APIs — carries straight over. In this
series you'll learn how to apply those skills to a censorship-resistant,
peer-to-peer ledger. Let's get oriented.

![JavaScript and Bitcoin Cash](/block-blog/images/javascript-development/js-dev-01-hero.png)

## The Cash Stack

Before we write code, it helps to understand the pieces you'll be working with.
The **Cash Stack** is the collection of open-source software that makes it easy
to build on Bitcoin Cash. From the bottom up:

- **BCHN** — the reference full node that stores and validates the blockchain.
- **Fulcrum** — a fast indexer that makes querying the blockchain quick.
- **psf-bch-api** — a REST API server that sits in front of the node and
  indexer, giving you simple HTTP endpoints.
- **bch-js** — a low-level JavaScript library that wraps that REST API in
  friendly functions for building custom transactions.
- **minimal-slp-wallet** — a higher-level wallet library that embeds `bch-js`
  and provides simplified functions for common wallet use-cases.

For most applications you'll talk to a JavaScript library, which talks to a
REST API server, which talks to the node and indexer. You rarely need to touch
the node directly.

> **Which library should you use?** This series uses **`minimal-slp-wallet`**
> because it is the best fit for beginners. It has simple, high-level functions
> like `getBalance()`, `send()`, and `listTokens()`, and it can talk to free,
> volunteer-run back ends like `free-bch.fullstack.cash`. If you outgrow it,
> `bch-js` gives you lower-level control for building custom transactions.

## Skip testnet. Build on mainnet.

Here's the single most important piece of advice in this lesson: **do not use
the BCH testnet.** It's tempting — testnets are free, right? On Bitcoin (BTC)
they're practically required because mainnet fees are so high. But on Bitcoin
Cash, testnet is a trap, and it will waste your time. Here's why:

1. **Testnet coins are hard to get.** Faucets are frequently empty or
   unreliable. You'll spend more energy hunting for free test coins than writing
   your application.

2. **The testnet chain is enormous.** It's much bigger than the mainnet chain.
   If you try to sync a full node, it takes far longer and uses far more disk
   space.

3. **The rules are different.** Testnet allows things that mainnet does not. If
   you build and test on testnet, you'll make assumptions that silently break
   the moment you move to mainnet. I've watched developers go months down a
   path, only to discover all their work was built on a testnet-only assumption.

4. **Miners disrupt it.** When a large industrial miner brings infrastructure
   online, they often mine empty blocks on testnet for days or weeks first —
   completely breaking a developer's ability to work with the chain.

So what do you do instead? **Just use mainnet.** Because BCH transaction fees
are measured in fractions of a cent, you can build and test against the *real*
network for pennies. If your software works on mainnet, it works in production.
That's the beauty of Bitcoin Cash — you get the real thing for next to nothing.

## Getting your first BCH

To develop against mainnet you'll want a little bit of Bitcoin Cash in a wallet
you control. You don't need much — even a few cents is enough to pay the tiny
transaction fees while you learn. Here are three of the most common ways to get
your first BCH.

![Ways to buy BCH](/block-blog/images/javascript-development/js-dev-01-buy.png)

### PayPal

If you live in a supported region, the **PayPal** app lets you buy, hold, and
transfer a handful of cryptocurrencies — including Bitcoin Cash. You can fund
your purchase with your PayPal balance, linked bank account, or card.

The key step for a developer is to **move your BCH off PayPal** into your own
wallet where you control the private keys. PayPal is a custodian: they hold the
keys, not you. In the PayPal app:

1. Buy BCH in the crypto section.
2. Select the BCH you hold and choose to **Send** or **Transfer** it out.
3. Paste the Bitcoin Cash address from your own wallet (more on this in the next
   lesson) and confirm the transfer.

PayPal is convenient and beginner-friendly, but it's the most centralized option
on this list.

### THORChain

**THORChain** is a decentralized cross-chain swap protocol. It lets you swap
between assets like BTC, ETH, and BCH *without* creating an account or passing
KYC. You use a permissionless front end like
[https://swap.thorchain.org/](https://swap.thorchain.org/) and swap whatever you
already hold directly for BCH.

This is the most permissionless option: there's no account, no identity check,
and no one can freeze your coins. It's a great choice if you want to embody the
"be your own bank" ethos from the very first coin you own. Because THORChain
handles native cross-chain swaps, you don't need bridges or wrapped tokens —
you get real, on-chain BCH.

### Coinbase

**Coinbase** is one of the largest centralized exchanges and it fully supports
Bitcoin Cash. You can buy BCH with fiat (bank transfer or card), and then
withdraw it to your own wallet.

As with PayPal, the important habit is to **withdraw to self-custody** rather
than leaving your coins on the exchange. On Coinbase:

1. Buy BCH.
2. Go to your BCH balance and choose **Send / Withdraw**.
3. Enter your own Bitcoin Cash address and the amount, then confirm.

Exchanges are regulated and convenient, but they're custodial — which runs
against the whole point of a permissionless cryptocurrency.

### Whatever you choose, take self-custody

All three of these routes converge on the same habit: once you own BCH, move it
into a wallet where **you** hold the private keys. Exchanges and apps are just
on-ramps. The whole point of Bitcoin Cash is that the *only* thing that matters
is who holds the keys. We'll build exactly that kind of wallet in the next two
lessons.

## What's next

Now that you're oriented, it's time to write some code. In the next lessons
we'll use `minimal-slp-wallet` to:

- Generate a wallet with its own key pair and address
- Read a balance, and receive BCH
- Send BCH between wallets

The full set of working examples is available in the
[psf-js-examples repository](https://github.com/Permissionless-Software-Foundation/psf-js-examples),
and the `minimal-slp-wallet` docs are on
[npm](https://www.npmjs.com/package/minimal-slp-wallet). Let's build.
