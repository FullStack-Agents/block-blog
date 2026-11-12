---
title: "Encrypted Messages Between Addresses"
date: "2026-11-12"
order: 12
description: "Build on the OP_RETURN lesson: encrypt a message to another BCH address with the receiver's public key, publish the ciphertext to a Nostr relay, write a signal transaction to the blockchain, then download and decrypt the message as the receiver."
section: "javascript-development"
image: "/block-blog/images/javascript-development/js-dev-06-hero.png"
tags: ["JavaScript", "Bitcoin Cash", "minimal-slp-wallet", "bch-nostr", "bch-encrypt-lib", "encryption", "nostr", "op-return", "tutorial"]
---

# Encrypted Messages Between Addresses

In the last lesson you wrote text to the blockchain with an OP_RETURN output.
That text was **public**: anyone who reads the chain can see it, forever. Which
is fine for a memo.cash post, but useless for anything private.

So here's the obvious next question: can you send a **private** message to
another Bitcoin Cash address? Not a payment — a message. One that only the
owner of that address can read.

Yes. And the surprising part is where the pieces go:

- **The message** is encrypted to the receiver's BCH public key and stored
  **off-chain** on a [Nostr](https://nostr.org) relay.
- **The blockchain** carries only a tiny **signal** — an OP_RETURN output
  telling the receiver *"there is a message for you, and here is its ID."*

That split is what makes it practical, and by the end of this lesson you'll have
built it. Both halves of the loop — sending and receiving — are short enough to
read in one sitting.

This is exactly how
[**psf-msg-wallet**](https://github.com/Permissionless-Software-Foundation/psf-msg-wallet)
works, the command-line app that adds E2EE messaging to the PSF BCH wallet. We'll
build the same flow in JavaScript, then map it back to the CLI commands.

Here's the plan:

1. Understand **why** the ciphertext isn't on the chain.
2. **Look up** the receiver's public key from the blockchain.
3. **Encrypt** with that public key.
4. **Publish** the ciphertext to a Nostr relay.
5. **Write** the signal to the blockchain.
6. **Receive**: find the signal, fetch the ciphertext, decrypt.

![How an encrypted message travels from one BCH address to another](/block-blog/images/javascript-development/js-dev-06-flow.png)

## Why not put the ciphertext in the OP_RETURN?

Fair question — the last lesson wrote text to the chain, so why not write the
*encrypted* text there? Because of two hard numbers.

**First, the 220-byte OP_RETURN limit.** The encryption used by this stack adds
**113–129 bytes of overhead** to every message — a 65-byte ephemeral public key,
a 16-byte IV, and a 32-byte HMAC — and the ciphertext itself is padded to
16-byte blocks. So:

| Plaintext | Ciphertext |
| --------- | ---------- |
| 1 byte    | 129 bytes  |
| 49 bytes  | 177 bytes  |
| 100 bytes | 225 bytes  |

Even a **single character** produces 129 bytes of ciphertext. Hex-encoded — as
OP_RETURN data usually is — that's 258 characters, already past the limit. (You
could squeeze about 95 bytes of plaintext in as raw binary, but
`sendOpReturn()` builds its output with `Buffer.from(msg)`, which is UTF-8;
arbitrary ciphertext bytes don't survive that trip.)

**Second, permanence cuts both ways.** The chain is replicated to every node and
kept forever. You don't want to pay for that and expose it that way for every
chat message, especially when the thing is *already unreadable* — you'd be
buying permanence for something that isn't even a public record.

So the design is: **small permanent pointer on the chain, big payload
somewhere else.** The "somewhere else" here is a Nostr relay — a lightweight
websocket server that stores signed events by ID. Delete the relay's data and
you lose the *message body*, but the signal on the chain still records that a
message was sent, by whom, when, and to whom.

> **This is a real trade-off, not a free lunch.** On-chain content is
> permanent and trustless; the relay is neither. A relay operator can drop your
> ciphertext. Nobody can read it — the encryption is end-to-end and the relay
> holds no keys — but they can refuse to store it. That's why the *signal* lives
> on BCH: it's the censorship-resistant part.

## Set up

This lesson builds on the two wallets from earlier lessons: the funded
`wallet.json` (sender) and the second wallet `wallet2.json` (receiver). If you
need to start fresh, go back to "Keys, Addresses, and Receiving BCH" and "Send
BCH" to create and fund them.

```bash
mkdir bch-msg
cd bch-msg
npm init -y
npm pkg set type=module
npm install minimal-slp-wallet bch-encrypt-lib bch-nostr
```

Copy your `wallet.json` and `wallet2.json` into this directory. You'll also need
a little BCH in `wallet.json` — sending a message costs about **3,000 sats**
(most of which is a 2,000-sat donation to the PSF plus 550 sats sent to the
receiver).

### The receiver must have spent money at least once

Here's a gotcha that will bite you immediately if you skip it.

You can only encrypt to a receiver's **public key**, and a public key is not
published anywhere until that address **spends** a coin (the key sits in the
signature script). An address that has only ever *received* BCH shows up on the
chain as a bare address hash — there is no key to encrypt to.

Try it and `getPubKey()` tells you plainly:

```
Error in minimal-slp-wallet/router.js/getPubKey()
Error: No transaction history.
```

So: from `wallet2.json`, send a few thousand sats back to your first wallet.
Now `wallet2`'s public key is on the chain and can be used as an encryption
target. (This is the same reason the first message to a brand-new address can't
be encrypted — which is also why this scheme can't replace plain BCH payments.)

## Step 1: Get the receiver's public key

Encryption needs the receiver's **public key**, not their address. Read it from
the blockchain — this is the one piece of on-chain data we need, and
`minimal-slp-wallet` fetches it for you:

```javascript
// CUSTOMIZE THIS — the address you are sending to.
const RECEIVER_ADDRESS = 'bitcoincash:qq5hf7p9rm0kqs9gcdu058msqcy3tpd48u539pxax3'

import SlpWallet from 'minimal-slp-wallet'
import walletData from './wallet.json' with { type: 'json' }

async function start () {
  const wallet = new SlpWallet(walletData.mnemonic, {
    interface: 'consumer-api',
    restURL: 'https://free-bch.fullstack.cash'
  })
  await wallet.walletInfoPromise

  const publicKey = await wallet.getPubKey(RECEIVER_ADDRESS)
  console.log(publicKey)
  // 03d4f0ed4be073085edec4912c04d33d30569b5d18ebca63e1f37a6016be383813
}
start()
```

That's a 33-byte compressed secp256k1 key. Hand this to anyone and they can
encrypt to you — but they still cannot spend your coins, and (as you'll see)
they cannot read messages sent *by* you either.

## Step 2: Encrypt the message

`bch-encrypt-lib` does the crypto. It takes the receiver's public key and your
message as a **hex string**, and returns the encrypted payload as a hex string.

Under the hood this is **ECIES**: a fresh ephemeral key pair is generated, its
private half is combined with the receiver's public key via ECDH to derive a
shared secret, and the message is encrypted with AES-256-CBC and authenticated
with HMAC-SHA256. The ephemeral **public** key is prepended to the payload so the
receiver can derive the same secret — which is why every message carries those
extra bytes.

```javascript
import EncryptLib from 'bch-encrypt-lib'

const encryptLib = new EncryptLib({ bchjs: wallet.bchjs })

const MESSAGE = 'Hello from the other side of the blockchain! 🔐'

// Encrypt: the message goes in as hex, the ciphertext comes out as hex.
const msgHex = Buffer.from(MESSAGE).toString('hex')
const ciphertext = await encryptLib.encryption.encryptFile(publicKey, msgHex)

console.log(ciphertext.length / 2, 'bytes') // 177
```

Run it twice and you'll get **different ciphertext both times**, even for the
same message and key. That's the random IV and ephemeral key doing their job:
an attacker can't tell whether you sent the same thing twice.

## Step 3: Publish the ciphertext to a Nostr relay

Nostr is a simple protocol: events are JSON objects, signed with a secp256k1 key,
addressed by the hash of the signed event. A relay stores events and serves them
back by ID.

`bch-nostr` reuses your BCH private key to produce a Nostr key pair, so you don't
manage a second identity:

```javascript
import BchNostr from 'bch-nostr'

const bchNostr = new BchNostr()
const RELAY = 'wss://relay.primal.net'

const { privKeyBuf, nostrPubKey } =
  bchNostr.keys.createNostrPubKeyFromWif({ wif: wallet.walletInfo.privateKey })

const eventId = await bchNostr.post.uploadToNostr({
  privKeyBuf,
  nostrPubKey,
  relayWs: RELAY,
  msg: ciphertext
})

console.log('eventId:', eventId)
// 2049d14688120276e4e3a308bd3b71e4c53474495d6f9a77b9050cc74070bbcd
```

The event ID is a **64-character hex hash** of the signed event. Remember it —
it's the pointer we're about to put on the blockchain.

> **Note on relays:** an event exists only on the relay you published it to.
> Both sides must agree on the relay. The PSF runs one at
> `wss://nostr-relay.psfoundation.info`, which is the default in
> `psf-msg-wallet`. If publishing times out, try another relay — this is
> transport, not consensus.

## Step 4: Write the signal to the blockchain

Now the part that builds on the OP_RETURN lesson. `bch-nostr` builds and
broadcasts a transaction that:

- has an **OP_RETURN** output carrying a small "memo-like" message of the form
  `MSG NOSTR <eventId> <subject>`,
- sends **550 sats** to the receiver (dust that ties the signal to their
  address),
- sends **2,000 sats** to the PSF as a donation,
- returns the change to you.

```javascript
const { txid } = await bchNostr.signal.sendMsgSignal({
  wallet,
  addr: RECEIVER_ADDRESS,
  subject: 'Lesson 6 test',
  eventId
})

console.log('Message signal TXID:', txid)
```

Here's the OP_RETURN output from a real one, decoded with the same
`bchjs.Script.decode()` trick from the last lesson:

```
6a          OP_RETURN
02 6dd2     push 2 bytes: protocol prefix 6dd2  ("message signal")
4c 58       push 88 bytes (0x58)
            "MSG NOSTR 2049d14688120276e4e3a308bd3b71e4c53474495d6f9a77b9050cc74070bbcd Lesson 6 test"
```

88 bytes: the event ID plus a subject line. Compare that to the 177-byte
ciphertext — the chain carries **half the data, and none of the secret**. The
`6dd2` prefix plays the same role as memo.cash's `6d02`: it tells readers how to
interpret the output. Anyone scanning the chain can see *that* you sent a
message, to whom, and when. Nobody can see *what*.

That whole transaction cost about **3,062 sats**, of which 550 went to the
receiver.

## Step 5: Find your messages as the receiver

The receiver's side starts by scanning the chain for signals addressed to
them — `checkMsgs()` reads message-signal transactions for an address and
filters out the ones you sent yourself:

```javascript
const signals = await bchNostr.signal.checkMsgs({
  wallet,
  addr: wallet.walletInfo.address,
  limit: 5
})

console.log(signals[0])
// {
//   hash: '2049d146...0bbcd',
//   subject: 'Lesson 6 test',
//   sender: 'bitcoincash:qq7y2s4e7cv3luxptgj7wzkmwxwg7x64fch03tzwgz',
//   txid: 'a72dff9dadf831ce14bbbb4f9c882f48ef1f99e9dd96bdd6f51dfbc59a83843e',
//   time: 1762000000
// }
```

`txid` is the on-chain signal; `hash` is the Nostr event ID it points to;
`sender` comes from the transaction's input — the chain tells you **who** sent
it, which is something email can't do without trusting headers.

## Step 6: Fetch and decrypt

Two calls: follow the signal to the relay, then decrypt with your own private
key.

```javascript
const { message } = await bchNostr.read.getNostrMsgFromTxid({
  txid: signals[0].txid,
  wallet,
  relayWs: RELAY
})

const msgHex = await encryptLib.encryption.decryptFile(
  wallet.walletInfo.privateKey, // WIF, 52 characters
  message
)
console.log(Buffer.from(msgHex, 'hex').toString('utf8'))
// Hello from the other side of the blockchain! 🔐
```

> **Gotcha:** `getNostrMsgFromTxid()`'s default `relayWs` is written as
> `https://nostr-relay.psfoundation.info` — but this is a *websocket* connection.
> Pass the `wss://` URL explicitly, as above, or the call will hang.

Notice what `decryptFile()` needs: the receiver's **private key**, in WIF
format. The relay never sees it. The sender never had it. And if the MAC doesn't
verify — wrong key, tampered ciphertext — decryption throws rather than returning
garbage. That's the HMAC doing its job.

## The complete scripts

Here are both halves, run end to end against mainnet while writing this lesson.

**`send-encrypted.js`**

```javascript
// CUSTOMIZE THESE ------------------------------------------------------------
const RECEIVER_ADDRESS = 'bitcoincash:qq5hf7p9rm0kqs9gcdu058msqcy3tpd48u539pxax3'
const SUBJECT = 'Lesson 6 test'
const MESSAGE = 'Hello from the other side of the blockchain! 🔐'
// ----------------------------------------------------------------------------

import SlpWallet from 'minimal-slp-wallet'
import BchNostr from 'bch-nostr'
import EncryptLib from 'bch-encrypt-lib'
import walletData from './wallet.json' with { type: 'json' }

const RELAY = 'wss://relay.primal.net'

async function start () {
  try {
    const wallet = new SlpWallet(walletData.mnemonic, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.initialize()

    const bchNostr = new BchNostr()
    const encryptLib = new EncryptLib({ bchjs: wallet.bchjs })

    // 1. The receiver's public key, from the blockchain.
    const publicKey = await wallet.getPubKey(RECEIVER_ADDRESS)
    console.log('Receiver public key:', publicKey)

    // 2. Encrypt to that key.
    const msgHex = Buffer.from(MESSAGE).toString('hex')
    const encryptedHex = await encryptLib.encryption.encryptFile(publicKey, msgHex)
    console.log('Ciphertext is', encryptedHex.length / 2, 'bytes')

    // 3. Publish the ciphertext to a Nostr relay.
    const { privKeyBuf, nostrPubKey } =
      bchNostr.keys.createNostrPubKeyFromWif({
        wif: wallet.walletInfo.privateKey
      })
    const eventId = await bchNostr.post.uploadToNostr({
      privKeyBuf,
      nostrPubKey,
      relayWs: RELAY,
      msg: encryptedHex
    })
    console.log('Nostr event ID:', eventId)

    // 4. Write the signal to the blockchain.
    const { txid } = await bchNostr.signal.sendMsgSignal({
      wallet,
      addr: RECEIVER_ADDRESS,
      subject: SUBJECT,
      eventId
    })
    console.log('Message signal TXID:', txid)
    console.log(`View it: https://bch.loping.net/tx/${txid}`)
  } catch (err) {
    console.error(err)
  }
}
start()
```

**`receive-encrypted.js`**

```javascript
import SlpWallet from 'minimal-slp-wallet'
import BchNostr from 'bch-nostr'
import EncryptLib from 'bch-encrypt-lib'
import walletData from './wallet2.json' with { type: 'json' }

const RELAY = 'wss://relay.primal.net'

async function start () {
  try {
    const wallet = new SlpWallet(walletData.mnemonic, {
      interface: 'consumer-api',
      restURL: 'https://free-bch.fullstack.cash'
    })
    await wallet.initialize()

    const bchNostr = new BchNostr()
    const encryptLib = new EncryptLib({ bchjs: wallet.bchjs })

    // 1. Scan the blockchain for signals addressed to me.
    const signals = await bchNostr.signal.checkMsgs({
      wallet,
      addr: wallet.walletInfo.address,
      limit: 5
    })
    console.log(`Found ${signals.length} message signal(s)`)
    if (signals.length === 0) return

    const signal = signals[0]
    console.log(`From:    ${signal.sender}`)
    console.log(`Subject: ${signal.subject}`)
    console.log(`TXID:    ${signal.txid}`)

    // 2. Follow the signal to the ciphertext on the relay.
    const { message } = await bchNostr.read.getNostrMsgFromTxid({
      txid: signal.txid,
      wallet,
      relayWs: RELAY
    })

    // 3. Decrypt with my private key.
    const msgHex = await encryptLib.encryption.decryptFile(
      wallet.walletInfo.privateKey,
      message
    )
    console.log('\nDecrypted message:')
    console.log(Buffer.from(msgHex, 'hex').toString('utf8'))
  } catch (err) {
    console.error(err)
  }
}
start()
```

And the actual output of the receiver's script:

```
Found 1 message signal(s)
From:    bitcoincash:qq7y2s4e7cv3luxptgj7wzkmwxwg7x64fch03tzwgz
Subject: Lesson 6 test
TXID:    a72dff9dadf831ce14bbbb4f9c882f48ef1f99e9dd96bdd6f51dfbc59a83843e
eventId:  2049d14688120276e4e3a308bd3b71e4c53474495d6f9a77b9050cc74070bbcd

Decrypted message:
Hello from the other side of the blockchain! 🔐
```

Want to see the on-chain half for yourself?
[That transaction](https://bch.loping.net/tx/a72dff9dadf831ce14bbbb4f9c882f48ef1f99e9dd96bdd6f51dfbc59a83843e)
is permanent, and its OP_RETURN reads `MSG NOSTR 2049d146… Lesson 6 test`. The
receiver's mailbox address is public; the message inside it is not.

## The same thing from the command line

`psf-msg-wallet` wraps all of this:

```bash
# Send an encrypted message to a BCH address
node psf-msg-wallet.js msg-nostr-send \
  -n wallet1 \
  -a bitcoincash:qq5hf7p9rm0kqs9gcdu058msqcy3tpd48u539pxax3 \
  -s "Lesson 6 test" \
  -m "Hello from the other side of the blockchain!"

# As the receiver: list message signals addressed to you
node psf-msg-wallet.js msg-nostr-check -n wallet2

# Then download and decrypt one, using the TXID from the previous step
node psf-msg-wallet.js msg-nostr-read -n wallet2 \
  -t a72dff9dadf831ce14bbbb4f9c882f48ef1f99e9dd96bdd6f51dfbc59a83843e
```

For long messages it also reads from a JSON file (`txt2json`, then `-j`), and it
can attach structured `data` to a message with the `-d` flag — the same
encrypted blob, with a `data` property alongside the `message`. And for files too
big to be a message at all, it stages and pins them to the
[PSF IPFS network](https://psffpp.com) and sends you the link.

## What you just built

Pull back and look at the shape of it:

- **The receiver's identity is their BCH key pair.** No account, no username, no
  server that can deactivate you. Same key that holds the money.
- **Encryption is asymmetric.** You encrypt with a public key you read off the
  chain; only the private key can undo it. The sender doesn't need a shared
  secret, and the relay can't read anything.
- **The blockchain is the directory, not the mailbox.** It records *that* a
  message exists, who sent it, and where to find it — permanently. The bulky,
  private part lives where bulk is cheap and deletable.
- **Permanence has a price, and the design respects it.** 88 bytes of pointer on
  the chain, 177 bytes of ciphertext off it.

That split — public commitment, private payload — is a pattern you'll see again
and again in this space: tokens point at metadata, timestamping services point at
documents, and here, messages point at ciphertext. Learn to spot it and the
"impossible" parts of decentralized apps start to look like ordinary engineering.

Ready for more? Head back to [BCH Education](#/education) to continue.
