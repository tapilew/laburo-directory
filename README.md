# Laburo Directory

Decentralized, **staked** recruitment directory.

## 1. The Problem

Recruitment is broken by noise and low skin-in-the-game.

- **Recruiters** burn hours on stale, low-intent profiles (LinkedIn, bulk databases, scraped lists).
- **Job seekers** get spammed by bots and low‑quality outreach because their contact info is cheap to abuse.
- **No economic signal**: being listed costs nothing, so everyone can lie, overstate skills, or go inactive with zero downside.

## 2. The Solution: Staked Talent Directory

Laburo Directory is a **staked, on‑chain talent directory** where:

- **Job seekers stake ETH** to list a profile. Lying or disappearing becomes expensive.
- **Recruiters (or their AI agents) pay per lead** to unlock contact info via the **x402 pay‑to‑reveal protocol**.
- **Arkiv** stores profiles and dispute evidence with **Time‑To‑Live (TTL)** and an **on‑chain audit trail**.

Core ideas:

- **Skin in the game:** Profiles carry a visible stake (escrow) that can be slashed only under strict fraud conditions in future versions.
- **Monetized bots:** We don’t fight bots; we make them **pay you**. Agents can crawl/analyze the directory, but x402 gates sensitive data behind micro‑payments.
- **Freshness by design:** Arkiv TTL means profiles and evidence auto‑expire, so recruiters only see **currently active** talent.

## 3. How It Works (MVP Architecture)

### Roles

- **Talent (Job Seekers):** stake ETH, publish a profile.
- **Recruiters / Talent Agents (AI):** search, evaluate, and pay to reveal contact.
- **Protocol Backend:** enforces x402 (HTTP `402 Payment Required`) and writes/read from Arkiv.

### On‑chain: Staked Profiles (GigRegistry)

We reuse a simple contract (`GigRegistry`, deployed on Scroll Sepolia at  
`0xe734917ec960dbabcff216ea9d50cf5f7c0b81d5`) as the first building block:

- `createGig(title, description, deadline)` with `msg.value`:
  - Interpreted in this MVP as **“Stake & List Profile”**, not a classic gig budget.
  - `title` → **Role / Skillset** (e.g. “Rust Engineer, ZK exp”).
  - `description` → **Public summary**.
  - `budget` (ETH) → **Staked amount**, visible in the UI as “Skin in the game”.
- `getGig` / `getGigCount`:
  - Used by the frontend to render the **Talent Directory**.

In future versions, this contract can evolve to a dedicated **StakedProfileRegistry** with explicit slashing/dispute rules.

### Data Layer: Arkiv (Profiles + Audit Trail)

Using Arkiv ([docs](https://arkiv.dev.golem.network/docs)) we store:

- **PublicProfile entity** (TTL-aware)
  - `profile_id` (links to on‑chain gig/profile ID)
  - `role`, `skills`, `summary`
  - `stake_amount`, `network`
  - `ttl` – how long this profile is considered “active” (e.g. 1h/24h).
- **PrivateContact entity** (Gated)
  - `profile_id`
  - `email`, `telegram`
  - Only returned after x402 payment is confirmed.
- **AuditEvent entity** (Audit Log)
  - `type`: `UNLOCK`, `FLAG`
  - `profile_id`, `recruiter_wallet`
  - `evidence_url`
  - `ttl`: disputes/evidence also expire to avoid infinite baggage.

This gives us **TTL‑aware UX** (“Active for 42m”) and a **queryable history** of unlocks/flags.

### Access Control: x402 + Crossmint

The backend implements an **x402 pay‑to‑reveal** gateway:

1. Recruiter clicks **“Reveal Contact”** for a profile.
2. Backend checks Arkiv & chain:
   - If unpaid → returns `402 Payment Required` with metadata for a Crossmint payment (amount, asset, profile ID).
   - If paid → returns `200` + the `PrivateContact` fields.
3. **Crossmint** handles:
   - Embedded wallet for Recruiters (no self‑custody friction).
   - Stablecoin (e.g. USDC on Scroll) payments that satisfy the x402 requirement.

### Disputes & Slashing (Roadmap)

- **v1 (Hackathon):** Stake is purely **signal** and escrow; Arkiv is used as an **audit log**.
- **v2+:** Add **Recruiter dispute bonds** and **Neutral resolution** (DAO/council). A recruiter must stake to accuse. If the claim is valid (fraud), the talent is slashed. If invalid, the recruiter is slashed.

## 4. Technical Stack & Deliverables

- **Frontend:** Next.js (App Router) + `wagmi` + `viem` (Scroll Sepolia).
- **Smart Contracts:** `GigRegistry.sol` (Scroll Sepolia).
- **Backend (Design):** FastAPI/Node + Arkiv JSON-RPC + x402 logic.

### Bounties Alignment

- **Arkiv:** Real-time usage + TTL + DeFi-like staking semantics + Audit Trail.
- **Crossmint:** Fintech + Agentic Commerce (x402 pay-per-lead).
- **Chroma / Spark:** Potential for audit/identity analysis.

## 5. Data Model & HTTP Flow

### Arkiv Entities Schema (v1)

```json
{
  "PublicProfile": {
    "profile_id": "uint256",
    "wallet_address": "address",
    "role": "string",
    "skills": "string[]",
    "summary": "string",
    "stake_amount": "decimal",
    "created_at": "timestamp",
    "expires_at": "timestamp"
  },
  "PrivateContact": {
    "profile_id": "uint256",
    "email": "string",
    "telegram": "string"
  },
  "AuditEvent": {
    "event_id": "uuid",
    "type": "enum(UNLOCK, FLAG)",
    "recruiter_wallet": "address",
    "tx_hash": "string",
    "evidence_url": "string",
    "expires_at": "timestamp"
  }
}
```

### x402 HTTP Flow

1.  **Client:** `GET /profiles/:id/contact`
2.  **Server:**
    - Checks payment status.
    - **Response (402):**
      ```json
      {
        "error": "Payment Required",
        "payment_session_id": "ses_123...",
        "price": "5 USDC",
        "asset": "USDC-Scroll"
      }
      ```
3.  **Client:** Opens Crossmint widget with `payment_session_id`.
4.  **Crossmint:** Webhook `POST /x402/webhook/crossmint` → Server verifies & updates Arkiv.
5.  **Client:** Retries `GET /profiles/:id/contact`.
6.  **Server:**
    - **Response (200):**
      ```json
      {
        "email": "alice@example.com",
        "telegram": "@alice_dev"
      }
      ```
