---
title: "Write Text to the Blockchain"
date: "2026-08-22"
order: 11
description: "Create a transaction with an OP_RETURN output to embed ASCII text permanently on the Bitcoin Cash blockchain using minimal-slp-wallet's sendOpReturn() function — and read it back."
section: "javascript-development"
image: "/block-blog/images/javascript-development/js-dev-05-hero.png"
tags: ["JavaScript", "Bitcoin Cash", "minimal-slp-wallet", "op-return", "memo.cash", "data", "tutorial"]
---

# Write Text to the Blockchain

So far you've learned how to move money on Bitcoin Cash — generating wallets,
receiving BCH, sending it, and even sweeping a paper wallet. But the blockchain
can hold more than just value. With a special output called **OP_RETURN**, you
can carve **permanent, uneditable text** directly into the chain — a message
that no one can alter or delete, ever.

This is how services like [memo.cash](https://memo.cash) run a decentralized
social feed, how tokens (SLP and CashTokens) declare their metadata, and how
people create timestamps and proofs-of-existence. In this lesson you'll write
your own message to the blockchain and read it back.

Here's the plan:

1. Learn what an **OP_RETURN** output is.
2. **Write** a message with `sendOpReturn()`.
3. **Read it back** from the transaction.
4. View it in a block explorer.

## What is an OP_RETURN output?

A normal transaction output sends satoshis to an address. An **OP_RETURN**
output is different: it uses the script opcode `OP_RETURN` to mark the output as
**provably unspendable data**. The blockchain nodes store the data on the
ledger, but the output can never be spent — it carries **zero satoshis** and
doesn't enter the UTXO set.

That tiny property is what makes it so powerful: because the data lives inside a
normal transaction that gets mined into a block, it becomes part of the
permanent, append-only record. Nobody can rewrite or delete it. Whatever you
write there is there forever.

An OP_RETURN script looks like this, reading left to right:

```
6a 02 6d02 11 48656c6c6f20426974636f696e2043617368
│  │  │    │  └───── the ASCII message ("Hello Bitcoin Cash")
│  │  │    └──── length of the message
│  │  └────── protocol prefix (memo.cash = 6d02)
│  └──── length of the prefix
└──── OP_RETURN opcode
```

The `6a` is the byte for `OP_RETURN`. After it come one or more "pushed" pieces
of data, each preceded by its byte length. The **protocol prefix** is a
namespacing convention: `6d02` means "this is a memo.cash text post," which lets
readers know how to interpret the data. The final piece is your actual message,
encoded as ASCII.

## Set up

You'll need a wallet that has a little BCH in it (with at least one unspent
output) from an earlier lesson. If you're starting fresh, follow the setup in
the "Keys, Addresses, and Receiving BCH" lesson to create and fund a wallet:

```bash
mkdir bch-write
cd bch-write
npm init -y
npm install minimal-slp-wallet
```

## Step 1: Write your message

`minimal-slp-wallet` has a `sendOpReturn(msg)` method that builds a transaction
with an OP_RETURN output carrying your text, signs it, and broadcasts it. Create
`write-text.js`:

```javascript
// CUSTOMIZE THIS — the message you want to carve into the blockchain.
const MESSAGE = 'Hello, Bitcoin Cash! This message is permanent.'

// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'

// Open the funded wallet from an earlier lesson.
import walletData from './wallet.json' with { type: 'json' }

async function start() {
  try {
    const wallet = new SlpWallet(walletData.mnemonic, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.initialize()

    // Write the message to the blockchain as an OP_RETURN output.
    // The default prefix '6d02' makes it a memo.cash-compatible text post.
    const txid = await wallet.sendOpReturn(MESSAGE)

    console.log(`Message written! TXID: ${txid}`)
    console.log(`View it: https://bch.loping.net/tx/${txid}`)
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node write-text.js
```

You'll get back a **TXID** — just like when you sent BCH. But this time, embedded
inside that transaction is your message. The transaction also carries a couple
of small BCH outputs: a **change** output returning your leftover sats (the
OP_RETURN output itself holds zero), plus a tiny 2000-sat donation to the PSF
for creating the software.

> **Tip:** Keep your message short. The standard limit for an OP_RETURN payload
> is **220 bytes** — roughly a long tweet. That's plenty for a memo.cash post, a
> timestamp, or a commitment hash.

## Step 2: Read it back

Writing is only half the story — let's read the message back out of the
transaction. We fetch the transaction, find the output whose script starts with
the `OP_RETURN` byte (`0x6a`), and decode the pushed data. Create
`read-text.js`:

```javascript
// CUSTOMIZE THIS — the TXID returned by the previous step.
const TXID = '4042bdcd2a11179cf9b8068e63526101193d4cd6de23bd289492bebf0af4cf0a'

// Global npm libraries
import SlpWallet from 'minimal-slp-wallet'

async function start() {
  try {
    // No funds needed to read public transaction data.
    const wallet = new SlpWallet(undefined, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.walletInfoPromise

    // Fetch the transaction details.
    const txData = await wallet.getTxData([TXID])
    const tx = txData[0]

    // An OP_RETURN output's scriptPubKey hex starts with 0x6a (the OP_RETURN byte).
    for (const vout of tx.vout) {
      const hex = vout.scriptPubKey.hex
      if (hex.startsWith('6a')) {
        const decoded = wallet.bchjs.Script.decode(Buffer.from(hex, 'hex'))
        // decoded[0] = OP_RETURN opcode, decoded[1] = protocol prefix,
        // decoded[last] = the ASCII message.
        const message = decoded[decoded.length - 1].toString('utf8')
        console.log(`OP_RETURN message: ${message}`)
      }
    }
  } catch(err) {
    console.error(err)
  }
}
start()
```

Run it:

```bash
node read-text.js
```

You'll see the message you wrote printed back to the terminal. The sample TXID
above is a real transaction whose OP_RETURN reads `This is a reply.` — try it
first to see the decoding in action, then swap in your own TXID.

## Step 3: See it in an explorer

You can also view the message directly in a block explorer. Paste your TXID into
[a loping.net transaction page](https://bch.loping.net) (or any BCH explorer).
Look at the outputs — one will be marked as **OP_RETURN** (or "nulldata") and
the explorer will render the ASCII text right on the page. For example, the
reference transaction for this lesson displays its memo: "This is a reply."

![Viewing an OP_RETURN message](/block-blog/images/javascript-development/js-dev-05-read.png)

## Why OP_RETURN matters

OP_RETURN turns the blockchain from a pure payment ledger into a
**public, permanent record that anyone can write to**:

- **memo.cash** builds a social network out of text posts stored this way.
- **SLP and CashTokens** use OP_RETURN outputs to record token creation,
  transfers, and metadata.
- **Timestamps and proofs of existence** — commit a hash of a document, then
  prove it existed as of the block it landed in.
- **Attestations and notarizations** — declare facts that can't be retroactively
  altered.

Because every output is broadcast to every node and stored forever, there is no
server you have to keep alive and no account that can be banned. Your message is
out of your hands and out of anyone else's — permanently.

## Best practices

- **Respect the 220-byte limit** for a single OP_RETURN output.
- **Use a protocol prefix** so readers can interpret your data — `6d02` is the
  memo.cash convention for a text post. Protocols (like memo.cash, SLP, and
  CashTokens) define their own prefixes so they don't collide.
- **Keep it public and innocent** — anything you write is public forever and can
  never be deleted, so write only what you'd want immortalized.
- **Zero satoshis** — the OP_RETURN output itself carries no value; it just
  declares the data.

## Summary

In this lesson you:

- Learned what an **OP_RETURN** output is and why it's unspendable.
- **Wrote a message** to the blockchain with `sendOpReturn()`.
- **Read it back** by fetching the transaction and decoding the OP_RETURN with
  `bchjs.Script.decode()`.
- **Viewed it** in a block explorer that renders the ASCII text.

You've now gone beyond moving value — you've learned to use Bitcoin Cash as a
permanent public record. From here you can combine this with everything else
you've learned to build wallets, tools, social apps, and proofs that live
forever on the chain.
