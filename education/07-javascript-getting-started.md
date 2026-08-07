---
title: "Getting Started with JavaScript and Bitcoin Cash"
date: "2026-08-07"
order: 7
description: "Your first steps building with Bitcoin Cash in JavaScript — the Cash Stack, the bch-js library, setting up a project, and reading a balance from the blockchain."
section: "javascript-development"
tags: ["JavaScript", "bch-js", "Cash Stack", "developer", "tutorial"]
---

# Getting Started with JavaScript and Bitcoin Cash

Bitcoin Cash is not just a currency — it's a developer platform. With a little
JavaScript you can read the blockchain, build wallets, send payments, and
create tokens. This lesson is the first in a series that will take you from
"hello world" to building real applications on Bitcoin Cash.

## The Cash Stack

Before we write code, it helps to understand the pieces you'll be working
with. The **Cash Stack** is the collection of open-source software that makes
it easy to build on Bitcoin Cash. From the bottom up:

- **BCHN** — the reference full node that stores and validates the blockchain.
- **Fulcrum** — a fast indexer that makes querying the blockchain quick.
- **psf-bch-api** — a REST API server that sits in front of the node and
  indexer, giving you simple HTTP endpoints.
- **bch-js** — a JavaScript library that wraps that REST API in friendly
  functions. This is the layer you'll use most as a JavaScript developer.

For most applications you'll talk to `bch-js`, which talks to a REST API
server, which talks to the node. You rarely need to touch the node directly.

## Choosing a library

There are two main JavaScript libraries maintained by the Permissionless
Software Foundation:

- **`@psf/bch-js`** — a "swiss army knife" for building custom Bitcoin Cash
  transactions. It gives you low-level control and is great for learning how
  the protocol works. It requires a `psf-bch-api` back end.
- **`minimal-slp-wallet`** — a higher-level library that embeds `bch-js` and
  provides simplified functions for common wallet use-cases. Best for beginners
  building wallets quickly.

In this series we'll start with `bch-js` because it teaches you the underlying
mechanics of the blockchain.

## Setting up your project

Create a new directory and initialize a Node.js project:

```bash
mkdir bch-hello
cd bch-hello
npm init -y
```

Install `bch-js`:

```bash
npm install @psf/bch-js
```

Now create a file called `check-balance.js`:

```javascript
// REST API server. bch.fullstack.cash is free and great for learning,
// though it is rate-limited.
const API_SERVICE_URL = 'https://bch.fullstack.cash/v6'

import BCHJS from '@psf/bch-js'

// Instantiate bch-js, pointing it at the API service.
const bchjs = new BCHJS({
  restURL: API_SERVICE_URL,
})

// A public Bitcoin Cash address to check.
const ADDR = 'bitcoincash:qqh793x9au6ehvh7r2zflzguanlme760wuzehgzjh9'

// Get the balance of the address.
async function getBalance() {
  try {
    const balance = await bchjs.Electrumx.balance(ADDR)
    console.log('BCH Balance information:')
    console.log(JSON.stringify(balance, null, 2))
  } catch (err) {
    console.error('Error in getBalance: ', err)
  }
}

getBalance()
```

Run it:

```bash
node check-balance.js
```

You should see a JSON object with the address's confirmed and unconfirmed
balance in satoshis (the smallest unit of BCH — 100,000,000 satoshis = 1 BCH).

## What just happened?

Let's unpack the code:

- `new BCHJS({ restURL })` creates a client connected to a `psf-bch-api`
  server. The `restURL` tells it where to send requests.
- `bchjs.Electrumx.balance(ADDR)` asks the indexer for the balance of an
  address. The `Electrumx` namespace groups functions that query the indexer.
- The result is returned as a Promise, so we `await` it inside an `async`
  function.

This is the basic pattern you'll use over and over: **instantiate `bchjs`,
call a method, handle the result.**

## Back-end options

The `bch.fullstack.cash` service is free and reliable, but slow and heavily
rate-limited. As you build, you have other options:

- **`free-bch.fullstack.cash`** — free, faster, but no uptime guarantee
  (provided by volunteers). Works with `minimal-slp-wallet` but not `bch-js`.
- **`x402.fullstack.cash`** — fast and reliable, paid per API call with BCH
  using the x402 protocol. Good for production code.
- **Your own infrastructure** — run a Cash Box or your own `psf-bch-api`
  instance and access it with a Bearer token. No rate limits.

For learning, `bch.fullstack.cash` is perfect.

## Next steps

You've made your first successful call to the Bitcoin Cash blockchain. In the
next lessons we'll build on this foundation:

- Creating a wallet and generating addresses
- Sending BCH between addresses
- Reading and building transactions
- Working with tokens

The full set of working examples is available in the
[psf-js-examples repository](https://github.com/Permissionless-Software-Foundation/psf-js-examples),
and the complete API reference is at [bchjs.fullstack.cash](https://bchjs.fullstack.cash/).
