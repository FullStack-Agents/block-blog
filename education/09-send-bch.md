---
title: "Send BCH"
date: "2026-08-07"
order: 9
description: "Send BCH from one wallet to another with minimal-slp-wallet — generate a second wallet, confirm its zero balance, send a payment, and watch both balances change."
section: "javascript-development"
image: "/block-blog/images/javascript-development/js-dev-03-hero.png"
tags: ["JavaScript", "Bitcoin Cash", "minimal-slp-wallet", "send", "transactions", "wallet", "tutorial"]
---

# Send BCH

Now for the payoff. In the last lesson you generated a wallet, received some BCH
into it, and learned that a TXID is your receipt. In this lesson you'll **send
BCH** — moving value from one wallet you control to another — and watch both
balances update. This is the fundamental action that makes Bitcoin Cash a
peer-to-peer electronic cash system.

Here's the plan:

1. Generate a **second** wallet.
2. Confirm its balance is **zero**.
3. Send BCH from your **first** wallet (the funded one) to the second.
4. Check the balance of **both** wallets.

By the end you'll have sent real money across the network and seen the proof.

## Generate a second wallet

You need a destination to send to, so let's create a second wallet. It's the
same code you used before. Create `create-second-wallet.js`:

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

    // Save it to a second file.
    fs.writeFile('wallet2.json', JSON.stringify(wallet.walletInfo, null, 2), function (err) {
      if (err) return console.error(err)
      console.log('wallet2.json written successfully.')
    })
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node create-second-wallet.js
```

This creates `wallet2.json`. Open it and note its `cashAddress` — that's where
we'll send BCH.

## Check the second wallet's balance (zero)

Just like the first wallet, this fresh address should have a **zero** balance.
Create `get-balance2.js`:

```javascript
// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'

// Open the second wallet.
import walletData from './wallet2.json' with { type: 'json' }

async function start() {
  try {
    const wallet = new SlpWallet(walletData.mnemonic, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.initialize()

    const balance = await wallet.getBalance()
    console.log(`Wallet 2 balance in sats: ${balance}`)

    const bchBalance = wallet.bchjs.BitcoinCash.toBitcoinCash(balance)
    console.log(`Wallet 2 balance in BCH: ${bchBalance}`)
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node get-balance2.js
```

You'll see `0` — an empty wallet waiting to be funded.

## Send BCH from the first wallet

Now let's send some BCH from your **first** wallet (the one that received funds
in the previous lesson) to the second. Create `send-bch.js`:

```javascript
// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'

// Open the FIRST wallet (the one that has a balance).
import walletData from './wallet.json' with { type: 'json' }
// The destination address — from your second wallet.
import wallet2Data from './wallet2.json' with { type: 'json' }

async function start() {
  try {
    const wallet = new SlpWallet(walletData.mnemonic, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.initialize()

    // The address to send to: your second wallet's cashAddress.
    const address = wallet2Data.cashAddress

    // Amount to send, in satoshis. 1000 sats = a tiny fraction of a cent.
    const amountSat = 1000

    // Send the BCH to the designated address.
    const receivers = [{ address, amountSat }]
    const txid = await wallet.send(receivers)

    console.log(`BCH sent with TXID: ${txid}`)
    console.log(`See on block explorer: https://blockchair.com/bitcoin-cash/transaction/${txid}`)
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node send-bch.js
```

You'll get back a **TXID** — your receipt for the payment, just like we discussed
in the last lesson. You can paste that TXID into a block explorer and watch the
transaction propagate and confirm. This is a real, on-chain payment.

> **Tip:** `minimal-slp-wallet` handles the messy details for you — it selects
> your UTXOs (the individual coins in your wallet), constructs the transaction,
> signs it with your private key, pays the miner fee, and broadcasts it. In the
> earlier `send-bch.js` example in the psf-js-examples repo, the default sends
> BCH back to itself; here we've pointed it at your second wallet instead.

![Two wallets](/block-blog/images/javascript-development/js-dev-03-wallets.png)

## Check both balances

Now the fun part. Re-run the balance script for the **first** wallet, then the
**second** wallet:

```bash
node get-balance.js    # first wallet
node get-balance2.js   # second wallet
```

You'll see the money has moved:

```
# First wallet (get-balance.js)
Balance in sats: 1233500
Balance in BCH: 0.012335

# Second wallet (get-balance2.js)
Balance in sats: 1000
Balance in BCH: 0.00001
```

The second wallet went from **0 to 1000 sats**, and the first wallet decreased
by roughly the amount sent *plus* a tiny miner fee (the few hundred sats you see
missing from the full 1000 are the transaction fee paid to miners). That fee is
fractions of a cent — this is why Bitcoin Cash is ideal for everyday payments.

## What just happened?

Let's unpack the mechanics:

- The `send()` call **selected your UTXOs** — the individual unspent coins in
  the first wallet that add up to at least what you wanted to send.
- It **constructed a transaction** with an output to the second wallet's
  address, and a **change output** sending the leftover back to you.
- It **signed** the transaction with your private key — cryptographic proof that
  only you authorized the spending.
- It **broadcast** the signed transaction to the network, where miners picked it
  up and confirmed it into a block.
- The **TXID** it returned is your permanent, public receipt.

Everything is verifiable: open a block explorer, paste the TXID, and you'll see
the inputs, outputs, amount, and confirmations. No bank, government, or company
can reverse it.

## Summary

In this lesson you:

- Generated a **second wallet**.
- Confirmed its balance was **zero**.
- Sent **real BCH** from your first wallet to the second using
  `minimal-slp-wallet`'s `send()` function.
- Watched **both balances** change — one went up, one went down (minus a tiny
  fee).
- Held a **TXID** as your permanent proof of the transaction.

You've now completed the full loop: generate a wallet, receive BCH, and send
BCH. These are the building blocks of every Bitcoin Cash application. From here,
you can explore reading transaction history, working with tokens (SLP and
CashTokens), or building your own wallet and payment tools on top of
`minimal-slp-wallet`.
