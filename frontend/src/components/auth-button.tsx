"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";

export function AuthButton() {
  const { isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleLogin = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return isConnected ? (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => disconnect()}
      className="gap-2"
    >
      <LogOut className="w-4 h-4" />
      DISCONNECT
    </Button>
  ) : (
    <Button
      type="button"
      size="sm"
      onClick={handleLogin}
      loading={isPending}
      className="gap-2"
    >
      {!isPending && <Wallet className="w-4 h-4" />}
      CONNECT WALLET
    </Button>
  );
}
