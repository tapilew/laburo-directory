## 1. Title

**Laburo Directory – Staked Talent Profiles on Scroll**

## 2. Problem

- **Recruiters** waste time on stale, low-intent profiles and spam databases.
- **Talent** gets flooded with low-quality outreach because contact info is cheap to abuse.
- **No economic signal**: it costs nothing to lie, overstate skills, or go inactive.

## 3. Solution

- **Staked on-chain profiles** on Scroll: talent deposits ETH to list, creating real skin-in-the-game.
- **Simple directory dapp** where recruiters can browse and rank candidates by visible stake and on-chain activity.
- Future: **pay-to-reveal contact + audit trail** via Arkiv and x402-style payments.

## 4. What’s live today (hackathon MVP)

- **Network:** Scroll Sepolia.
- **Contract:** Reused `GigRegistry` as a **staked profile registry** (each gig = a profile with stake).
- **Frontend:** Next.js + wagmi + viem directory UI, mocked “unlock contact” flow (no real x402/Arkiv yet).
- **No backend:** everything used by the app is on-chain plus static frontend logic.

## 5. Why Scroll

- Low fees + fast finality = **cheap, real-time signaling** from micro-stakes.
- EVM-compatible, easy to develop with Foundry + existing tooling.
- Great fit for **agentic recruiters** crawling and scoring profiles directly on-chain.

## 6. Roadmap

- v1.5: Replace mock unlock with a real **Scroll-native payment flow**, start logging events off-chain.
- v2: Add **Arkiv-backed TTL profiles**, gated `PrivateContact`, and `AuditEvent` audit logs.
- v3: Migrate from `GigRegistry` to a dedicated **StakedProfileRegistry** with **disputes + slashing** for both talent and recruiters.

## 7. Team & track record

- **HTTPayer** (`https://www.httpayer.com/`): automated x402 USDC payments across chains, **winner of Chainlink’s cross-chain x402 track (CCIP)**.
- **Spuro** (`https://sub0-hackathon.vercel.app/`): Arkiv-backed x402 storage backend powered by HTTPayer, built for the Polkadot sub0 hackathon.
