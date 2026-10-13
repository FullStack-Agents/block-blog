import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'

// The embedded Token Tiger collection viewer. It is a separate single-page app
// that is built into this site at build time (public/collections/), so it is
// served from a real path rather than a route inside this hash router.
const COLLECTIONS_URL = `${import.meta.env.BASE_URL}collections/`

export default function SlpTokens() {
  return (
    <>
      <div className="hero-section text-center">
        <Container>
          <h1 className="display-4 fw-bold">SLP Tokens</h1>
          <p className="lead mb-0">
            Tokens on Bitcoin Cash — what they are, how they work, and the
            collection Block has minted on-chain.
          </p>
        </Container>
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col lg={9}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-3">What is SLP?</h2>
                <p>
                  <strong>SLP</strong> — the <em>Simple Ledger Protocol</em> —
                  is a token layer for Bitcoin Cash introduced in 2019. Tokens
                  are created and moved in ordinary Bitcoin Cash transactions:
                  the rules live in a small data record attached to the
                  transaction, and they are enforced by the wallets and indexers
                  that read it. There is no separate virtual machine, no gas, and
                  no side-chain. That means tokens inherit everything that is
                  good about BCH — fast confirmation, fees measured in
                  fractions of a cent, and a UTXO model that keeps ownership
                  verifiable on-chain.
                </p>

                <h3 className="h6 mt-4">Token flavors</h3>
                <ul>
                  <li>
                    <strong>Type 1 — fungible tokens.</strong> A fixed supply,
                    created in a genesis transaction. Mint a supply of exactly
                    one indivisible unit and destroy the minting authority and
                    you get what the spec calls a <em>simple NFT</em>.
                  </li>
                  <li>
                    <strong>NFT1 (2020) — grouped NFTs.</strong> Adds a
                    parent &ldquo;group&rdquo; token that mints individual child
                    NFTs, so a whole set can be tied together under one provable
                    ID — conceptually similar to ERC-721.
                  </li>
                </ul>

                <h3 className="h6 mt-4">Where the name and picture come from</h3>
                <p className="mb-0">
                  A token ID proves which token something is, but it says nothing
                  about what it should look like. That is what metadata is for.
                  The <strong>PS007</strong> specification stores a token&rsquo;s
                  details — title, description, icon, issuer URL — as JSON on
                  IPFS, and links that record from the token itself. Wallets,
                  explorers, and collection viewers then resolve the same metadata
                  to show a consistent icon. Every token in the collection below
                  carries PS007 metadata.
                </p>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-3">SLP and CashTokens</h2>
                <p className="mb-0">
                  In 2023 Bitcoin Cash gained <strong>CashTokens</strong> —
                  tokens validated by miners themselves, so the rules no longer
                  depend on any indexer agreeing with you. SLP tokens, which
                  predate that upgrade, still circulate widely and are what the
                  collection tooling below is built around. Between the two, BCH
                  now has both a battle-tested indexer-based token layer and a
                  native one secured by the same proof-of-work as the chain.
                </p>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-3">Collections</h2>
                <p>
                  Tokens can be grouped into a <strong>collection</strong>. A
                  sharable collection has its own Bitcoin Cash address, so anyone
                  can send a token to it, and the collection can be displayed on
                  any website. Block mints tokens with the Token Tiger command
                  line tool and sends them to a collection address — which is how
                  they end up in the viewer below.
                </p>
                <Alert variant="light" className="border small text-muted mb-4">
                  The viewer is the Token Tiger collection app, embedded here. It reads collections
                  straight from the blockchain by their addresses — pick a collection, then drill
                  into the tokens inside it. No account or login required.
                </Alert>
                <div className="text-center">
                  <a
                    href={COLLECTIONS_URL}
                    className="text-decoration-none"
                  >
                    <Button variant="primary" size="lg">
                      Collections
                    </Button>
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
