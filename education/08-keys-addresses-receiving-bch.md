---
title: "Keys, Addresses, and Receiving BCH"
date: "2026-08-07"
order: 8
description: "Generate your first Bitcoin Cash wallet with minimal-slp-wallet, understand keys and addresses, check a zero balance, receive BCH, and read your new balance and TXID."
section: "javascript-development"
tags: ["JavaScript", "Bitcoin Cash", "minimal-slp-wallet", "keys", "addresses", "wallet", "tutorial"]
---

# Keys, Addresses, and Receiving BCH

In the last lesson you got oriented with the Cash Stack and, hopefully, acquired
a little bit of BCH on an exchange. Now let's get into the heart of it: **owning
your keys** and **receiving BCH** into a wallet that you control.

This lesson is where it clicks. By the end you'll have generated a real wallet,
seen its balance read as **zero**, received some BCH, and watched that balance
jump. Along the way you'll learn what a *key pair* is, what an *address* is, and
why a *TXID* is your receipt for a transaction.

![Keys and addresses](/block-blog/images/javascript-development/js-dev-02-hero.png)

## What is a key pair?

At its core, Bitcoin Cash ownership is just **cryptography**. Every wallet is
built from a *key pair*:

- **Private key** — a secret number that proves you own the funds. Anyone with
  this key can spend the BCH, so it must be kept secret. This is the "password"
  to your money.
- **Public key** — derived from the private key and safe to share. It's used to
  verify that a transaction was signed by the matching private key.

From the public key we derive a **Bitcoin Cash address** — the human-friendly
string (starting with `bitcoincash:` or the shorter `q`/`p` CashAddr format)
that people use to send you BCH. The address is safe to post anywhere: it's just
a number that lets others direct value to your key.

Here's the mental model: **the private key is the money.** The address is how
people find you, and the private key is how *you* spend what they send.

## Generating your wallet

The fastest way to generate a key pair, address, and wallet is with
`minimal-slp-wallet`. Set up a fresh project:

```bash
mkdir bch-wallet
cd bch-wallet
npm init -y
npm install minimal-slp-wallet
```

Now create a file called `create-wallet.js`:

```javascript
// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'
import fs from 'fs'

async function start() {
  try {
    // Generate a brand new wallet.
    const wallet = new SlpWallet()

    // Wait for the wallet to be fully generated.
    await wallet.walletInfoPromise

    // Save the wallet data to a JSON file.
    fs.writeFile('wallet.json', JSON.stringify(wallet.walletInfo, null, 2), function (err) {
      if (err) return console.error(err)
      console.log('wallet.json written successfully.')
    })
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node create-wallet.js
```

This creates a `wallet.json` file containing your wallet's `mnemonic` (the
seed phrase — treat it like the private key!), your `cashAddress`, and other
details. **Back this file up and keep it secret.** Anyone with your mnemonic can
spend your BCH.

> **Note:** `minimal-slp-wallet` by default talks to a free, volunteer-run back
> end at `https://free-bch.fullstack.cash`. That's perfect for learning. We'll
> point at it explicitly in the next examples.

## Check the balance (it should be zero)

Your new address has never been used on the network, so its balance is **zero**.
Let's prove it. Create `get-balance.js`:

```javascript
// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'

// Open the wallet created with the create-wallet example.
import walletData from './wallet.json' with { type: 'json' }

async function start() {
  try {
    // Instantiate a wallet from the saved JSON file.
    const wallet = new SlpWallet(walletData.mnemonic, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.initialize()

    // Get the balance in satoshis (sats). 100,000,000 sats = 1 BCH.
    const balance = await wallet.getBalance()
    console.log(`Balance in sats: ${balance}`)

    // Convert sats to BCH.
    const bchBalance = wallet.bchjs.BitcoinCash.toBitcoinCash(balance)
    console.log(`Balance in BCH: ${bchBalance}`)

  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node get-balance.js
```

You'll see something like:

```
Balance in sats: 0
Balance in BCH: 0
```

That's expected — your address is brand new. Now let's make it non-zero.

## Receive BCH

To receive BCH, someone sends coins to your `cashAddress`. You can read it from
`wallet.json`. Open the file and find the field named `cashAddress` — it will
look like `bitcoincash:qqh793x9au6ehvh7r2zflzguanlme760wuzehgzjh9` (or the
shorter `q`-prefixed form).

Send a tiny amount to that address from wherever you hold BCH — an exchange, a
friend's wallet, or another wallet you own. Even a few cents is plenty. On
Bitcoin Cash the transaction fee is fractions of a cent, so a tiny test payment
costs almost nothing.

> **Security note:** posting your *address* anywhere is fine — it's public by
> design. Never post your *mnemonic* or private key.

## Check the balance again

Once your payment lands, re-run the balance script:

```bash
node get-balance.js
```

Now you should see a non-zero result:

```
Balance in sats: 1234500
Balance in BCH: 0.012345
```

Congratulations — you've received BCH into a wallet you control. That's real,
on-chain money sitting in an address whose private key only you hold.

![Receiving BCH](/block-blog/images/javascript-development/js-dev-02-receive.png)

## The TXID — your receipt

When you received that BCH, the transaction was written to the blockchain and
given a unique identifier called a **transaction ID**, or **TXID**. Think of the
TXID as a **receipt or proof of transaction**: it's a permanent, public record
that the payment happened.

You can look up any transaction by its TXID in a block explorer, like
[Blockchair](https://blockchair.com/bitcoin-cash). The explorer shows you where
the coins came from, where they went, the amount, and how many confirmations the
transaction has received. Because the blockchain is append-only and
censorship-resistant, that receipt can never be erased or rewritten by anyone.

Let's fetch the transaction details in code. Create `get-tx-data.js`:

```javascript
// CUSTOMIZE THIS WITH THE TXID OF YOUR RECEIVED PAYMENT
const TXID = 'b4ad5678644f889d4ae6145e1f56a0a1abde3efbafc800c445656a4508642754'

// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'

async function start() {
  try {
    // Instantiate a wallet (no mnemonic needed to read public tx data).
    const wallet = new SlpWallet(undefined, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.walletInfoPromise

    const txData = await wallet.getTxData([TXID])
    console.log(`transaction details: ${JSON.stringify(txData, null, 2)}`)
  } catch(err) {
    console.error(err)
  }
}
start()
```

Replace `TXID` with the actual TXID from your received payment (you can find it
in the block explorer for your address, or it was returned by whatever sent you
the BCH). Run it:

```bash
node get-tx-data.js
```

You'll see verbose details about the transaction — inputs, outputs, the amount,
fees, and block confirmations. This is your **receipt**, and you can verify it
anywhere, forever.

## Summary

In this lesson you:

- Learned the difference between a **private key** (the money), a **public
  key**, and an **address** (how people find you).
- Generated a real wallet with `minimal-slp-wallet`.
- Checked its balance and saw **zero** for a fresh address.
- Received BCH into your address.
- Re-checked the balance and saw it **increase**.
- Learned that a **TXID** is your permanent, verifiable receipt.

Next up, we'll put that money to work by **sending BCH** from one wallet to
another.
