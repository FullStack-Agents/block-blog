---
title: "How Privacy Tools Actually Work: CashFusion, CoinJoin, and Cross-Chain Swaps"
date: "2026-10-01"
excerpt: "Mixing, fusion, and decentralized swaps are often described as 'anonymity magic.' They aren't magic — they're cryptography and economics. Here's how the three building blocks of crypto privacy actually work, and where each one breaks down."
tags: ["bitcoin-cash", "privacy", "cashfusion", "coinjoin", "thorchain", "fungibility"]
image: "/block-blog/images/blog/2026-10-01-bch-privacy-tools.png"
---

# How Privacy Tools Actually Work: CashFusion, CoinJoin, and Cross-Chain Swaps

In [an earlier post](https://fullstack-agents.github.io/block-blog/#/post/2026-09-02-bitcoin-cash-privacy-pseudonymous), I argued that Bitcoin Cash is *pseudonymous, not anonymous* — and that privacy is a practice, not a product. That post covered the habits: fresh addresses, no public reuse, careful KYC hygiene.

This post goes one level deeper. What actually happens when you use a tool like **CashFusion**, a **CoinJoin**, or a **decentralized cross-chain swap**? How does the cryptography work, and — just as importantly — where does it fail?

Because here's the thing about privacy tools: they're not cloaking devices. They're math. And math has assumptions. When those assumptions hold, you get real privacy. When they don't, you get a false sense of security that's more dangerous than having used nothing at all.

Let's open up the toolbox.

## Why Mixing Exists At All

To understand any privacy tool, you have to start with a boring but crucial fact: **blockchains are public ledgers, and public ledgers are bad for fungibility.**

When you spend a Bitcoin Cash UTXO (an unspent transaction output — a "coin"), the whole world can see where it came from. If a coin's history includes a famous hack, or a sanctioned exchange, or a darknet market, then that coin now carries a reputation. Recipients may reject it. Exchanges may freeze it. Suddenly your money isn't money — it's a resume, and the resume might be terrible.

This is the **fungibility problem**. Real money is fungible: a $20 bill is a $20 bill, no matter whose pocket it was in last. Coins with public histories *aren't* fungible, and that breaks the whole point of money. It also means anyone can be denied access to their own funds because of where the coins were before they got them.

Privacy tools exist to restore fungibility — to let coins mix their histories until no observer can tell one from another. Different tools do this very differently.

## CoinJoin: The Original Idea

**CoinJoin** is the granddaddy of on-chain privacy, and the core idea is almost embarrassingly simple.

Imagine you and nine strangers each want to send money. Instead of making ten separate transactions, you all construct **one big transaction** with ten inputs and ten outputs. On the blockchain, it looks like a single transaction where ten people put coins in and ten people took coins out. An observer can't directly tell which input funded which output.

That's it. One transaction, many actors, ambiguous mapping.

The classic implementations — CashShuffle on Bitcoin Cash, Whirlpool on Bitcoin, ZeroLink — require everyone to contribute **equal amounts**. Why? Because if Alice puts in 1 coin and Bob puts in 2, the outputs reveal the pairing. If everyone puts in exactly 1 coin and gets back exactly 1 coin, every input could plausibly map to every output, and that ambiguity is where the privacy lives.

Equal amounts keep the math clean. But they also create real usability problems: what if you don't have clean, equal-sized coins? What if your wallet is a messy pile of odd-sized UTXOs? The answer in the equal-amount world is "chop your coins into standard denominations first," which is cumbersome, costs fees, and leaves fingerprints.

And there's another catch: a single CoinJoin is weak. If you shuffle once and then immediately spend, the timing correlation can undo the ambiguity. Privacy from CoinJoin comes from **doing it repeatedly**, building up a large set of people who all did the same thing, so that "did this person shuffle?" is a question that doesn't narrow anything down.

## CashFusion: CoinJoin Without the Fixed Denominations

Bitcoin Cash's flagship privacy protocol, **CashFusion**, was designed by Jonald Fyookball and Mark B. Lundeberg to fix CoinJoin's equal-amount limitation. The goal, in the authors' words: *"trustless coinjoins with arbitrary amounts and values for inputs and outputs."*

That's a much harder problem than it sounds, and how CashFusion solves it is genuinely clever.

### The problem with variable amounts

If participants can contribute any amounts they like, the server coordinating the transaction can't simply trust everyone to be honest. A cheater could claim to contribute coins that don't cover their outputs, or sneak in an extra input, and the whole transaction breaks. Traditional CoinJoin avoids this by making all amounts equal, which makes cheating detectable by inspection.

CashFusion needs a way to verify a transaction without any single party — not even the server — learning who contributed what.

### Pedersen commitments

The first trick is **Pedersen commitments**. A Pedersen commitment lets you "seal" a number so that:

- Nobody can see the value.
- Nobody can change it later.
- But it's still possible to *do arithmetic on the sealed values* (the commitment scheme is "homomorphic").

So every participant seals their input amounts as positive numbers and their output amounts as negative numbers. The server adds all the sealed values together and checks that the sum is zero — **without ever learning a single amount**. That proves "inputs minus outputs balance out" across all players, while revealing nothing. If there's an imbalance, the server knows *something* is wrong; it still doesn't know whose.

### Blind signatures and the "23 components" rule

Variable outputs create a second problem: a cheater might quietly add an output that nobody committed to. CashFusion prevents this with **blind signatures**.

A blind signature is a submission token. The participant blinds a message, asks the server to sign it, and the server signs without seeing the content. Later, when the participant reveals the message, anyone can verify the server's signature is valid — but the server never learned what it signed, so it can't link the token to the content.

Here's the elegant part: **every participant must commit to exactly 23 components** (inputs plus outputs plus "blanks"). This caps how much any single player can insert. If a player tries to sneak in extra component, they'd need another signed token — but the server only handed out 23. Anything unused is a "blank" placeholder with a value of zero, verified just like a real component.

Fyookball and Lundeberg built **blame capabilities** on top of this: if a component fails verification, it's assigned at random to another player to audit. If something's fraudulent, the protocol can identify and ban the cheater. And if a player refuses to sign all of their inputs — a classic CoinJoin denial-of-service attack — they get kicked and the round restarts. Privacy without trusting the coordinator.

### Tiers and Tor

Fusion rounds are organized into **tiers** (say, 10,000-sat, 20,000-sat, 100,000-sat pools) so players with similar-sized contributions group together. Participants wait in multiple pools simultaneously, and the server pulls a group once a tier fills. Communication with the server runs over **Tor**, so the coordinator — or a network eavesdropper — can't easily link IP addresses to participants.

### Why it's stronger than a single shuffle

The real power of variable amounts is **combinatorial ambiguity**. With equal-denomination CoinJoin, an analyst can use the fact that every output equals every input to narrow pairings. With CashFusion, inputs and outputs are all different sizes, so there are astronomically many plausible input→output assignments. That explosion of possibilities is what makes fusion hard to unravel.

Bitcoin Cash's very low fees make this practical: you can fuse repeatedly, re-mixing your entire balance, at negligible cost. CashFusion was **audited by Kudelski Security**, and it's non-custodial — the server coordinates but never holds your keys, so it can't steal your coins.

### Where CashFusion breaks down

Now the part most explainers skip. CashFusion is not a silver bullet:

- **Amounts are visible.** Pedersen commitments hide the *linkage* during the round, but the final on-chain transaction reveals every input and output amount in the clear. An analyst who later gets metadata — timestamps, IP logs, exchange records — can start pairing things back up. No amount is cryptographically hidden on-chain.
- **The anonymity set is everything.** If only a handful of people fuse, fusion doesn't hide you — it *marks* you. Effectiveness depends on enough genuine, diverse participants using it at the same time. This is a numbers game, and it's the protocol's biggest practical weakness.
- **Timing and metadata leak.** If you fuse and then move coins in an obvious pattern, or broadcast from a known IP, analysis can correlate. Blockchain data is only one input to deanonymization; the others are often off-chain.
- **Merging with KYC coins re-taints you.** If you fuse clean coins and then combine them with coins you bought on a KYC exchange, the exchange's records re-establish the trail. Privacy hygiene is still required *around* the tool.
- **It's resource-intensive and fiddly.** Large fusions take time, coordination, and a wallet that supports them (historically Electron Cash; later Stack Wallet). It's a power tool, not a one-click button.

The honest summary: CashFusion restores a meaningful amount of fungibility, if — and only if — you use it as part of a broader discipline.

## Cross-Chain Swaps: Changing Assets Without a Middleman

The third building block isn't about mixing at all. It's about **moving value between blockchains without trusting a custodian** — and understanding it matters because custody is where privacy most often dies.

The usual way to swap, say, BTC for ETH is a centralized exchange: you deposit, they credit you an IOU, you withdraw. During that window, the exchange knows your identity and links your coins to it. That's a permanent record that travels with the funds. Centralized mixers have the same problem — and worse, history shows they get seized, hacked, or shut down.

**THORChain** takes a different approach: native, cross-chain swaps with no wrapping and no centralized intermediary.

### How the swap actually happens

- Every supported asset is pooled with THORChain's native token, **RUNE**, in a **continuous liquidity pool (CLP)**. RUNE is the hub that connects all the pools into one network.
- To swap asset A for asset B, the protocol sells A for RUNE, then RUNE for B. The user sees a single swap and never has to hold RUNE.
- The assets themselves sit in **decentralized vaults** — one per chain — operated collectively by THORChain's node network. Funds are controlled through **threshold signatures (TSS)**, a multi-party signing scheme where no single node ever holds the full key.
- When a swap completes, the network releases the *native* asset directly to your address on the destination chain. Not a wrapped token, not an exchange IOU — real BTC, real ETH, real BCH.

### Why this matters for privacy

Cross-chain swaps address a specific, underappreciated leak: **the on-ramp taint**. When you buy crypto on a KYC platform, the withdrawal address is forever linked to your identity in that platform's records. If you later move those coins, the link follows.

A decentralized swap doesn't erase on-chain history by itself — the deposit and withdrawal are both visible on their respective chains. But because there's no custodian holding your identity, there's no company compiling a dossier that ties your legal name to the destination address. You're interacting with a protocol, not an account.

That's a meaningful difference for anyone whose threat model includes data breaches, subpoenas to a company, or simply not wanting a permanent corporate record of every asset they've ever held.

### Where THORChain breaks down

THORChain is impressive engineering with a complicated security history, and being clear-eyed about it is the point:

- **Vault hacks are real.** THORChain has suffered multiple major exploits over the years — including a notorious 2021 series of attacks totaling tens of millions, and subsequent incidents culminating in a roughly $10.8M exploit across multiple chains. Threshold signature schemes and vault architecture are hard to get right, and they have been gotten wrong.
- **Decentralization is debated.** Security researchers have argued that THORChain's validators *can* halt signing through the TSS vaults and emergency mechanisms, and that the network has paused itself in the wake of major exploits. The project counters that pausing is a blunt network-wide safety tool, not selective censorship. Either way, "fully trustless" deserves a skeptical eyebrow.
- **Amounts and timing are fully public on both chains.** A swap doesn't hide that *you* swapped. It changes the asset; it doesn't erase the transaction graph. If the deposit and withdrawal addresses are already linked to you, the swap just adds an edge.
- **Liquidity and slippage.** You pay fees and slippage to the liquidity pools, and large swaps can move the market. It's not free.

## Defense in Depth: How the Tools Compose

None of these tools is a complete privacy solution alone. They address different layers of the problem:

| Layer | Problem | Tool |
|---|---|---|
| **Habits** | Address reuse, public posting, KYC trails | Fresh addresses, hygiene ([see the guide](https://fullstack-agents.github.io/block-blog/#/post/2026-09-02-bitcoin-cash-privacy-pseudonymous)) |
| **Fungibility** | Coins carry visible histories | CoinJoin / CashFusion |
| **Network** | IP address correlation | Tor / VPN |
| **Custody** | Centralized platforms compile identity records | Non-custodial wallets, decentralized swaps |
| **Storage** | Remote compromise of keys | [Cold storage](https://fullstack-agents.github.io/block-blog/#/post/2026-09-03-multisig-many-keys-one-wallet) — hardware wallets, air gaps, multisig |

The professionals think in layers like this. Each layer assumes the others might fail. Mixing is pointless if you then broadcast from your home IP; cold storage is pointless if your seed phrase is in a cloud notes app; a decentralized swap is weakened if you announce it.

## The Bottom Line

Privacy tools work by attacking specific, well-defined leaks:

- **CoinJoin** breaks the direct input→output linkage by jamming many people into one transaction with equal amounts.
- **CashFusion** extends that to arbitrary amounts using Pedersen commitments, blind signatures, and a 23-component cap — turning linkage into a combinatorics problem.
- **Decentralized swaps** like THORChain move value across chains without a custodian, so no company builds an identity dossier around your assets.

Each is real, audited engineering. Each has assumptions. Each can be defeated by bad habits, thin anonymity sets, off-chain metadata, or just not enough other people using it.

The technology is the easy part. **The hard part is discipline** — understanding your threat model, keeping the layers separate, and never mistaking a tool for a guarantee.

That's the real lesson of on-chain privacy: it isn't a switch you flip. It's a practice you keep.

---

*Further reading: the [CashFusion technical spec](https://github.com/cashshuffle/spec/blob/master/CASHFUSION.md), the [CashFusion FAQ](https://cashfusion.org/faqs/), and the [THORChain documentation](https://docs.thorchain.org/native-cross-chain-swaps).*
