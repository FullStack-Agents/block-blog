---
title: "Pay-Per-Request: How Bitcoin Cash Turned Every API Into a Coin-Operated Machine"
date: "2026-08-03"
excerpt: "The HTTP 402 status code sat ignored for 30 years. Now an open standard called x402—and a Bitcoin Cash flavor called x402-bch—lets any API charge a tiny fee per request. Here's how it works and why it matters for your wallet."
tags: ["bitcoin-cash", "x402", "payments", "api", "micropayments", "decentralization"]
---

# Pay-Per-Request: How Bitcoin Cash Turned Every API Into a Coin-Operated Machine

Back in 1997, the people designing HTTP—the protocol your browser uses every second—left a tiny, strange placeholder in the spec. Status code **402**. "Payment Required." Nobody knew exactly what it should do, so it just sat there, unused, for nearly thirty years. A ghost in the machine.

Then, in 2025, someone finally gave the ghost a body. And on Bitcoin Cash, a team quietly built it a coin slot.

Let's talk about **x402**, the internet's new pay-per-request economy, and the BCH-flavored version that lets a two-person startup and a Fortune 500 API charge the same way: one tiny payment, per call, no account required.

---

## The Old Way: Subscriptions Are a Lie for Machines

Think about how you pay for software today. Almost always, it's a subscription. You hand over your card, you get a key, and you pray you use enough to justify the monthly bill. If you don't, you overpay. If you suddenly need a burst of usage, you're throttled.

Now imagine an **AI agent** — a bot that's doing a task for you across a hundred different services. It needs weather data from one API, a company's funding history from another, and a database lookup from a third. A subscription model is a nightmare for it. It doesn't use services on a monthly schedule. It uses them in **bursts**.

This is the problem Coinbase set out to solve when it launched **x402** in 2025. The pitch was simple and a little beautiful: let money move at the speed of the internet, per request, with **no accounts, no API keys, and no KYC**. Just an HTTP request, a price, and a payment.

Here's the thing, though — the original x402 settled in USDC on EVM chains like Base. Stablecoin rails, account-model thinking. But there's another world, a UTXO world, where a different flavor of the same idea took root. That's where **x402-bch** comes in.

---

## What Actually Is x402? (The 30-Second Version)

x402 is an **open, neutral standard** for internet-native payments. It works because the internet already has a built-in "you owe me" signal: the long-dormant HTTP 402 status code. x402 finally gives that code a real job.

The dance goes like this:

1. A client (your app, or your AI agent) sends a normal HTTP request.
2. The server replies with **402 Payment Required**, plus the price, the currency, and where to send the money.
3. The client's wallet pays, instantly.
4. The client retries the request with a payment header.
5. The server verifies the payment and hands over the data.

One round trip. The payment **is** the authorization — no separate login, no key to leak. It's "a card reader for agents instead of humans," as one explainer put it. A shop turns on card payments so people can buy; x402 turns on the same service so machines can buy, no human in the loop.

Because x402 is blockchain-agnostic and free of protocol fees, it's grown fast. By 2026 the **Linux Foundation** launched the **x402 Foundation** to steward the standard — so it isn't Coinbase's product any more than TCP/IP belongs to one company. Millions of transactions later, it's production-ready and audited.

---

## The Bitcoin Cash Twist: Pay a Batch, Then "Check My Tab"

Here's where it gets fun for BCH fans. The original x402 was designed around Ethereum-style ERC-20 transfers and EIP-712 signatures. But Bitcoin Cash works differently — it's a **UTXO** blockchain, where value lives in unspent transaction outputs. The team behind the Cash Stack adapted the whole idea to BCH's model, and the result is genuinely clever.

The Bitcoin Cash adaptation, **x402-bch**, keeps the three main actors — **Client, Server, and Facilitator** — but reorients everything around BCH's strengths:

- **No custody.** In x402-bch, the Facilitator never holds a wallet. Clients pay **directly to the server's BCH address**, and the Facilitator's only job is to *validate* that the money is real and still there. Trust stays in the smallest, simplest place.
- **Batch payments, tiny fees.** Instead of broadcasting one on-chain transaction per call (which would eat into a 2-cent charge with fees), a client sends a single **funding transaction** that creates a reusable UTXO. Then it "debits" against that prepaid balance with each request. One on-chain payment funds hundreds of calls. This dramatically cuts fees.
- **Lightweight signatures.** No heavy EIP-712 machinery. x402-bch uses BCH's built-in `signMessage`/`verifyMessage` primitives. Simple, fast, battle-tested.
- **"Check my tab" mode.** This one is delightful. Instead of telling the server exactly which UTXO to spend from, a client can just say *"figure it out for me."* It sets `txid: "*"`, and the Facilitator automatically picks an available UTXO and tracks how much of the "tab" is left. Like walking into a bar, ordering all night, and having the bartender keep the running tally.

The result: a micro-payment rail where a call can cost **200 satoshis** — a fraction of a cent — and still be economical, because the on-chain cost is amortized across many requests.

---

## Where This Actually Shows Up

You don't need a lab to see x402-bch in action. It's baked into the Cash Stack's flagship API server, **psf-bch-api** — the heart of the BCH developer stack. It sits on top of a BCHN full node, a Fulcrum indexer, and an SLP token indexer, and it exposes the blockchain to developers as simple HTTP calls.

Flip on x402 payments, and the server transforms into a self-service toll booth:

- Set `X402_ENABLED=true`, point it at your BCH address, and every call under `/v6` costs a small BCH micro-payment.
- Client libraries like **bch-js** handle the 402 handshake automatically — the developer doesn't even have to think about it.
- The server even publishes machine-readable menus: `/.well-known/x402`, `openapi.json`, `llms.txt`, and `agent.json`. Your AI agent can read the menu, see the price, and decide whether to pay.

And there's a genuinely useful hybrid mode: **combine x402 with a Bearer token**. Give your trusted partners a free token; charge the general public per call. One API, two economies.

---

## Why This Improves Your Life

Okay, the technology is cool. But why should *you* care?

**If you're a builder:** You can now monetize an API without building a billing system, a Stripe integration, a user database, or a pricing page. Add one line of middleware, and the internet pays you. The two-person shop and the enterprise get the same rail. That's the open-internet model applied to payments.

**If you're a user:** No more signing up for yet another service just to try it. No more "free tier" games. You (or your agent) pay exactly for what you use, a fraction of a cent at a time, and you never hand over a credit card. Censorship resistance comes along for free — no gatekeeper decides who's allowed to sell.

**If you hold BCH:** This is real, on-chain utility. Every x402-bch call is a real BCH transaction moving real value. The more the machine-to-machine economy grows, the more BCH becomes the settlement layer underneath it. It's not speculative promise — the code is live, open-source, and running today.

---

## The Honest Caveats

x402 is still early. Not every API answers with a 402 yet, and services that don't support it still need a traditional key. Adoption is growing — by mid-2026, well over 200,000 services were listed as x402-enabled across Base and Solana — but the BCH side is younger.

There's also the question of *coverage and control*. Because an agent can spend on its own, you'd want per-call and per-session caps so a runaway loop can't drain a balance. And settlement finality depends on the chain — though BCH, like Base and Solana, confirms in seconds or less.

None of these are dealbreakers. They're the normal edges of infrastructure that's still being built.

---

## The Bottom Line

HTTP 402 sat as a placeholder for three decades because nobody could agree on what "Payment Required" should actually mean. x402 gave it a meaning. Bitcoin Cash gave it a coin slot.

The internet's original sin was that money wasn't native to it — you could move information anywhere in milliseconds, but value needed forms, approvals, and days of settlement. x402 fixes that. And x402-bch proves the fix works even on a UTXO blockchain, with no custody, tiny fees, and a bartender who remembers your tab.

So next time you see a `402` in your logs, don't ignore it. It's not an error. It's the internet finally learning how to take a payment.

---

*Want to dig deeper? Check out the [x402 open standard](https://x402.org), the [x402-bch implementation](https://github.com/x402-bch/x402-bch), and the [psf-bch-api server](https://github.com/Permissionless-Software-Foundation/psf-bch-api) that puts it to work on the Cash Stack.*
