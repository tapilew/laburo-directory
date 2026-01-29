"use client";

import { useAccount, useBalance } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDivider } from "@/components/ui/card";
import { Wallet, ExternalLink, AlertCircle } from "lucide-react";

interface WalletProps {
  onTopUp?: () => void;
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatStake(wei: bigint): string {
  if (wei === BigInt(0)) return "0";
  const ethString = (Number(wei) / 1e18).toString();
  const [intPart, fracPart = ""] = ethString.split(".");
  const trimmedFrac = fracPart.slice(0, 4).replace(/0+$/, "");
  return trimmedFrac.length ? `${intPart}.${trimmedFrac}` : intPart;
}

export function WalletComponent({ onTopUp }: WalletProps) {
  const { address, isConnecting, isDisconnected, status } = useAccount();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  if (isConnecting) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full" />
        </div>
      </Card>
    );
  }

  if (isDisconnected) {
    return (
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
              <Wallet className="w-6 h-6 text-[var(--color-fg-muted)]" />
            </div>
            <div>
              <h3 className="text-heading-4 text-[var(--color-fg-primary)]">
                WALLET NOT CONNECTED
              </h3>
              <p className="text-body-sm text-[var(--color-fg-secondary)] mt-1">
                Connect your wallet to stake ETH and unlock talent profiles
              </p>
            </div>
          </div>
          <Badge variant="warning" size="pill">
            DISCONNECTED
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--color-divider)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]">
              <Wallet className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-heading-4 text-[var(--color-fg-primary)]">
                YOUR WALLET
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <code className="text-code text-[var(--color-fg-secondary)]">
                  {address ? formatAddress(address) : "—"}
                </code>
                <button className="text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <Badge variant="success" size="pill" dot dotColor="success">
            CONNECTED
          </Badge>
        </div>
      </div>

      {/* Balance info */}
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Balance */}
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-4">
            <div className="text-label text-[var(--color-fg-muted)] mb-1">
              BALANCE
            </div>
            <div className="font-display text-2xl text-[var(--color-fg-primary)]">
              {isBalanceLoading
                ? "—"
                : balanceData
                ? `${formatStake(balanceData.value)} ETH`
                : "—"}
            </div>
            <div className="text-body-sm text-[var(--color-fg-muted)] mt-1">
              {isBalanceLoading
                ? "Loading..."
                : balanceData
                ? `≈ $${(Number(balanceData.value) / 1e18 * 2500).toFixed(2)} USD`
                : "—"}
            </div>
          </div>

          {/* Network */}
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-4">
            <div className="text-label text-[var(--color-fg-muted)] mb-1">
              NETWORK
            </div>
            <div className="font-display text-2xl text-[var(--color-fg-primary)]">
              SCROLL
            </div>
            <div className="text-body-sm text-[var(--color-fg-muted)] mt-1">
              Sepolia Testnet
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" size="sm" onClick={onTopUp}>
            TOP UP
          </Button>
          <Button variant="ghost" size="sm">
            VIEW ON EXPLORER
          </Button>
        </div>
      </div>
    </Card>
  );
}

export { WalletComponent as Wallet };
