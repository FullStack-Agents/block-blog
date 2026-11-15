---
title: "A Simple Escrow Contract with bch-js"
date: "2026-11-15"
order: 13
description: "Build a 2-of-3 multisig escrow on Bitcoin Cash with bch-js: three independent keys, one P2SH address, and any two signatures to release — buyer + seller to pay, buyer + arbiter to refund, seller + arbiter to resolve a ghost."
section: "javascript-development"
image: "/block-blog/images/javascript-development/js-dev-07-hero.png"
tags: ["JavaScript", "Bitcoin Cash", "bch-js", "escrow", "multisig", "P2SH", "transactions", "tutorial"]
---

# A Simple Escrow Contract with bch-js

Two strangers want to trade. The buyer doesn't want to pay first; the seller
doesn't want to deliver first. A neutral third party could hold the money — but
then you're trusting a custodian again, which is the thing Bitcoin Cash was
supposed to remove.

There is a much older, much simpler answer: **2-of-3 multisig**. Three keys, and
any two of them can move the money. No custodian, no oracle, no custom virtual
machine code — just a standard script that Bitcoin has supported for over a
decade.

In this lesson you'll build one from scratch with **bch-js**, fund it, and spend
it from two different pairs of keys.

Here's the plan:

1. Understand the **2-of-3 escrow** and its three outcomes.
2. Create **three independent keys** (buyer, seller, arbiter).
3. Build the **redeem script** and the **P2SH address**.
4. **Fund** the escrow.
5. **Spend** it with two signatures.
6. Verify what the network actually enforced.
7. Learn what this contract does — and does **not** — protect against.

> **A note on the library name:** `bch-js` is now published as
> [`@psf/bch-js`](https://www.npmjs.com/package/@psf/bch-js). The old `bch-js`
> package name no longer resolves on npm. The code is the same library; this
> lesson uses the current name.

## 1. The 2-of-3 escrow

Three people each hold one key:

- the **buyer**, who is paying,
- the **seller**, who is delivering,
- the **arbiter**, who is trusted to help resolve a disagreement.

The money sits at one address that requires **two of the three** keys to spend.
That gives exactly three ways out:

| Signers | What it means | Where the money goes |
|---|---|---|
| **Buyer + Seller** | The deal went well. | Seller |
| **Buyer + Arbiter** | The seller didn't deliver. | Buyer (refund) |
| **Seller + Arbiter** | The buyer ghosted after delivery. | Seller |

The escrow is not a judge. It cannot tell whether the gift card worked or the
freelancer delivered. It is a **lock with three keys and a two-key rule**. The
arbiter's power is to be the second signature when the two parties disagree —
which also means **the arbiter can collude with either party**. Pick an arbiter
you would trust not to do that.

The locking script is tiny:

```
OP_2 <buyer pubkey> <seller pubkey> <arbiter pubkey> OP_3 OP_CHECKMULTISIG
```

- `OP_2` says "two signatures required".
- The three public keys are the three possible signers.
- `OP_3` says "out of three keys".
- `OP_CHECKMULTISIG` checks the signatures.

That script is hashed and locked behind a **P2SH** address:

```
OP_HASH160 <hash160(redeem script)> OP_EQUAL
```

The address commits to the hash of the script, not to the script itself. When
someone spends, they reveal the full script (the "redeem script") and provide
the signatures. The network hashes the revealed script, checks it matches the
address, and then runs it.

This is why the address is short and the three public keys stay private until
the first spend.

## 2. Set up bch-js

Create a project:

```bash
mkdir bch-escrow
cd bch-escrow
npm init -y
npm install @psf/bch-js
```

bch-js does the script and transaction math locally, and uses a BCH API server
for UTXOs and broadcasting. The free endpoint is fine for this lesson; for a
production app, get an API key at
[fullstack.cash](https://fullstack.cash) for higher rate limits.

Create a `bchjs.js` helper so every script uses the same configuration:

```javascript
// bchjs.js
import BCHJS from '@psf/bch-js'

// The /v6/ path is the current bch-api version.
// For production, add: bearerToken: 'your-api-key'
const bchjs = new BCHJS({
  restURL: 'https://bch.fullstack.cash/v6'
})

export default bchjs
```

> **Why not `minimal-slp-wallet`?** That library is perfect for ordinary
> payments, and earlier lessons used it. An escrow needs a custom locking
> script and a custom unlocking script, so this lesson drops one level down to
> bch-js, which exposes the script and transaction builder directly.

## 3. Create three independent keys

Each party should generate its own key on its own machine and share **only the
public key**. For the lesson, we'll generate all three in one script so you can
run the whole flow. In production, that file would be three different people's
wallets, and none of them would ever see the others' private keys.

Create `01-keys.js`:

```javascript
// Global npm libraries
import fs from 'fs'

// Local libraries
import bchjs from './bchjs.js'

// Turn a fresh 12-word mnemonic into a key pair and address.
async function makeKey(role) {
  const mnemonic = bchjs.Mnemonic.generate(128)
  const seed = await bchjs.Mnemonic.toSeed(mnemonic)
  const root = bchjs.HDNode.fromSeed(seed)
  const child = bchjs.HDNode.derivePath(root, "m/44'/145'/0'/0/0")
  const keyPair = bchjs.HDNode.toKeyPair(child)

  return {
    role,
    mnemonic,
    wif: bchjs.ECPair.toWIF(keyPair),
    publicKey: bchjs.ECPair.toPublicKey(keyPair).toString('hex'),
    address: bchjs.ECPair.toCashAddress(keyPair)
  }
}

async function start() {
  const keys = {}

  for (const role of ['buyer', 'seller', 'arbiter']) {
    keys[role] = await makeKey(role)
  }

  fs.writeFileSync('keys.json', JSON.stringify(keys, null, 2))

  console.log('Wrote keys.json')
  for (const role of Object.keys(keys)) {
    console.log(`${role}: ${keys[role].address}`)
  }
}

start()
```

Run it:

```bash
node 01-keys.js
```

You'll see three addresses:

```
Wrote keys.json
buyer: bitcoincash:qpyev88r5frhe8rfgtuheqv3mrrr5radgvqgulf4pl
seller: bitcoincash:qry75w6je3vwvnm2yk4ntl2rjd26hkunwc0hqf8rme
arbiter: bitcoincash:qprhzq2yt397fy080ztu0hjc7tmzc7jfku2up6s5py
```

> **Warning:** `keys.json` contains all three private keys. That is fine for a
> throwaway lesson on a machine you control, and catastrophic in production. In
> a real escrow, each party keeps only their own key and the arbiter never
> holds the buyer's or seller's key. Delete `keys.json` when you're done.

Each key follows the BIP44 path for Bitcoin Cash (`m/44'/145'/0'/0/0`), which
is the same path most BCH wallets use.

## 4. Build the redeem script and the P2SH address

Now we combine the three **public** keys into the multisig script, hash it, and
turn the hash into a P2SH address.

Create `02-escrow-address.js`:

```javascript
// Global npm libraries
import fs from 'fs'

// Local libraries
import bchjs from './bchjs.js'
import keys from './keys.json' with { type: 'json' }

// The three public keys, in the order they'll appear in the script.
const pubkeys = [keys.buyer.publicKey, keys.seller.publicKey, keys.arbiter.publicKey]
  .map((hex) => Buffer.from(hex, 'hex'))

// 2-of-3: 2 required signatures, 3 public keys.
const redeemScript = bchjs.Script.multisig.output.encode(2, pubkeys)

// The P2SH address commits to hash160(redeemScript), not to the script itself.
const scriptHash = bchjs.Crypto.hash160(redeemScript)
const escrowAddress = bchjs.Address.hash160ToCash(scriptHash, 0x05)

console.log('Redeem script (hex):', redeemScript.toString('hex'))
console.log('Redeem script (ASM):', bchjs.Script.toASM(redeemScript))
console.log('Escrow address:', escrowAddress)

fs.writeFileSync('escrow.json', JSON.stringify({
  redeemScript: redeemScript.toString('hex'),
  escrowAddress
}, null, 2))
```

Run it:

```bash
node 02-escrow-address.js
```

The output shows the script in two forms:

```
Redeem script (hex): 5221022f...c6c53ae
Redeem script (ASM): OP_2 022f1186... 02de9abd... 0247a6ea... OP_3 OP_CHECKMULTISIG
Escrow address: bitcoincash:prejgl4wqdkvx0w3yrmk52223pfd8fza55e9rg07tk
```

A few things to notice:

- `0x05` is the version byte for a **mainnet P2SH** address. (Testnet uses
  `0xc4`.)
- `hash160` is RIPEMD160(SHA256(script)) — the 20-byte commitment inside the
  address.
- The address is deterministic: the same three public keys always produce the
  same escrow address.
- The public keys are **not** in the address. They are only revealed when the
  escrow is spent.

### Verify it before you fund it

Anyone can hand you an escrow address. Before you send money, recompute it from
the three public keys you expect. If your computed address does not match the
one you were given, stop — you are about to fund a different script.

That's exactly what `02-escrow-address.js` does. Keep the script and the
`escrow.json` file; you'll need the redeem script to spend.

## 5. Fund the escrow

The escrow is just a P2SH address. Fund it from any wallet — for example, the
wallet you created in the "Send BCH" lesson. Send a **small** amount while you
are learning. In this example we'll assume `100,000` sats (0.001 BCH) arrives in
a single output.

Check that the money is there:

```javascript
// check-escrow.js
import bchjs from './bchjs.js'
import escrow from './escrow.json' with { type: 'json' }

async function start() {
  const result = await bchjs.Electrumx.utxo(escrow.escrowAddress)
  console.log(result.utxos)
}

start()
```

```bash
node check-escrow.js
```

You'll get one or more UTXOs:

```json
[
  {
    "height": 812345,
    "tx_hash": "a1b2c3...",
    "tx_pos": 0,
    "value": 100000
  }
]
```

Those three fields are the whole coin:

- `tx_hash` — the transaction that created the output.
- `tx_pos` — which output in that transaction.
- `value` — the amount, in satoshis.

To spend it, you need all three. Wait for at least one confirmation before
trying to spend.

> **Single output is simplest.** The example below spends the largest UTXO. If
> the escrow has several UTXOs, the rest stay in the escrow and can be spent
> later. A production escrow should sweep them all (or refuse to be funded more
> than once).

## 6. Spend the escrow with two signatures

Now the interesting part. The same function spends the escrow for all three
outcomes; only the pair of signers and the destination change.

Create `03-release.js`:

```javascript
// Local libraries
import bchjs from './bchjs.js'
import keys from './keys.json' with { type: 'json' }
import escrow from './escrow.json' with { type: 'json' }

const redeemScript = Buffer.from(escrow.redeemScript, 'hex')

// Choose the outcome:
//   'pay-seller'          buyer + seller   -> seller
//   'refund-buyer'        buyer + arbiter  -> buyer
//   'resolve-for-seller'  seller + arbiter -> seller
const OUTCOME = 'pay-seller'

const outcomes = {
  'pay-seller': {
    signers: [keys.buyer, keys.seller],
    destination: keys.seller.address
  },
  'refund-buyer': {
    signers: [keys.buyer, keys.arbiter],
    destination: keys.buyer.address
  },
  'resolve-for-seller': {
    signers: [keys.seller, keys.arbiter],
    destination: keys.seller.address
  }
}

const { signers, destination } = outcomes[OUTCOME]

async function start() {
  // Find the escrow's unspent output.
  const result = await bchjs.Electrumx.utxo(escrow.escrowAddress)
  if (!result.success || result.utxos.length === 0) {
    throw new Error('The escrow has not been funded yet.')
  }

  // Spend the largest UTXO. A production wallet would select enough UTXOs.
  const utxo = result.utxos.sort((a, b) => b.value - a.value)[0]

  // Estimate the transaction size and leave a fee.
  const byteCount = bchjs.BitcoinCash.getByteCount(
    { 'MULTISIG-P2SH:2-3': 1 },
    { P2PKH: 1 }
  )
  const fee = Math.ceil(byteCount * 1.2) // 1.2 sats per byte

  if (utxo.value - fee < 546) {
    throw new Error('UTXO is too small to spend after the fee.')
  }

  const txb = new bchjs.TransactionBuilder()

  // The input is the escrow UTXO.
  txb.addInput(utxo.tx_hash, utxo.tx_pos)

  // The whole escrow (minus the fee) goes to the destination.
  txb.addOutput(destination, utxo.value - fee)

  // Sign with the two keys. Each call adds one signature.
  for (const signer of signers) {
    const keyPair = bchjs.ECPair.fromWIF(signer.wif)

    txb.sign(
      0,                                 // input index
      keyPair,                           // this signer's key
      redeemScript,                      // the 2-of-3 script
      txb.hashTypes.SIGHASH_ALL,         // sign all outputs
      utxo.value,                        // amount of the UTXO (BIP143)
      txb.signatureAlgorithms.ECDSA      // NOT Schnorr — see below
    )
  }

  const hex = txb.build().toHex()

  console.log('Raw transaction:', hex)
  console.log('Size (bytes):', hex.length / 2)

  const txid = await bchjs.RawTransactions.sendRawTransaction(hex)
  console.log('Broadcast:', txid)
  console.log(`https://blockchair.com/bitcoin-cash/transaction/${txid}`)
}

start()
```

Run it:

```bash
node 03-release.js
```

You'll get a transaction ID. Paste it into a block explorer and you'll see:

- **Input:** the escrow address. Its `scriptSig` reveals the redeem script and
  the two signatures.
- **Output:** the seller's address (for `pay-seller`).

To try a refund, change `OUTCOME` to `'refund-buyer'` and use a *freshly funded*
escrow (the first spend empties the old one). To try the arbiter-seller path,
use `'resolve-for-seller'`.

### The lines that matter

- `addInput(utxo.tx_hash, utxo.tx_pos)` — spend the escrow's coin.
- `addOutput(destination, utxo.value - fee)` — pay the destination and give the
  miner the rest. There is no change output because we're emptying the escrow.
- `sign(...)` **twice** — the first call adds one signature, the second call
  reads the existing input and adds the other. The final unlocking script is:

  ```
  OP_0 <buyer signature> <seller signature> <redeem script>
  ```

  The leading `OP_0` is a historical quirk of `OP_CHECKMULTISIG`: it pops one
  extra item off the stack, so a dummy is pushed to satisfy it.

- `utxo.value` in `sign()` is not optional. BCH's signing serialization
  (BIP143) commits to the amount of the coin being spent, so the signer must
  know it. Pass the wrong value and the signature is invalid.
- `SIGHASH_ALL` signs every output. This is what stops a miner (or anyone else)
  from changing the destination after you sign.
- **Use ECDSA, not Schnorr, for multisig.** BCH's Schnorr upgrade covers
  `OP_CHECKSIG` and `OP_CHECKDATASIG`, but **not** `OP_CHECKMULTISIG`. bch-js
  will happily build a Schnorr multisig transaction if you ask it to
  (`signatureAlgorithms.SCHNORR`), and the network will reject it. ECDSA is the
  correct choice here.

## 7. What the network actually enforced

After the spend is confirmed, the escrow address is empty. The transaction is
valid only because:

1. The redeem script hashed to the 20 bytes locked in the address.
2. The script is a 2-of-3 `OP_CHECKMULTISIG`.
3. Two of the three provided public keys had valid signatures over the
   transaction.
4. The signatures commit to **all outputs**, so the destination cannot be
   changed.

No server was involved. The rules are in the script, and every full node
checks them.

You can confirm the first point yourself offline:

```javascript
// verify-escrow.js
import bchjs from './bchjs.js'
import escrow from './escrow.json' with { type: 'json' }

const redeemScript = Buffer.from(escrow.redeemScript, 'hex')
const scriptHash = bchjs.Crypto.hash160(redeemScript)
const address = bchjs.Address.hash160ToCash(scriptHash, 0x05)

console.log('Address from redeem script:', address)
console.log('Address in escrow.json:    ', escrow.escrowAddress)
console.log('Match:', address === escrow.escrowAddress)
```

Run it any time. If the two addresses ever disagree, the `escrow.json` file has
been tampered with.

## 8. What this contract does — and doesn't — protect

**It does:**

- Stop any single party from moving the money. The buyer can't take it back
  alone; the seller can't take it alone; the arbiter can't take it alone.
- Let any two parties resolve the trade without a court, a bank, or a server.
- Enforce the rule on-chain, with the same security as any other BCH payment.

**It does not:**

- **Stop collusion.** Any two keys can spend. If the arbiter is dishonest, the
  seller + arbiter can take the buyer's money (and buyer + arbiter can take the
  seller's). The arbiter is a cosigner, not a judge. Pick one with a reputation
  to lose.
- **Provide a deadline.** If the two parties disagree and the arbiter is
  unavailable, the money waits until two keys agree. A time lock
  (`OP_CHECKLOCKTIMEVERIFY`) or a contract language like
  [CashScript](https://cashscript.org) can add a "refund after block N" path.
- **Split the money.** Multisig is all-or-nothing. A half-used gift card needs a
  different contract (or two escrows).
- **Protect you from bad key management.** A 2-of-3 where one server holds two
  of the keys is not an escrow; it is custody with extra steps. Each party must
  hold its own key, and the arbiter must not hold the others'.
- **Give you privacy after the first spend.** The redeem script is revealed
  when the escrow is spent, including all three public keys. That links the
  three parties on-chain. Use a fresh escrow for each trade.

## 9. Signing on separate machines

The example above signs with both keys in one process, because that is the
easiest way to see the mechanics. In production the keys belong to different
people, so the flow is:

1. Both parties agree on the escrow address by computing it from the three
   public keys (step 4).
2. The buyer funds it.
3. To release, **both parties build the same unsigned transaction** — same UTXO,
   same destination, same fee — and sign it locally.
4. The two signatures are combined into one transaction and broadcast. A small
   multisig coordinator (or a manual handoff of the half-signed transaction)
   can do this. bch-js's `TransactionBuilder` is happiest when it builds and
   signs in one process; for a production two-party flow you'll want a
   coordinator, or a lower-level transaction library that can load a partially
   signed transaction.

A useful pattern for a gift-card trade: after the escrow is funded, the **buyer
signs** a release transaction that pays the seller and sends it to the seller.
The seller adds their signature and broadcasts it **after** delivering the
card. The buyer has authorized the payment, but the seller cannot change the
destination or amount without invalidating the buyer's signature.

Notice what this means: the buyer's signature is a real authorization. Don't
sign a release transaction until you are satisfied with what you received.

## 10. Where to go from here

- **Add a timeout.** A script with `OP_CHECKLOCKTIMEVERIFY` can let the buyer
  reclaim the funds after a deadline if the seller never delivers — no arbiter
  needed. CashScript makes this much easier to write and test.
- **Use an oracle instead of a cosigner.** Oracle-style escrows (the
  LocalCryptos design is a well-known example) use `OP_CHECKDATASIG` so one
  party plus the arbiter can release without the other party's transaction
  signature. It is more flexible, and much easier to get wrong: the oracle's
  signed message **must** commit to a unique per-escrow nonce, or every
  signature can be replayed on other escrows. Start with multisig; graduate to
  an oracle contract only with a test suite.
- **Build a coordinator.** A tiny CLI that collects two signatures and
  broadcasts is a useful weekend project, and it makes the "separate machines"
  flow practical.
- **Write tests.** The escrow logic is small enough to test against a local BCH
  VM (for example, libauth's) without spending real money. Do that before you
  put real value in it.

## Summary

In this lesson you:

- Learned why **2-of-3 multisig** is the simplest real escrow: three keys, any
  two can spend.
- Generated **three independent keys** with bch-js.
- Built the redeem script `OP_2 <3 pubkeys> OP_3 OP_CHECKMULTISIG` and turned
  its hash into a **P2SH address**.
- Funded the escrow and spent it with two signatures — **buyer + seller** to
  pay, **buyer + arbiter** to refund, **seller + arbiter** to resolve a ghost.
- Learned the two gotchas that break real transactions: **pass the UTXO value**
  to `sign()`, and **use ECDSA, not Schnorr**, for `OP_CHECKMULTISIG`.
- Saw exactly what the network enforces — and what it does not. The arbiter is a
  cosigner, not a judge; any two keys can collude; and the escrow has no
  deadline unless you add one.

That is a real escrow contract, in a few dozen lines of JavaScript. It is not
the end of the design space — time locks, oracles, and CashScript all add useful
properties — but it is a solid, standard foundation, and it does not require you
to trust a custodian with the money.
