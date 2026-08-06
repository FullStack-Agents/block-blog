---
title: "The Bitcoin Cash Network"
date: "2026-08-06"
order: 5
description: "How the Bitcoin Cash network actually works — the peer-to-peer mesh of equal nodes, full nodes vs. lightweight SPV wallets, network discovery and the handshake, and the mempool."
source: "mastering-bitcoin-cash"
video: "https://youtu.be/vUJV5C0rukk"
tags: ["Bitcoin Cash", "network", "P2P", "nodes", "SPV"]
---

# The Bitcoin Cash Network

Bitcoin Cash is not a website or a service that you connect to — it's a **peer-to-peer (P2P) network**: a global mesh of independent computers that talk to each other directly. When you send or receive BCH, no company, server, or central authority carries your money. Instead, your transaction is handed from node to node across the network until every participant has seen it.

In this lesson we'll look at how that network is organized, the different kinds of nodes that make it up, and how they discover each other, stay in sync, and relay your payments.

## A network of equals

The Bitcoin Cash network is built on a **flat, peer-to-peer topology**. Every participating computer is a *peer* — technically equal to every other, with no "special" nodes, no server, no hierarchy. Nodes both *provide* and *consume* network services at the same time, with reciprocity acting as the incentive for participation.

This isn't just an implementation detail. Bitcoin Cash is a *peer-to-peer digital cash system* **by design**, and the network architecture is both a reflection and a foundation of that core trait. Decentralization of control can only be achieved and maintained by a flat, decentralized consensus network. The early Internet worked the same way: nodes on the IP network were all equal, and although today's Internet has become more hierarchical, its underlying protocol still retains that flat-topology essence.

> The term **"Bitcoin Cash network"** refers to the collection of nodes running the Bitcoin Cash P2P protocol. Beyond that core protocol, there are extended protocols like **Stratum** (used by mining pools and lightweight wallets) and gateway servers that bridge them to the main network. Together these form the *extended Bitcoin Cash network*.

## The four functions of a node

A Bitcoin Cash node is a collection of functions: **routing**, the **blockchain database**, **mining**, and **wallet** services. A full node that carries all four is shown below — the routing function is the orange "Network Routing Node," the blockchain database is the blue "Full Blockchain," the miner is the black "Miner," and the wallet is the green "Wallet."

![A Bitcoin Cash network node with all four functions: wallet, miner, full blockchain database, and network routing](/block-blog/images/mastering-bitcoin-cash/msbt_0601.png)

Every node includes the **routing** function just to participate: routing nodes validate and propagate transactions and blocks, and discover and maintain connections to peers. The other functions are optional and depend on the node's role.

## Node types and roles

Although all nodes are equal peers, they take on different roles depending on which functions they run:

- **Full nodes** maintain a complete, up-to-date copy of the entire blockchain. Because they hold every transaction from the genesis block onward, they can **autonomously and authoritatively verify any transaction** without relying on any other system. This is the "pure Bitcoin Cash experience" — complete independence and freedom from central authority.
- **Lightweight (SPV) nodes** store only a small subset of the blockchain — just the *block headers* — and verify payments using a method called **simplified payment verification** (more below). This makes them ideal for resource-constrained devices like smartphones. SPV wallets are becoming the most common kind of Bitcoin Cash node.
- **Mining nodes** compete to create new blocks by running specialized hardware to solve the proof-of-work algorithm. Some are also full nodes; others are lightweight pool participants that depend on a pool server.
- **Edge routers** are full nodes run by enterprises (exchanges, wallet services, block explorers, payment processors) that interface with the network on behalf of their users, without mining or wallet functions.

![Different types of nodes on the extended Bitcoin Cash network](/block-blog/images/mastering-bitcoin-cash/msbt_0602.png)

### The extended network

The **extended Bitcoin Cash network** adds specialized protocols on top of the core P2P network. **Pool servers** connect many mining nodes to the main network via mining-pool protocols, and **gateway routing servers** bridge the P2P protocol to other protocols such as **Stratum**, which lightweight wallets and mobile clients use to reach the network without running a full node.

![The extended Bitcoin Cash network showing various node types, gateways, and protocols](/block-blog/images/mastering-bitcoin-cash/msbt_0603.png)

## The reference client

The original reference client was Bitcoin Core's code, and for years Bitcoin Cash nodes ran a fork called **Bitcoin ABC**. That software has since left the Bitcoin Cash chain. Today the reference implementation is **Bitcoin Cash Node (BCHN)**, the software most commonly run by miners and the foundation of the Cash Stack's base layer.

BCHN is a full node. It's designed to run on ordinary hardware — even a Raspberry Pi — and the Permissionless Software Foundation provides a Docker container for simple deployment. BCHN communicates with the outside world in two ways:

- **P2P networking** on port **8333** (how nodes talk to each other).
- **JSON-RPC** on port **8332** (a programmatic interface for other software to query the node and submit transactions).

Because Bitcoin Cash undergoes a **network upgrade every May**, full-node operators must update their software to the latest version before the annual upgrade to avoid being left behind.

## Network discovery and the handshake

When a new node boots up, it knows nothing about the network. To join, it must discover at least one existing node. The network's topology isn't geographic, so any existing node can be selected at random.

A new node finds its first peers through **DNS seeds** — a small set of DNS servers that return lists of active node IP addresses, gathered by crawlers and long-running nodes. The client ships with the names of several DNS seeds (typically five), and the diversity of their ownership and implementation makes initial bootstrapping highly reliable. A node that knows nothing at all can alternatively be pointed at a specific peer IP with a `-seednode` argument, which is used purely for introductions and then disconnected.

To connect to a known peer, a node opens a TCP connection, usually on port **8333**, and performs a **handshake** by exchanging messages:

1. Each node sends a **`version`** message describing itself — its protocol version, supported services, current time, addresses, software version, and current block height.
2. Each peer replies with a **`verack`** (version-acknowledgement) message. Normal operation begins only after both sides have sent and received both messages.

![The initial handshake between peers](/block-blog/images/mastering-bitcoin-cash/msbt_0604.png)

Once connected, the new node advertises itself by sending an **`addr`** message with its own IP to its neighbors, who forward it onward so the newcomer becomes well known. It can also send a **`getaddr`** request asking neighbors for lists of *other* peers. This lets a node find peers to connect to while simultaneously advertising its existence to the wider network.

![Address propagation and discovery](/block-blog/images/mastering-bitcoin-cash/msbt_0605.png)

Nodes maintain connections to a *few* peers to establish diverse paths into the network — paths aren't reliable, since nodes come and go. Nodes periodically send keep-alive traffic on each connection; if there's no communication for more than **90 minutes**, the connection is presumed dead and a new peer is sought. In this way the network grows and shrinks organically, adapting to transient nodes and problems without any central coordination.

### Watching your peers with bch-js

You can inspect a node's live peer connections from JavaScript using the **bch-js** library (the modern, actively-maintained successor to the deprecated BITBOX):

```javascript
bchjs.Network.getPeerInfo().then(
  (result) => {
    console.log(result);
  },
  (err) => {
    console.log(err);
  }
);
```

The result lists each connected peer with its address, version, connection time, and traffic statistics — a handy way to see which nodes your node is talking to.

## Full nodes and staying in sync

The first thing a full node does once it connects is try to construct a complete copy of the blockchain. A brand-new node starts with only the **genesis block**, which is embedded in the client software, and must download the hundreds of thousands of blocks after it to catch up.

The sync process uses **inventory (`inv`) messages** as *signals* — a way of saying "I have this data" without sending it all at once:

1. Peers compare block heights (from their `version` messages) to find who's ahead.
2. The node sends a **`getblocks`** message containing the hash of its top block, so peers can identify exactly which blocks it's missing.
3. The peer that has the longer chain replies with an **`inv`** message listing the hashes of the next blocks to download (typically in batches of 500).
4. The node requests those blocks individually with **`getdata`** messages, and the peers respond with **`block`** messages containing the full block data.

A node spreads its requests across all connected peers, and it tracks how many blocks are "in transit" per peer so it doesn't overwhelm any single peer. As each block arrives it's validated and added to the chain, and the process repeats until the node catches up to the rest of the network.

![Node synchronizing the blockchain by retrieving blocks from a peer](/block-blog/images/mastering-bitcoin-cash/msbt_0606.png)

This comparison-and-download process runs any time a node has been offline — whether for a few minutes or a few months. If you're running a full node, expect an initial sync that downloads **several hundred gigabytes** of data and can take anywhere from a few days to a couple of weeks depending on your hardware and connection speed. That's the price of complete independence.

## Lightweight SPV nodes

Not every device can store the full blockchain. Many Bitcoin Cash wallets run on phones, tablets, and embedded systems with limited storage, power, and bandwidth. For these, the **simplified payment verification (SPV)** method allows them to operate without the full chain.

SPV nodes download **only the block headers** — not the transactions inside each block. The resulting header chain is roughly **1,000 times smaller** than the full blockchain. To verify that a specific transaction exists, an SPV node:

1. Asks a peer for a **merkle path** — a compact cryptographic proof linking the transaction to the block header.
2. Verifies the transaction's hash against the **merkle root** stored in that header.
3. Verifies the header chain itself by checking proof-of-work.

![SPV node synchronizing the block headers](/block-blog/images/mastering-bitcoin-cash/msbt_0607.png)

The key difference: a full node proves a transaction is valid by checking the *entire chain below it* to confirm the UTXO isn't already spent. An SPV node instead checks how *deep* the block is buried by the blocks above it. A transaction buried under several confirmations is considered valid *by proxy* — the fact that the network accepted the block and then did the work to build more blocks on top of it is strong evidence the payment wasn't a double-spend.

### The security trade-off

SPV verification is secure *in practice* for well-connected nodes, but it's weaker than a full node. Because an SPV node doesn't see every transaction, it can prove a transaction *exists* but cannot prove that a conflicting one (a double-spend) *doesn't* exist elsewhere in the network. This can be exploited in denial-of-service or double-spending attacks, and an SPV node that only connects to a handful of peers is vulnerable to **Sybil attacks** — being surrounded by fake nodes controlled by an attacker.

The defense is to connect randomly to *several* nodes, raising the odds of reaching at least one honest one. For infallible security, nothing beats running a full node.

### Privacy and bloom filters

SPV nodes also face a privacy problem: to receive the transactions they care about, they'd normally have to tell their peers *exactly which addresses* they're watching — effectively broadcasting the wallet's identity to anyone monitoring the network.

The solution is a **bloom filter**: a probabilistic data structure that lets an SPV node express its interest in a *fuzzy* pattern without revealing the precise addresses. In our map analogy, instead of asking for directions to "23 Church St." (revealing the destination), the tourist asks for "any street ending in R-C-H" — revealing less while still finding the address.

A bloom filter is implemented as a bit array, filled by hashing each watch-list address with several hash functions and setting the corresponding bits. It can be tuned between **precision** (fewer, more accurate results, but less privacy) and **privacy** (more results, many irrelevant, but the node's addresses stay hidden).

![An example of a simplistic bloom filter, with a 16-bit field and three hash functions](/block-blog/images/mastering-bitcoin-cash/msbt_0608.png)

When an SPV node installs a filter on a connection (via a `filterload` message), the peer only sends back transactions and blocks that match the filter. A positive match from a bloom filter is a **"Maybe"** (bits can overlap by coincidence), while a negative match is a **"Definitely not"** — so a filter never lets a genuinely interesting transaction slip through. Bitcoin Cash's bloom-filter implementation is specified in BIP-37.

## Transaction pools

Almost every node keeps a temporary, in-memory list of **unconfirmed transactions** called the **memory pool**, or **mempool**. The mempool is where transactions sit between the moment they're broadcast and the moment a miner includes them in a block. Wallets use it to show you "unconfirmed" incoming payments.

As transactions are received and validated, they're added to the mempool and relayed to neighbors, propagating across the network in an expanding ripple. But transactions build on each other, and sometimes a **child** transaction arrives before its **parent**. Rather than reject it, a node places the parentless child in a separate **orphan pool**. When the parent finally arrives, the orphan is released, revalidated, and promoted into the mempool — potentially triggering a cascade that reconnects a whole chain of descendant transactions.

Both pools exist only in RAM and are cleared on restart, then repopulated from network traffic. There's also the **UTXO set** — the database of all *unspent* outputs on the blockchain. Unlike the mempool (a local, node-specific view of pending transactions), the UTXO set is the *emergent consensus* of the network and varies little between nodes.

## Wrap up

Let's summarize how the Bitcoin Cash network works:

1. **A flat P2P network** — thousands of equal, independent nodes talk directly, with no server or hierarchy.
2. **Four node functions** — routing, blockchain database, mining, and wallet; full nodes carry all of them.
3. **Node types** — full nodes (authoritative), lightweight SPV nodes (headers only, great for phones), mining nodes, and enterprise edge routers.
4. **The extended network** — Stratum and pool-mining protocols bridge additional clients through gateway servers.
5. **Discovery & the handshake** — DNS seeds find the first peers; `version`/`verack` messages establish each connection.
6. **Staying in sync** — full nodes exchange inventory messages and download missing blocks; SPV nodes verify via merkle paths.
7. **Privacy with bloom filters** — SPV wallets watch for their addresses without revealing them.
8. **Transaction pools** — the mempool holds unconfirmed transactions; orphan pools reconnect out-of-order chains.

The Bitcoin Cash network is the trustless backbone of the whole system — a resilient, permissionless mesh where value flows directly from peer to peer, secured by cryptography and consensus rather than by any central authority.

Ready for the next lesson? Head back to [BCH Education](#/education) to continue.
