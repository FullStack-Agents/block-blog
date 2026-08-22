---
title: "Sweep Funds from a Paper Wallet"
date: "2026-08-22"
order: 10
description: "Import a private key from a paper wallet, derive its address, check the balance, and sweep all the BCH to a new address you control with minimal-slp-wallet's sendAll() function."
section: "javascript-development"
image: "/block-blog/images/javascript-development/js-dev-04-hero.png"
tags: ["JavaScript", "Bitcoin Cash", "minimal-slp-wallet", "paper-wallet", "private-key", "sweep", "tutorial"]
---

# Sweep Funds from a Paper Wallet

Paper wallets are private keys printed on paper — a great way to keep BCH in
**cold storage** offline, away from hackers and malware. But there's a catch:
the moment you want to spend that money, you have to bring the private key back
into a connected device. Once a private key has touched a computer, it should be
treated as **compromised** — so the safest practice is to move **all** of its
funds out in one go.

That single, full transfer is called a **sweep**. In this lesson you'll learn
how to import a paper wallet's private key, read its balance, and sweep
everything to a fresh hot wallet you control.

Here's the plan:

1. Set up a project with `minimal-slp-wallet`.
2. **Import** a private key (in WIF format) and derive its address.
3. **Check** the balance sitting on that paper wallet.
4. Create a **destination** hot wallet.
5. **Sweep** all the BCH to the destination with `sendAll()`.

> **Security warning:** Never type a real private key into a machine you don't
> trust. Sweeping works by reading the private key into memory and signing a
> transaction. Once a key has touched a networked computer, consider it exposed
> and move every satoshi it controls — that's exactly why sweeping sends
> *everything*, not just a portion.

## What is a private key (WIF)?

In an earlier lesson you learned the mental model: **the private key is the
money.** A paper wallet usually stores that key in **Wallet Import Format**
(**WIF**) — a compact, human-readable string that starts with `L` or `K` and is
exactly 52 characters long. It looks like this:

```
L1eYaneXDDXy8VDig4Arwe8wYHbhtsA5wuQvwsKwhaYeneoZuKG4
```

WIF is just a standard way of encoding the raw 256-bit private key so it's easy
to write down and type back in. Any wallet software can read a WIF and derive
the matching address and public key from it. That round-trip — WIF → address →
balance → spend — is exactly what a sweep does.

## Set up your project

If you're continuing from the earlier lessons, you can reuse the same project.
Otherwise, create a fresh one:

```bash
mkdir bch-sweep
cd bch-sweep
npm init -y
npm install minimal-slp-wallet
```

## Step 1: Import the paper wallet and read its address

Let's first confirm what address your private key controls, and how much it
holds. Create `import-wallet.js`:

```javascript
// CUSTOMIZE THIS — the WIF private key from your paper wallet.
const WIF = 'L1WYaneXDDXy8VDig4Arwe8wYHbhtsA5wuQvwuKwhaYauoZuKG4'

// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'

async function start() {
  try {
    // Pass the WIF directly to the wallet constructor.
    const wallet = new SlpWallet(WIF, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.initialize()

    // The address and balance associated with that private key.
    console.log('Paper wallet address: ', wallet.walletInfo.address)
    console.log('Wallet info: ', wallet.walletInfo)

    const balance = await wallet.getBalance()
    console.log('Balance in sats: ', balance)

    const bchBalance = wallet.bchjs.BitcoinCash.toBitcoinCash(balance)
    console.log('Balance in BCH: ', bchBalance)
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node import-wallet.js
```

When you pass a **WIF** to `SlpWallet`, it skips generating a new key and instead
builds the wallet *around the key you gave it*. The `walletInfo.address` field
shows you the BCH address that matches your paper wallet, and `getBalance()`
reports how many sats are sitting there.

> **Note:** This is the exact same flow as the `addr-from-key` example in the
> `psf-js-examples` repository. A WIF string *is* the seed — no mnemonic needed.

## Step 2: Create a destination wallet

Sweeping moves funds to a fresh address that *only* the new, uncompromised key
controls. Create `create-destination.js` to make that wallet:

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

    // Save it so we can read its address later.
    fs.writeFile('destination.json', JSON.stringify(wallet.walletInfo, null, 2), function (err) {
      if (err) return console.error(err)
      console.log('destination.json written successfully.')
    })
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node create-destination.js
```

Open `destination.json` and copy its `cashAddress` — that's where we'll sweep the
paper wallet's funds.

## Step 3: Sweep everything with `sendAll()`

Now the magic. `minimal-slp-wallet` gives you a `sendAll(toAddress)` method that
calculates exactly how much it can move (your whole balance *minus* the miner
fee), constructs, signs, and broadcasts the transaction — all in one call.

Create `sweep-wallet.js`:

```javascript
// CUSTOMIZE THIS — the WIF private key of the paper wallet to sweep.
const WIF = 'L1WYaneXvXy6Fgig4Arwe8wYHbhtsA5wuQvwuKwhaYauoZuKG4'
// CUSTOMIZE THIS — the address of the destination wallet you created above.
const DEST_ADDRESS = 'bitcoincash:qthg6yhk7jhj0a8cpsaxvtc3xh8l4g9y8g9aqhz0r0'

// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'

async function start() {
  try {
    // Instantiate the wallet from the paper wallet's WIF.
    const wallet = new SlpWallet(WIF, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.initialize()

    // Show the pre-sweep balance for clarity.
    const balance = await wallet.getBalance()
    console.log('Sweeping from address: ', wallet.walletInfo.address)
    console.log('Balance in sats: ', balance)

    // Send ALL the BCH to the destination address.
    const txid = await wallet.sendAll(DEST_ADDRESS)

    console.log(`Swept! TXID: ${txid}`)
    console.log(`See on block explorer: https://blockchair.com/bitcoin-cash/transaction/${txid}`)
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node sweep-wallet.js
```

You'll see a TXID printed — that's your receipt. Open it in a block explorer and
you'll see the paper wallet's address spent its entire balance into the
destination address (minus a tiny miner fee).

> **Tip:** In the background, `sendAll()` selects every BCH UTXO the paper
> wallet owns, totals them up, subtracts the mining fee, and sends the rest to
> `DEST_ADDRESS`. It also includes a small 2000-sat donation to the PSF to thank
> them for creating this software. If your paper wallet holds SLP or CashTokens,
> `sendAll()` only moves BCH — sweep BCH first, then handle any tokens
> separately.

## Verify the destination balance

Re-run the balance check, but point it at the destination wallet now:

```javascript
// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'

// Open the destination wallet.
import walletData from './destination.json' with { type: 'json' }

async function start() {
  try {
    const wallet = new SlpWallet(walletData.mnemonic, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.initialize()

    const balance = await wallet.getBalance()
    console.log(`Destination balance in sats: ${balance}`)

    const bchBalance = wallet.bchjs.BitcoinCash.toBitcoinCash(balance)
    console.log(`Destination balance in BCH: ${bchBalance}`)
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node check-destination.js
```

The destination address now holds roughly the paper wallet's original balance,
minus the fee and the donation. The paper wallet's address is now at (or very
near) zero. The sweep worked.

## Why sweep instead of send?

`sendAll()` exists precisely for this scenario. A normal `send()` requires you to
specify an exact amount and leaves change at the original address — which still
sends the now-compromised key's remaining funds at risk. `sendAll()` moves
**everything**, leaving nothing behind on the paper wallet's key. Once the sweep
is confirmed, that old key is worthless to an attacker: there's nothing left to
steal.

## Best practices

- **Sweep to a fresh wallet**, never back into the same compromised key.
- **Once the key has been online, treat it as burned.** Don't reuse a paper
  wallet address after importing it — the key has been exposed.
- **Verify the destination balance** before and after. Block explorers make this
  easy.
- **Handle tokens separately.** `sendAll()` sweeps BCH only; if the paper wallet
  holds SLP or CashTokens, plan a separate migration.
- **Do it on a trusted machine** with up-to-date software and no malware.

## Summary

In this lesson you:

- Learned what a **WIF private key** is and how it's encoded.
- **Imported** a paper wallet by passing its WIF to `SlpWallet`.
- Read the paper wallet's **address and balance**.
- Created a fresh **destination wallet**.
- **Swept all the BCH** to that wallet with `sendAll()`, leaving nothing behind
  on the compromised key.

Sweeping is a core skill for anyone working with paper wallets, cold storage, or
recovering funds from an old key. Combined with everything you've learned about
generating wallets, receiving, and sending BCH, you now have a complete toolbox
for moving value on Bitcoin Cash — safely.
