We started by exploring whether it was possible to make a smart contract that performs CRUD or other operations on an Arkiv L3 chain. We found that Arkiv's architecture offers a layered solution with L1 for security, L2 for coordination, and L3 (DB-Chains) specialized for queryable, time-scoped data storage. We understood that smart contracts mostly interact with Arkiv L3 through RPC and SDKs outside typical on-chain calls, so we planned to use Arkiv as a data layer with smart contracts on L1/L2 handling logic.

Then, we considered the integration with Scroll, an EVM-compatible L2 zk-rollup on Ethereum. We confirmed Scroll supports standard Solidity contracts and cross-chain communication. We identified a hybrid architecture where Scroll smart contracts manage logic and payment coordination, and Arkiv L3 handles data storage accessed via an off-chain backend using Arkiv's SDK.

We also talked about the x402 protocol for paywalls and microtransactions and struggled to find a direct way to combine Scroll and x402. We realized that while x402 officially supports networks like Base and Solana, support for Scroll was missing. We considered the option of running a self-hosted x402 facilitator customized for Scroll Sepolia to bridge this gap.

Next, for x402 integration, we planned to fork the Coinbase x402 repo and add support for Scroll Sepolia by:

- Adding Scroll Sepolia's chain ID and an EIP-3009-compatible token address in the configuration.
- Adding `"scroll-sepolia"` in network schemas and supported networks.
- Mapping Scroll Sepolia to a viem Chain object for wallet interactions.

We confirmed the necessity of deploying our own EIP-3009-compatible token on Scroll Sepolia because there is no public USDC or similar token with EIP-3009 support available there.

Finally, while looking at the actual x402 codebase, we realized the network setup uses Maps instead of enums for networks. So, we planned to add `"scroll-sepolia"` with its chain ID to the `EvmNetworkToChainId` Map and similarly update the supported networks and wallet mappings accordingly.

We decided on a clear development plan: fork and clone x402, add Scroll Sepolia support following the observed code structure, deploy an EIP-3009 token on Scroll Sepolia, run our own facilitator to support x402 payments on Scroll (optionally fronted by **Crossmint** embedded wallets for recruiters), and develop the backend integrating Scroll smart contracts, x402 payments, and Arkiv data storage.

---

## Product framing and problem statement

Recruitment feels broken primarily because there is **no cost to being noisy or low-intent**:

- Recruiters burn hours on stale, low-intent profiles (LinkedIn, bulk databases, scraped lists).
- Job seekers get spammed by bots and low-quality outreach because their contact info is cheap to abuse.
- There is no real **economic signal**: being listed costs nothing, so anyone can overstate skills or go inactive with no downside.

The core product idea behind Laburo Directory is a **staked, on-chain talent directory**:

- **Job seekers stake ETH** to list a profile, so lying or disappearing is economically expensive.
- **Recruiters (or their AI agents)** can crawl, rank, and evaluate profiles, but sensitive contact data is gated.
- Over time, we want **Arkiv** and **x402-style payments** to turn this into a pay-per-lead, TTL-aware, auditable directory.

For the hackathon submission we only managed to ship the **Scroll-only on-chain directory** (see the root `README.md`), but the sections below capture the design space we explored.

## Intended architecture (original MVP design)

### Roles

- **Talent (Job Seekers):** stake ETH and publish a profile.
- **Recruiters / Talent Agents (AI):** search, evaluate, and pay to reveal contact.
- **Protocol Backend:** enforces x402 (`402 Payment Required`) and reads/writes Arkiv entities.

### On-chain: staked profiles (GigRegistry)

We chose to start from a simple `GigRegistry` contract (deployed on Scroll Sepolia at  
`0xe734917ec960dbabcff216ea9d50cf5f7c0b81d5`):

- `createGig(title, description, deadline)` with `msg.value`:
  - Interpreted as **“Stake & List Profile”**, not a classic gig budget.
  - `title` → **Role / Skillset** (e.g. “Rust Engineer, ZK exp”).
  - `description` → **Public summary**.
  - `budget` (ETH) → **Staked amount**, visible in the UI as “skin in the game”.
- `getGig` / `getGigCount`:
  - Used by the frontend to render the **Talent Directory**.

In the shipped MVP we **stopped here**: we reused this contract as-is on Scroll and did not build a dedicated `StakedProfileRegistry`.

In future versions we want to evolve this into a dedicated **StakedProfileRegistry** with explicit slashing and dispute rules (see “Disputes & slashing roadmap” below).

### Data layer: Arkiv (profiles + audit trail) – planned, not implemented

We originally intended to use Arkiv ([docs](https://arkiv.dev.golem.network/docs)) as a TTL-aware data layer:

- **PublicProfile entity** (TTL-aware)
  - `profile_id` (links to on-chain gig/profile ID)
  - `wallet_address`
  - `role`, `skills`, `summary`
  - `stake_amount`, `network`
  - `created_at`, `expires_at`
- **PrivateContact entity** (gated)
  - `profile_id`
  - `email`, `telegram`
  - Only returned after payment is confirmed.
- **AuditEvent entity** (audit log)
  - `event_id`
  - `type`: `UNLOCK`, `FLAG`
  - `recruiter_wallet`
  - `tx_hash`
  - `evidence_url`
  - `expires_at`

This Arkiv layer would power:

- **TTL-aware UX** (“Active for 42m”, auto-expiring stale profiles and disputes).
- A **queryable history** of unlocks/flags for analysis and reputation.

Because of time constraints, Arkiv integration was not implemented in the hackathon build.

### Access control: x402-style pay-to-reveal – planned, not implemented

The backend design used an **x402 pay-to-reveal** gateway:

1. **Client** calls: `GET /profiles/:id/contact`.
2. **Server** checks payment status in its own DB / Arkiv.
   - If unpaid → return `402 Payment Required` with metadata for a payment session (amount, asset, profile ID).
   - If paid → return `200` with the `PrivateContact` fields.
3. A facilitator (initially via Coinbase x402 + potentially **Crossmint** wallets) would:
   - Provide an embedded wallet for recruiters (low-friction onboarding).
   - Handle EIP-3009-style stablecoin payments that satisfy the x402 requirement.

In the hackathon frontend we retained only a **mocked UI modal** that simulates an x402-style unlock on Scroll; it does not talk to any real facilitator or Arkiv backend.

## Scroll + x402 + Arkiv integration path (research notes)

- x402 currently focuses on networks like Base and Solana; Scroll support is missing.
- To bridge the gap we explored:
  - Running a self-hosted x402 facilitator customized for Scroll Sepolia.
  - Deploying our own **EIP-3009-compatible token** on Scroll Sepolia (since there is no public USDC with EIP-3009 there).
  - Forking the Coinbase x402 repo and:
    - Adding Scroll Sepolia’s chain ID and token address in the configuration.
    - Adding `"scroll-sepolia"` to network schemas and supported networks.
    - Mapping Scroll Sepolia to a `viem` `Chain` object for wallet interactions.
- While reviewing the x402 codebase we noticed the network setup is based on **Maps** rather than enums, so Scroll support boils down to:
  - Extending the `EvmNetworkToChainId` map with Scroll Sepolia.
  - Wiring Scroll into supported networks and wallet mappings.

This work was **not started** during the hackathon but remains a realistic path to a Scroll-native x402 deployment.

## Disputes & slashing roadmap (future thinking)

The long-term goal for Laburo Directory is a **skin-in-the-game reputation system**:

- **v1 (hackathon):**
  - Stake is purely **signal** and escrow.
  - No actual slashing or disputes; Scroll holds funds, frontend just shows stake.
- **v2+:** add proper disputes and slashing:
  - **Recruiter dispute bonds:** a recruiter must stake to accuse a profile of fraud.
  - **Neutral resolution:** DAO/council or other neutral body evaluates evidence stored via Arkiv.
  - **Symmetric slashing:** if the profile is fraudulent, talent stake can be slashed; if the dispute is baseless, the recruiter’s bond is slashed.

These ideas motivated the Arkiv + x402 integration, even though the initial submission only ships the Scroll-only directory and reuses a generic `GigRegistry` contract as the profile registry.
