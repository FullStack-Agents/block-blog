---
title: "The 'q' That Saves You: Why Bitcoin Cash Addresses Can't Be Mixed Up"
date: "2026-08-20"
excerpt: "The Bitcoin Cash Bandit scooped up over $600,000 in coins people sent to the wrong address. Here's how one letter — the 'q' — ended that nightmare, and how you can send crypto without ever holding your breath."
tags: ["bitcoin-cash", "cashaddr", "addresses", "security", "education"]
image: "/block-blog/images/blog/2026-08-20-cashaddr-q-prefix.png"
---

# The "q" That Saves You: The Money Cash Addresses Can't Be Mixed Up

In 2017, a mysterious figure appeared on Reddit with a strange offer. They posted the same message to r/bitcoin, r/btc, and r/bitcoincash: *"I've recovered all the Bitcoin Cash that was mistakenly sent to Bitcoin addresses. If you can prove it's yours, I'll give it back — for a 30% fee."*

At the time, the address they pointed to held **493 BCH** — over **$600,000** in coins that ordinary people had accidentally thrown away.

The community couldn't decide whether they were a hero or a con artist. Some called them a white-hat hacker. Others called them greedy. But nobody could deny the underlying problem was real: perfectly good money was vanishing into the void, and the only person who could get it back was an anonymous "Bitcoin Cash Bandit."

Why did this happen? Because **Bitcoin and Bitcoin Cash used to have identical-looking addresses.** And when you can't tell two things apart, sooner or later you mix them up — and it costs you.

This is the story of how one single letter — a little **"q"** — fixed all of it.

## The Address That Tricked a Million Eyes

Let's get one thing straight first: a crypto address is just a **destination label**. It's the account number on an envelope you mail money to. On the Bitcoin Cash blockchain, it's a long string of letters and numbers derived from your public key.

Here's the catch. When Bitcoin Cash split from Bitcoin in August 2017, it inherited Bitcoin's entire address format. The two networks were different, but their "envelopes" looked **identical**:

```
1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF   (BTC)
1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF   (BCH)
```

Exactly the same string. The keys were the same too. If you owned the private key for an address on one chain, you owned the keys on the other.

So when someone "sent Bitcoin Cash to a Bitcoin address," the transaction went through — the networks couldn't tell the difference. But the money landed in a wallet that (in many cases) nobody could spend it from. **The coins were effectively burned** — unrecoverable, untraceable, gone.

This became one of the most common and most heartbreaking mistakes in early crypto. People lost everything from pocket change to life savings, and support desks could only shrug: *"Both Bitcoin and Bitcoin Cash are irreversible payment systems... check the receiving address."*

## Enter the "q"

The Bitcoin Cash community knew they had to do something. The fix wasn't just cosmetic — it had to be **engineered** so the mistake became impossible to make.

In late 2018, they introduced a new address format called **CashAddr**. It's the one you use today, and it looks like this:

```
bitcoincash:qzsahjm7r5d7l0vf6lp2j3x4q08xay9n6n6kxc2wzw
```

Or, more commonly, just the part after the colon, with no prefix you need to type in:

```
qzsahjm7r5d7l0vf6lq3x4q08xay9n6n6kxc2wzw
```

See that **"q"** at the start? That's the whole magic trick. CashAddr was deliberately designed so that **no Bitcoin Cash address starts the same way as a Bitcoin address.** Bitcoin addresses start with `1`, `3`, or `bc1`. CashAddr starts with a **`q`** (or a `p` for contract addresses, but we'll come back to that). The formats can no longer be confused.

It's like the postal service gave Bitcoin Cash its own postal code. You can't accidentally mail a letter meant for BCH to a BTC post office anymore — the post office can tell them apart at a glance.

## Error-Proof by Design

But the "q" is only half the story. The rest is the most nerdy-impressive part, and it's the reason the format is so safe.

Crypto addresses are long. Humans are bad at typing long strings of random characters. So CashAddr has a built-in **checksum** — a mathematical fingerprint embedded in the address itself.

Here's the part that matters for your life: if you type one character wrong, swap two letters, or your clipboard drops a digit, **your wallet will refuse to send.** It does the math, finds the checksum doesn't match, and tells you "invalid address" before a single coin leaves your pocket.

The checksum (a 40-bit BCH code, for the techies) can detect up to **6 errors** in an address — even **8 errors in a row**. This is the reason you can paste an address into a QR code, read it out loud over the phone, or type it by hand into a new wallet, and be confident it'll land in the right place or refuse to send rather than send it to the wrong one.

CashAddr also dropped the most confusing characters from its alphabet. The letters `1`, `b`, `i`, and `o` are deliberately excluded — because they're easily confused with `l`, `8`, `1`, and `0` on bad screens and sloppy handwriting. Every character left in the set is designed to be unmistakable.

And those uppercase letters? CashAddr allows uppercase so QR codes can store addresses more efficiently. But here's a neat rule: **an address must be all-uppercase or all-lowercase — never mixed.** A mixed-case address is rejected outright. Because a real, unverified address would never come to you half-shouting.

## From "Did I Just Lose My Rent?" to "Sent and Done"

The difference CashAddr makes in daily life is enormous. Consider the before-and-after experience of sending money:

**Before CashAddr (BTC-era):**
1. Copy your recipient's address
2. Paste it into the wallet
3. Hold your breath, stare at the string, pray
4. Try to compare two long strings of identical-looking characters by eye
5. Send, then obsessively refresh the explorer

**After CashAddr (BCH today):**
1. Copy the `q...` address
2. Paste it in
3. The wallet checks the checksum and instantly flags any typo
4. Double-check you've copied the whole `q`-prefix address, not an `1`-prefixed legacy one
5. Send. Done. The network is so cheap you can send even a single penny without sweating the fee.

And that last part matters more than people think. Because BCH fees are fractions of a cent, you can **receive money to a fresh address every single time** without worrying about transaction costs. Want more privacy? Generate a brand-new address for each payment. It costs nothing. The address is just a hash of your public key — a fresh one is a fresh mailbox.

## The Bottom Line: A Little Letter, a Lot of Peace of Mind

Here's the real takeaway: **good design saves your money before you even make a mistake.** The Bitcoin Cash Bandit was able to hoard six figures purely because the old system made confusion easy. CashAddr's "q" made confusion hard — and its checksum made it nearly impossible to be hurt by a typo.

So next time you're about to send some Bitcoin Cash, glance at the address. If it starts with a `q`, you're using the good stuff. Verify it pasted clean (the wallet will catch a bad one). And send without the prayer.

The chain at the moment — **964,900 blocks, 416.8 million transactions, and ~700 nodes keeping the ledger in sync** — has been hardened over years against both clever attacks and honest blunders. That one little `q` is a quiet guardian, making sure your coins arrive where you meant them to go.

Your money's envelope, sealed and addressed correctly — every single time.

---

*Want to try it yourself? Get a Bitcoin Cash wallet, watch the addresses start with "q," and notice how the app flags anything that looks off before a single coin moves. It's the small design touches that make self-custody feel as safe as a bank — without the bank.*
