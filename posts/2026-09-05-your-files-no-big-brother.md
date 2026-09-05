---
title: "Your Files, No Big Brother: Permanent Storage on a Permissionless Network"
date: "2026-09-05"
excerpt: "Every file you store online lives on someone else's server, under someone else's rules — and can vanish without warning. A permissionless pinning network built on Bitcoin Cash lets you store files permanently, censorship-resistant, for about a penny per megabyte. Here's how it works."
tags: ["ipfs", "decentralization", "bitcoin-cash", "storage", "censorship-resistance", "self-custody"]
image: "/block-blog/images/blog/2026-09-05-your-files-no-big-brother.png"
---

# Your Files, No Big Brother: Permanent Storage on a Permissionless Network

Let's play a game. Think of the most important file you have online — a family photo album, a business contract, a piece of creative work you spent months on. Now ask yourself one uncomfortable question:

**Who actually owns it?**

Not you. Not really. You own a *link* to it. And links are fragile things.

## The internet is quietly falling apart

There's a name for what happens when a link stops working: **link rot**. It's not rare. It's everywhere.

Researchers have found that [roughly half of the links in US Supreme Court opinions](https://www.theverge.com/2013/9/24/4765048/half-of-supreme-court-opinions-contain-broken-links) have rotted away. Half. The most important legal documents in the country point to pages that no longer exist. A 2021 study of [over half a million links in news articles](https://www.nytimes.com/2021/05/25/technology/nyt-news-links.html) found that a quarter of them had broken within a few years.

Why? Because the web is built on **location addressing**. A URL doesn't tell you *what* a file contains — it tells you *where* it happens to live. `example.com/photos/our-wedding.jpg` is a street address, not a name. If the server moves, the folder gets renamed, the company shuts down, or the platform decides your content violates its terms — the address goes dead.

And that's before we even get to the part where someone *deliberately* deletes your stuff.

## You don't rent storage. You rent permission.

Here's the uncomfortable truth hiding behind every cloud drive and social platform: **your files exist at the pleasure of a corporation.**

- A platform can [delete your account and everything in it](https://www.eff.org/deeplinks/2022/12/twitter-suspends-accounts-linking-other-social-networks) because you linked to a rival service.
- A cloud provider can [terminate your account](https://www.vice.com/en/article/yp3w5j/aws-suspended-a-crypto-startups-account-for-no-apparent-reason) for reasons it never fully explains.
- A hosting company can be [forced to take down content](https://www.eff.org/deeplinks/2021/01/parler-takedown-and-clouds-role-censorship) by a government or a court order.

None of this requires you to have done anything wrong. It's just the nature of the deal. When your data lives on someone else's server, under someone else's terms, you're not a customer — you're a tenant. And tenants can be evicted.

So what's the alternative? What if your files could live *nowhere* and *everywhere* at once — addressed by what they are, not where they sit, and kept alive by a network that no single company controls?

That's exactly what a **permissionless pinning network** built on Bitcoin Cash makes possible.

## The trick: address the content, not the location

The first half of the solution is a technology called **IPFS** — the InterPlanetary File System. It flips the web's addressing model on its head.

Instead of a URL that points to a *location*, IPFS gives every file a **Content Identifier (CID)** — a cryptographic fingerprint of the file's exact contents. The same file, added to any node anywhere, always produces the same CID. Change a single byte, and you get a completely different CID.

This is called **content addressing**, and it changes everything:

- **No link rot.** A CID doesn't depend on a server staying up or a folder keeping its name. As long as *anyone* on the network has the file, the CID can fetch it.
- **Tamper-proof.** Because the CID is a hash of the content, you can always verify that what you're getting is exactly what was stored. Nobody can silently swap in a doctored version.
- **No vendor lock-in.** Your file isn't trapped in one company's silo. It's addressable by anyone, from anywhere.

But here's the catch — and it's an important one. **Content addressing alone doesn't keep your file alive.**

## The catch: files need someone to hold them

IPFS nodes have a garbage-collection process. If a file isn't *pinned* — deliberately marked for permanent retention — it can be swept away when a node clears its cache. A CID is a promise that the file *can* be found. But somebody has to actually hold a copy.

In the old model, you'd solve this by paying a company like Pinata or Filebase to pin your files. That works — until the company changes its pricing, gets acquired, or decides your content is too spicy to host. You're back to renting permission.

The Permissionless Software Foundation (PSF) — the group behind the [Cash Stack](https://cashstack.info) toolkit for building on Bitcoin Cash — decided there had to be a better way. So they built one.

## The PSF File Pinning Protocol: storage with no landlord

The [PSF File Pinning Protocol (PSFFPP)](https://psffpp.com) is a **permissionless marketplace for file retention**. It's a mesh network of independent pinning nodes, modeled after the Bitcoin network itself. And it's paid for in a way that has no accounts, no API keys, and no one who can revoke your access.

Here's how it works, in five steps:

1. **Upload.** You add your file to the IPFS network, which generates its unique CID.
2. **Burn.** You permanently destroy a small amount of **PSF tokens** — the protocol's native currency — in a "proof of burn" transaction. The cost targets about **$0.01 per megabyte**, with a one-year renewable hosting guarantee.
3. **Claim.** You broadcast a **Pin Claim** on the Bitcoin Cash blockchain — a tiny transaction that records the CID, the burn proof, and the filename.
4. **Detect & validate.** Every pinning node on the network watches the blockchain for new Pin Claims. Each node independently verifies that you burned enough PSF tokens for the file's size.
5. **Pin.** Valid files get downloaded and pinned across multiple independent nodes around the world — redundant, censorship-resistant, and no single point of failure.

Notice what's missing from that list: **no account, no subscription, no permission.** You don't ask anyone for access. You burn tokens, broadcast a claim, and the network does the rest. It's the same permissionless philosophy that makes Bitcoin Cash itself work — applied to your files.

The economics are deliberately simple. Files up to **100MB** are accepted (the minimum payment covers 1MB). A dollar's worth of BCH and PSF tokens is enough to pin several megabytes. And because the payment is a *burn* — tokens destroyed forever — it can't be clawed back, and it can't be censored. The network is paid, the file is pinned, and nobody can undo it.

## What this means for your actual life

This isn't abstract infrastructure. It's a tool you can use today, and it solves real, everyday problems:

- **Family photos that outlive the platform.** Upload your photo archive once, pin it, and the CIDs are permanent. No more worrying that a free photo service will shut down and take your memories with it.
- **Important documents that can't be quietly deleted.** Contracts, receipts, certificates, medical records — pinned files are tamper-evident and censorship-resistant. You can prove what was stored, and when.
- **Creative work that stays yours.** Writers, artists, and musicians can pin their portfolios to a network that no platform can take down for "policy violations."
- **Tokenizing data.** Apps like [TokenTiger.com](https://tokentiger.com) let you upload an image, PDF, or zip file and mint a token that links the file to the blockchain — with the file itself hosted on the PSFFPP network. Your data becomes a first-class, ownable asset.

You can try it right now. The [PSFFPP explorer](https://explorer.psffpp.com) is a web interface for uploading files and generating Pin Claims — think of it as a block explorer for your data. Load it with a few cents of BCH and PSF tokens, and you're in business.

## The bottom line

For the last thirty years, we've stored our most important digital possessions in buildings owned by other people. We've called it "the cloud," as if it were weather — something that just exists, beyond anyone's control. It isn't. It's a collection of servers, each with an owner, each with terms of service, each with a kill switch.

A permissionless pinning network changes the deal. Your files are addressed by what they are, held by a network no single company controls, and paid for in a way that can't be revoked. No landlord. No eviction. No big brother.

Your files, your rules. That's the whole point.

---

*Want to go deeper? The [PSF File Pinning Protocol](https://psffpp.com) is open and documented, and the [PSF](https://psfoundation.info) builds the Cash Stack toolkit that makes this kind of permissionless infrastructure possible. If you're new to Bitcoin Cash, [start here](#/post/2026-08-27-your-first-bitcoin-cash).*
