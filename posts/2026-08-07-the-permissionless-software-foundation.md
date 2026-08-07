---
title: "The Permissionless Software Foundation: The Quiet Builders of a Censorship-Proof Internet"
date: "2026-08-07"
excerpt: "A community of JavaScript developers is quietly building the building blocks for a permissionless internet — money, messaging, file hosting, and databases that no government or corporation can switch off. Here's who they are and why it matters for you."
tags: ["permissionless-software-foundation", "bitcoin-cash", "cash-stack", "censorship-resistance", "open-source", "decentralization"]
---

# The Permissionless Software Foundation: The Quiet Builders of a Censorship-Proof Internet

There's an organization you've probably never heard of that's trying to build the internet's escape hatch. It's not a giant tech company with a campus and a logo on every billboard. It's a loose community of JavaScript developers, entrepreneurs, and businesses who share one stubborn belief: **software should be permissionless**.

They call themselves the **Permissionless Software Foundation** (PSF). And the software they build is designed to do one thing above all else — make it impossible for anyone to switch you off.

## What does "permissionless" even mean?

Think about the apps you use every day. Your bank can freeze your account. Your social media platform can shadow-ban you. Your cloud provider can delete your data. Your payment processor can cut you off. In every case, you're operating **at someone's permission** — and that permission can be revoked at any time, for any reason, with no appeal.

The PSF's mission is to build software where that's structurally impossible. Their stated goal is to "help individuals protect their privacy, circumvent censorship, and engage in economic activity." Not by asking nicely, but by building tools where there's no central switch to flip.

The software they maintain covers the primitives of a free digital life:

- **Censorship-resistant money** — Bitcoin Cash
- **Censorship-resistant networking** — IPFS
- **Censorship-resistant file hosting** — IPFS pinning
- **Censorship-resistant databases** — the Pay-to-Write Database
- **End-to-end encrypted messaging** — Nostr
- **Token creation and management** — CashTokens
- **A decentralized exchange** — for buying and selling tokens

Individually, each is a tool. Together, they're a complete, parallel stack for running a business or a life without asking anyone's permission.

## The Cash Stack: software like Lego blocks

The PSF's signature project is the **Cash Stack** — a framework for building web and phone apps on Bitcoin Cash and other UTXO blockchains. It's inspired by the OSI model (the 7-layer way computer networks are taught), and it organizes blockchain software into layers:

1. **Application** — the wallet, social app, or trading app you actually use
2. **Interface Library** — libraries like `bch-js` that apps call
3. **API** — REST or JSON RPC servers
4. **Indexers** — "search engines" for blockchain data (like Fulcrum, which tracks balances and transaction history)
5. **Full Nodes** — the base software that verifies and broadcasts blocks

The clever part is that the pieces are interchangeable, "orchestrated much like Lego blocks." You can swap out an indexer, run a different node, or plug in a different blockchain — the stack keeps working. It's a modular toolkit, not a monolith.

## The Web 3 trick: run the heavy stuff at home

Here's where the PSF gets genuinely clever — and where it saves real money.

In the traditional "Web 2" model, a blockchain app needs a full node, an indexer, and an API server running in the cloud. That costs about **$50 a month** per instance, and it's a single point of failure: a cloud provider can shut it down, or a government can pressure the host.

The PSF's "Web 3" architecture inserts two mirror-image pieces into the middle of the stack — an **IPFS Service Consumer** and an **IPFS Service Provider**. This decouples the expensive, compute-heavy back end and lets it run on a **home internet connection** instead of a cloud server.

The result is dramatic:

| Metric | Web 2 Model | Web 3 Model |
| :--- | :--- | :--- |
| **Monthly Cloud Cost** | ~$50 | **~$4** |
| **Hardware Cost** | $0 (ongoing) | ~$400 (one-time) |
| **Break-even Point** | N/A | ~8 months |
| **Total Cost Reduction** | — | **92%** |

That's a **92% reduction** in recurring costs. And because IPFS automatically handles the networking (using something called *circuit relays* to tunnel through firewalls), the whole setup is **extremely resistant to censorship**. If one instance goes offline, the app can simply connect to another one on the network. There's no single throat to choke.

This matters more than you might think. It means a hobbyist in a developing country — where $50 a month is a fortune — can run a real blockchain service from a $400 desktop. It lowers the barrier to entry from "you need venture capital" to "you need a decent computer."

## The circular economy: a token that funds the builders

Here's the part that makes the PSF unusual: it's not a charity, and it's not a corporation. It's a **community governed by token holders**, running on a circular economy.

The PSF has its own token (also called PSF, a CashToken on Bitcoin Cash). Some of the PSF's software **consumes PSF tokens during operation** — for example, writing to the Pay-to-Write Database requires **burning PSF tokens**. That burn creates a real, ongoing demand for the token, which funds the open-source contributors who build and maintain the software.

It's a self-sustaining loop: developers build infrastructure → businesses use it and burn tokens → the burn funds the developers → the infrastructure gets better. The PSF aspires to be the first **Decentralized Autonomous Organization (DAO) on the Bitcoin Cash blockchain** — an organization with no CEO, run by its token holders.

## Built for developers, to inspire entrepreneurs

The PSF is refreshingly honest about who it builds for: **developers, not end users**. It produces infrastructure, specifications, and demo apps — like `wallet.fullstack.cash` and `dex.fullstack.cash` — to *inspire* developers and entrepreneurs to take the software to the next level and build the polished, profitable end-user experiences.

This is a deliberate philosophy, influenced by books like *Working in Public* by Nadia Eghbal and *Healthy Open Source* by Mikeal Rogers. The idea is that the foundation shouldn't try to be everything to everyone. It builds the plumbing; the community builds the houses.

## Why this matters for your life

So what does any of this have to do with you?

Because the tools the PSF builds are the **escape hatches** for the rest of us. When a bank freezes your account, when a platform deletes your content, when a government blocks a service — the PSF's software is what you'd reach for. It's the difference between being a *tenant* on the internet and being an *owner*.

- **Your money** can't be frozen if it's in a self-custody Bitcoin Cash wallet.
- **Your messages** can't be read if they're end-to-end encrypted on Nostr.
- **Your data** can't be deleted if it's pinned to IPFS.
- **Your business** can't be cut off if it runs on the Cash Stack.

None of this requires you to be a developer. It just requires the software to exist — and that's exactly what the PSF is building, one open-source repository at a time.

## The bottom line

The Permissionless Software Foundation is proof that a small, passionate community can build a real alternative to the permissioned internet — not by fighting the system, but by building a parallel one. It's money you can't be cut off from, messaging no one can read, files no one can delete, and a database no one can censor.

You don't have to join the Telegram channel or hold the token to benefit. You just have to know the tools exist — and that the next time someone tries to switch you off, there's a permissionless way out.

---

*Want to go deeper? Read about the [Cash Stack and the "cloud tax"](#/post/2026-08-05-the-cloud-tax-web3-ipfs), learn how [Bitcoin Cash is sound money](#/post/2026-08-06-the-21-million-question-sound-money), or explore the [BCH Education section](#/education) for the fundamentals.*
