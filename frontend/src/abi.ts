export const GIG_REGISTRY_ADDRESS =
  "0xe734917ec960dbabcff216ea9d50cf5f7c0b81d5" as const;

export const gigRegistryAbi = [
  {
    type: "function",
    stateMutability: "payable",
    name: "createGig",
    inputs: [
      { name: "_title", type: "string", internalType: "string" },
      { name: "_description", type: "string", internalType: "string" },
      { name: "_deadline", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "getGigCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "getGig",
    inputs: [{ name: "_gigId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "buyer", type: "address", internalType: "address" },
      { name: "seller", type: "address", internalType: "address" },
      { name: "title", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
      { name: "budget", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      {
        name: "status",
        type: "uint8",
        internalType: "enum GigRegistry.GigStatus",
      },
      { name: "bidCount", type: "uint256", internalType: "uint256" },
    ],
  },
] as const;
