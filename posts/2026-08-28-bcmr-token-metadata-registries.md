---
title: "How Tokens Get Their Names: The Bitcoin Cash Metadata Registry"
date: "2026-08-28"
excerpt: "Ever wonder how your wallet knows a token's name, logo, and ticker? It's the Bitcoin Cash Metadata Registry (BCMR) — a decentralized, censorship-resistant standard that gives every token an identity you can actually verify."
tags: ["bitcoin-cash", "cashtokens", "tokens", "nft", "bcmr", "metadata"]
image: "/block-blog/images/blog/2026-08-28-bcmr-token-metadata-registries.png"
---

# How Tokens Get Their Names: The Bitcoin Cash Metadata Registry

Open your wallet and scroll through your tokens. There's a coin with a friendly name, a little logo, a ticker symbol like "PUSD" or "VOTE." It all looks so clean and obvious — like the token was born with that name stamped on it.

But here's the thing: **on the blockchain, a token is just a number.** A category ID, a pile of unspent outputs, a commitment. The name, the icon, the description — none of that lives on-chain. So where does it come from?

That's the job of the **Bitcoin Cash Metadata Registry (BCMR)**: the quiet standard that gives tokens their names, logos, and — most importantly — their *trust*. It's the reason your wallet can tell a real token from a scam copycat, and it's one of the most underrated pieces of the Bitcoin Cash ecosystem.

Let's pull back the curtain.

## The Problem: A Token Is Just a Number

When someone mints a CashToken on Bitcoin Cash, the blockchain records the *math* — the category ID, the supply, the rules for spending it. It does **not** record "this is the PUSD stablecoin, here's its website, here's its logo."

That's actually a feature. Keeping metadata off-chain keeps blocks small, fees near zero, and the network fast. But it creates a problem: **how do wallets know what a token is?**

If every wallet just made up its own names, chaos would follow. One wallet would call a token "PUSD," another would call it "Paryon," and a scammer could mint a token with the same category ID and label it "PUSD" to trick you into sending real money to the wrong place.

We needed a standard way to attach *authenticated* metadata to on-chain artifacts — names, descriptions, icons, ticker symbols — that any wallet could fetch and verify. That standard is **BCMR**.

## What Is a BCMR?

A Bitcoin Cash Metadata Registry is, at its heart, **an authenticated JSON file** containing metadata about tokens, identities, and contract applications. It's a structured, extensible schema that maps on-chain "identities" to human-friendly information.

Think of it as the **phone book of the token world** — but a phone book that's cryptographically verifiable, so you know the number you're dialing actually belongs to the person you think it does.

The BCMR standard (CHIP-2022-10) was proposed by Jason Dreyzehner and is maintained as part of the CashTokens ecosystem. It's designed to be:

- **Extensible** — a baseline JSON schema that every wallet understands, with room for vendors to add their own extensions.
- **Decentralized** — anyone can publish a registry, no approval process required.
- **Censorship-resistant** — registries can be authenticated via DNS *or* via on-chain transactions, so no single authority can yank a token's identity.
- **Verifiable** — clients can prove a registry is authentic, not a forgery.

## How a Token Gets Its Name: Three Ways

BCMR gives wallets three ways to acquire and authenticate a registry. Each has its own trade-offs.

### 1. DNS-Resolved Registries (the "website" way)

The simplest approach: a registry is published at a well-known URL on a domain you control.

```
https://yourdomain.com/.well-known/bitcoin-cash-metadata-registry.json
```

Trust is bootstrapped from the **domain name**. If you already trust `example.com`, you can trust the registry it publishes. It's the same trust model as the web — which makes it easy to adopt, but it inherits the web's weaknesses too (a domain can be seized, hijacked, or censored).

### 2. Chain-Resolved Registries (the "on-chain" way)

This is where BCMR gets really clever. Instead of trusting a domain, the registry's identity is anchored **directly on the Bitcoin Cash blockchain** via a chain of transactions called an **authchain**.

Here's the elegant part: every BCH transaction has an "identity output" at index 0. A chain of transactions where each one spends the previous one's identity output forms an **authchain**. The first transaction is the **authbase** (the root of trust); the latest one with an unspent identity output is the **authhead**.

The authhead transaction publishes a **SHA-256 hash** of the registry (and optionally a URI where it's hosted). A wallet fetches the registry, hashes it, and checks it matches the hash on-chain. If it matches, the registry is authentic — **and every client sees the exact same registry**, because the hash is committed to the blockchain.

This gives you:
- **Stronger security** — identities are controlled by unspent outputs, so they can use the same security as funds: multisig vaults, offline signers, time-delayed fallbacks.
- **No targeted attacks** — a malicious server can't serve you a different registry than everyone else, because the hash is public.
- **Real-time updates** — identity changes are broadcast by spending the identity output, detectable with standard light-wallet infrastructure.

### 3. Embedded & Manually-Imported Registries

Wallets can ship with a **default embedded registry** (a curated set of known tokens) and let advanced users **manually import** registries from files or URLs. This is the "trusted seed" that gets you started before you've fetched anything.

## What's Actually in a Registry?

A BCMR maps identities to **snapshots** — timestamped records of metadata. A snapshot can include:

- **Name** and **description**
- **Ticker symbol** and **decimals** (for fungible tokens)
- **Icons and images** (SVG recommended, or AVIF/WebP/PNG)
- **Links** — website, blog, chat, forum, support
- **Tags** — classifying the identity as a token, wallet, exchange, stablecoin, collectable, governance, etc.

It also handles **NFTs** beautifully. Registries can define how to interpret an NFT's "commitment" — the data baked into the token. For a **sequential NFT** (like a numbered art collection), the commitment maps to an index in the registry. For a **parsable NFT** (like a ticket or a crowdfunding pledge), the registry provides bytecode to decode structured fields — seat number, pledge value, and so on.

That's how a wallet can show you a **table of your open DEX orders** with "Total BCH Order Value," or a **gallery of your collectable NFTs** with images and metadata, or your **tickets** with time, date, seat, and gate — all rendered from data encoded in the tokens themselves.

## Why This Improves Your Life

Here's the part that matters: **BCMR is what makes tokens feel real.**

Without it, your wallet would show you a wall of meaningless category IDs. With it, you get a clean, trustworthy interface — and more importantly, **protection from scams**. Because the metadata is authenticated, a wallet can flag a token that *claims* to be something it isn't. You can verify you're holding the genuine article, not a lookalike.

It also means **anyone can build a token or identity without asking permission**. No approval process, no gatekeeper, no corporate registry. You mint your token, publish a registry, and the whole ecosystem can recognize it. That's permissionless innovation in action.

And because registries can be anchored on-chain, they're **censorship-resistant**. No government, company, or platform can quietly delete a token's identity or rewrite its history. The metadata is as durable as the blockchain itself.

## The Bottom Line

The Bitcoin Cash Metadata Registry is the invisible layer that turns raw blockchain numbers into a usable, trustworthy token economy. It's the phone book, the ID card, and the authenticity stamp all rolled into one — decentralized, verifiable, and open to everyone.

Next time you open your wallet and see a token with a friendly name and a logo, take a second to appreciate the machinery underneath. That name isn't magic. It's a registry — and it's yours to use, verify, and build on.

Want to dig deeper? The full BCMR specification lives at [cashtokens.org/docs/bcmr](https://cashtokens.org/docs/bcmr/chip/), and the CashTokens docs have practical examples of fungible tokens, NFT collections, and dApp metadata. Go build something with a name on it.
