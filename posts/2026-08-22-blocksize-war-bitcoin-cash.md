---
title: "The Blocksize War: How Bitcoin Cash Split from Bitcoin to Make Money Usable Again"
date: "2026-08-22"
excerpt: "In 2017, a bitter civil war over a single number — the size of a block — split Bitcoin in two. One side wanted digital gold. The other wanted digital cash. Here's the story of the fork that gave us Bitcoin Cash, and why it matters for your wallet today."
tags: ["bitcoin-cash", "bitcoin", "blocksize-war", "history", "education"]
image: "/block-blog/images/blog/2026-08-22-blocksize-war-bitcoin-cash.png"
---

# The Blocksize War: How Bitcoin Cash Split from Bitcoin to Make Money Usable Again

In 2017, the most valuable cryptocurrency in the world went to war with itself. Not over a hack, not over a scandal — over a **number**. A single, seemingly boring number: how big a block of transactions could be.

The fight got so ugly that the community split in two, and the blockchain literally forked into two separate currencies. One kept the name Bitcoin. The other became **Bitcoin Cash**.

To understand why that happened — and why it matters for your wallet today — you need to understand the war that started it all. It's a story of two visions for what money should be, and it's still being fought every time you send a payment.

## The 1MB Ceiling

When Bitcoin launched in 2009, it had no explicit limit on block size. But in 2010, its creator Satoshi Nakamoto added one: a **1 megabyte** cap on how much transaction data could fit in each block.

The reason was sensible. Every full node on the network has to download and store the entire blockchain. If blocks could grow without bound, running a node would get expensive, and only big companies could afford it. That would concentrate power — the exact thing Bitcoin was built to avoid. So Satoshi put a ceiling on it.

At the time, 1MB was plenty. Bitcoin was tiny. But here's the problem: **1MB of blocks means roughly 7 transactions per second.** That's it. Seven.

As Bitcoin grew from a curiosity into a global phenomenon, those seven transactions per second became a bottleneck. The mempool — the waiting room for unconfirmed transactions — started backing up. Fees started climbing. People waited hours, sometimes days, for a payment to confirm. At the peak of the 2017 mania, sending a single Bitcoin transaction could cost **tens of dollars** in fees.

A payment system that costs more than a coffee to send a coffee isn't a payment system. It's a museum piece.

## Two Camps, Two Visions

The community split into two camps, and they genuinely hated each other.

**The "Big Blockers"** wanted to raise the limit. Their argument was simple: bigger blocks mean more transactions, which means lower fees and faster confirmations. Bitcoin was supposed to be **peer-to-peer electronic cash** — that's literally the title of the whitepaper. To them, a Bitcoin you can't afford to spend is a Bitcoin that failed its mission. They were backed by early developers like Gavin Andresen and Jeff Garzik, by the entrepreneur Roger Ver, and by most of the mining industry.

**The "Small Blockers"** wanted to keep the chain small. Their argument was also simple: bigger blocks mean heavier nodes, which means fewer people can run them, which means the network centralizes. Instead of growing the base layer, they wanted to move transactions **off-chain** — onto second-layer systems like the Lightning Network. They were led by the Bitcoin Core developers: Pieter Wuille, Gregory Maxwell, Peter Todd, and others. To them, Bitcoin was becoming **digital gold** — a store of value, not a payment rail.

One side wanted cash. The other wanted gold. Both believed they were honoring Satoshi's original vision. They couldn't both be right.

## The Escalation

The war escalated through a series of increasingly desperate proposals.

In **2015**, developer Mike Hearn launched **Bitcoin XT**, a client that would raise the block size to 8MB and keep doubling it. It failed to gain enough support, and a disillusioned Hearn sold his coins and declared "Bitcoin failed."

In **2016**, the community tried **Bitcoin Classic** (a more modest 2MB increase). At the famous **Hong Kong Roundtable** in February 2016, miners and developers shook hands on a deal — but the agreement fell apart almost immediately, each side accusing the other of bad faith.

Then came **SegWit** (Segregated Witness), a clever soft fork that separated signature data from transaction data, effectively squeezing more capacity out of the same 1MB. It also enabled the Lightning Network. The small blockers pushed it hard. The big blockers resisted, because they saw it as a way to avoid ever raising the block size.

By **2017**, the tension was unbearable. A mysterious developer named "Shaolin Fry" proposed **BIP148**, a "user-activated soft fork" that would force SegWit through by a deadline. In May 2017, at a private meeting in New York, more than 50 companies signed the **Segwit2x** agreement: adopt SegWit *and* raise the block size to 2MB. It was a compromise meant to end the war.

It didn't.

## The Fork: August 1, 2017

On **August 1, 2017**, at block **478,559**, a group of big blockers did the unthinkable: they launched a **hard fork**. They changed the rules so that blocks could be up to **8MB**, and the new chain split away from Bitcoin forever.

That new chain was **Bitcoin Cash**.

Here's the beautiful part of how a fork works: **everyone who held Bitcoin at that moment automatically received the same amount of Bitcoin Cash.** The two chains share every block of history up to the split, then go their separate ways. If you held 1 BTC, you suddenly had 1 BTC *and* 1 BCH. It was like the network handed out free money to everyone who'd been paying attention.

The Segwit2x compromise collapsed in November 2017, when the small blockers killed the 2MB hard fork at the last minute. That's often considered the official end of the Blocksize War. But the two chains kept marching in opposite directions.

## Two Coins, Two Destinies

Today, the two coins embody the two visions that fought in 2017.

**Bitcoin (BTC)** stayed small. It's the digital gold — scarce, secure, deliberately hard to change. Its 1MB blocks still cap it at about **7 transactions per second**, and its fees can spike into the tens of dollars. It's a great store of value. It's a terrible way to buy a coffee.

**Bitcoin Cash (BCH)** went big. It raised its blocks to **32MB**, letting it process **over 100 transactions per second** — more than ten times Bitcoin's capacity. Its fees are **fractions of a cent**, and confirmations come in seconds, not hours. It's built to be spent.

The numbers tell the story. As of today, the Bitcoin Cash network has processed **over 416 million transactions** across **965,000+ blocks**, kept in sync by roughly **700 nodes** around the world. It's not a testnet or a toy — it's a working, global payment network.

## Why This Matters for Your Life

Here's the part that actually changes things for you. The Blocksize War wasn't an abstract academic debate. It was a fight about **whether ordinary people could use cryptocurrency as money**.

When you send Bitcoin Cash, you don't hold your breath. You don't watch the fee counter climb. You don't wait for hours. You send a payment worth a few cents or a few thousand dollars, pay a fee smaller than a rounding error, and it confirms in seconds. That's the difference between a technology you admire and a technology you actually *use*.

And there's a deeper lesson in the fork itself. When the two sides couldn't agree, **nobody had to win.** The big blockers didn't have to defeat the small blockers — they just went and built their own chain. That's the magic of a permissionless system: no court, no regulator, no CEO decides who's right. The users decide, by choosing which chain to run and which coins to hold.

The war that split Bitcoin in 2017 was ugly. But it proved something powerful: **in a decentralized network, you don't have to win the argument. You can just leave and build something better.**

## The Bottom Line

Here's what to remember:

1. **Bitcoin's 1MB block limit** capped it at ~7 transactions per second, driving fees sky-high and confirmations to hours.
2. **The community split** into big blockers (cash) and small blockers (gold), and neither would budge.
3. **On August 1, 2017**, the big blockers forked to create **Bitcoin Cash** with 8MB blocks — now 32MB.
4. **Everyone who held BTC got equal BCH** — the fork was a gift to existing holders.
5. **BCH is built to be spent**: over 100 tx/sec, fees of fractions of a cent, seconds to confirm.
6. **The fork proved permissionlessness**: when people disagree, they can go their own way.

The Blocksize War is history, but its two children live on. One is a vault. The other is a wallet. If you want money that moves — fast, cheap, and without asking anyone's permission — you know which one to reach for.

---

*Curious to see the difference for yourself? Get a Bitcoin Cash wallet, send a payment of any size, and watch it confirm in seconds for a fraction of a cent. Then try the same on Bitcoin and feel the difference. The war of 2017 wasn't about who was right — it was about giving you the choice.*
