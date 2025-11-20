We started by exploring whether it was possible to make a smart contract that performs CRUD or other operations on an Arkiv L3 chain. We found that Arkiv's architecture offers a layered solution with L1 for security, L2 for coordination, and L3 (DB-Chains) specialized for queryable, time-scoped data storage. We understood that smart contracts mostly interact with Arkiv L3 through RPC and SDKs outside typical on-chain calls, so we planned to use Arkiv as a data layer with smart contracts on L1/L2 handling logic.

Then, we considered the integration with Scroll, an EVM-compatible L2 zk-rollup on Ethereum. We confirmed Scroll supports standard Solidity contracts and cross-chain communication. We identified a hybrid architecture where Scroll smart contracts manage logic and payment coordination, and Arkiv L3 handles data storage accessed via an off-chain backend using Arkiv's SDK.

We also talked about the x402 protocol for paywalls and microtransactions and struggled to find a direct way to combine Scroll and x402. We realized that while x402 officially supports networks like Base and Solana, support for Scroll was missing. We considered the option of running a self-hosted x402 facilitator customized for Scroll Sepolia to bridge this gap.

Next, for x402 integration, we planned to fork the Coinbase x402 repo and add support for Scroll Sepolia by:

- Adding Scroll Sepolia's chain ID and an EIP-3009-compatible token address in the configuration.
- Adding `"scroll-sepolia"` in network schemas and supported networks.
- Mapping Scroll Sepolia to a viem Chain object for wallet interactions.

We confirmed the necessity of deploying our own EIP-3009-compatible token on Scroll Sepolia because there is no public USDC or similar token with EIP-3009 support available there.

Finally, while looking at the actual x402 codebase, we realized the network setup uses Maps instead of enums for networks. So, we planned to add `"scroll-sepolia"` with its chain ID to the `EvmNetworkToChainId` Map and similarly update the supported networks and wallet mappings accordingly.

We decided on a clear development plan: fork and clone x402, add Scroll Sepolia support following the observed code structure, deploy an EIP-3009 token on Scroll Sepolia, run our own facilitator to support x402 payments on Scroll, and develop the backend integrating Scroll smart contracts, x402 payments, and Arkiv data storage.
