"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleLogin = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return isConnected ? (
    <Button type="button" onClick={() => disconnect()}>
      Disconnect
    </Button>
  ) : (
    <Button type="button" onClick={handleLogin}>
      Connect Wallet
    </Button>
  );
}
