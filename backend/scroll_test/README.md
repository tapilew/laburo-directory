# Decentralized Upwork on Scroll

Minimal MVP implementation of a decentralized Upwork platform on Scroll Sepolia testnet.

## Setup

1. Install Foundry: https://book.getfoundry.sh/getting-started/installation

2. Install dependencies:
```bash
forge install
```

3. Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required environment variables:
- `SCROLL_SEPOLIA_RPC_URL` - Scroll Sepolia RPC endpoint (default: https://sepolia-rpc.scroll.io)
- `DEPLOYER_PRIVATE_KEY` - Your wallet private key for deployment
- `SCROLLSCAN_API_KEY` - API key for contract verification (optional)

## Get Testnet ETH

Get Scroll Sepolia testnet ETH from the faucet:
- https://scroll.io/faucet
- https://sepoliafaucet.com/ (get Sepolia ETH first, then bridge to Scroll)

## Build

```bash
forge build
```

## Test

```bash
forge test
```

## Deploy to Scroll Sepolia

```bash
forge script script/Deploy.s.sol:Deploy --rpc-url scroll_sepolia --broadcast --verify
```

The deployment script will output the contract address to the console.

## Contract Overview

**GigRegistry.sol** - Single contract containing all functionality:
- Create gigs with escrowed budget
- Submit bids on gigs
- Accept bids (refunds other bidders)
- Mark gigs as completed
- Release payment to seller

All data is stored on-chain temporarily (will migrate to Arkiv DB later).

## Documentation

- Foundry: https://book.getfoundry.sh/
- Scroll Docs: https://docs.scroll.io/
