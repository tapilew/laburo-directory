# Laburo Directory

Decentralized, **staked** recruitment directory on the **Scroll** network.

## 1. What this hackathon MVP actually ships

- **Network:** Scroll Sepolia only.
- **On-chain core:** A generic `GigRegistry` contract deployed on Scroll Sepolia at  
  `0xe734917ec960dbabcff216ea9d50cf5f7c0b81d5`.
  - We reuse it as a **staked profile registry** instead of building a bespoke contract.
  - `createGig(title, description, deadline)` with `msg.value` is interpreted as **“stake & list profile”**.
- **Frontend dapp (Next.js + wagmi + viem):**
  - Talent can create a profile by staking ETH and describing their role.
  - Recruiters can browse all on-chain profiles and see the **stake as a trust signal**.
  - The “pay to reveal contact” flow is **UI-only / mocked** via a simple payment modal; there is **no real x402 or Arkiv integration**.
- **No backend services** are required for the shipped MVP; everything the app uses lives on Scroll (plus static frontend logic).

In other words, the submission is a **Scroll-only, fully on-chain directory** that proves the staked-profile UX, while the more advanced data and payment layers remain future work.

## 2. How it works today

### Roles

- **Talent (Job Seekers):** stake ETH and publish a profile (a “gig”) on Scroll.
- **Recruiters / Agents:** browse profiles and reason about candidates using the visible on-chain stake.

### On-chain: `GigRegistry` as profile registry

The `GigRegistry` contract (see `backend/scroll_test/src/GigRegistry.sol`) was originally designed as a **minimal Upwork-style escrow**:

- `createGig` escrows ETH and stores the gig metadata.
- `submitBid`, `acceptBid`, `completeGig`, and `releasePayment` implement a simple marketplace flow.

For this project we:

- Treat each gig as a **“staked talent profile”** (title + description + stake).
- Use `getGigCount` / `getGig` from the frontend to render the **Talent Directory**.
- Rely solely on Scroll for data and settlement; there is no off-chain storage yet.

This keeps the on-chain surface small while still giving recruiters a **live, economic signal** per profile.

## 3. Tech stack

- **Contracts:** Solidity `GigRegistry.sol` on Scroll Sepolia (Foundry project under `backend/scroll_test`).
- **Frontend:** Next.js (App Router) + `wagmi` + `viem`, reading from the deployed `GIG_REGISTRY_ADDRESS` in `frontend/src/abi.ts`.
- **Tooling:** Foundry for contracts; standard Next.js toolchain for the frontend.

Background architecture and design notes (Arkiv, x402, alternatives, etc.) live in `documents/BRAINSTORMING.md`.

## 4. Running the project

### Contracts (Scroll Sepolia)

From `backend/scroll_test`:

- Install Foundry and dependencies (see `backend/scroll_test/README.md` for details).
- Build:

```bash
forge build
```

- Test:

```bash
forge test
```

- Deploy to Scroll Sepolia:

```bash
forge script script/Deploy.s.sol:Deploy --rpc-url scroll_sepolia --broadcast --verify
```

The deployment script will print the `GigRegistry` address. The frontend is currently wired to  
`0xe734917ec960dbabcff216ea9d50cf5f7c0b81d5`; update `frontend/src/abi.ts` if you re-deploy.

### Frontend dapp

From `frontend`:

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000` and connect a wallet configured for **Scroll Sepolia**.

## 5. Future directions (post-hackathon)

The current codebase intentionally stops at a **Scroll-only, on-chain directory**. The original design explored a richer architecture:

- **Arkiv-backed data layer:**
  - Store TTL-aware `PublicProfile`, gated `PrivateContact`, and `AuditEvent` entities off-chain.
  - Use TTLs to ensure the directory only surfaces **fresh, recently active** talent.
- **x402-style pay-to-reveal:**
  - Enforce `402 Payment Required` for contact reveal, backed by a facilitator that supports Scroll.
  - Use **Crossmint-style embedded wallets** to let recruiters pay per lead without full self-custody setup.
  - Replace the current mocked payment modal with a real on-chain payment + unlock flow.
- **Dedicated StakedProfileRegistry:**
  - Replace the generic `GigRegistry` with a contract purpose-built for talent staking, profile slashing, and dispute flows.
- **Disputes & slashing:**
  - Introduce recruiter dispute bonds and neutral resolution (council/DAO) with symmetric slashing for bad actors.

Those ideas, along with alternative approaches and integration notes (Arkiv, x402, Crossmint, etc.), are captured in more detail in `documents/BRAINSTORMING.md` for future iterations.
