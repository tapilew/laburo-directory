"use client";

import { useAccount } from "wagmi";

export function Wallet() {
  const { address, isConnecting, isDisconnected } = useAccount();

  if (isConnecting) {
    return <div>Loading...</div>;
  }

  if (isDisconnected) {
    return <div>Wallet not connected</div>;
  }

  return <div>Connected: {address}</div>;
}
