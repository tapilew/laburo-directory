"use client";

import React from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { GIG_REGISTRY_ADDRESS, gigRegistryAbi } from "@/abi";

import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth-button";

type GigTuple = readonly [
  bigint,
  `0x${string}`,
  `0x${string}`,
  string,
  string,
  bigint,
  bigint,
  number,
  bigint
];

type UiGig = {
  id: number;
  buyer: string;
  seller: string;
  title: string;
  description: string;
  stakeEth: string;
  deadline: Date;
  status: number;
  bidCount: number;
};

function formatStake(wei: bigint): string {
  if (wei === BigInt(0)) return "0";
  // basic wei -> ETH formatter without pulling in extra deps
  const ethString = (Number(wei) / 1e18).toString();
  const [intPart, fracPart = ""] = ethString.split(".");
  const trimmedFrac = fracPart.slice(0, 4).replace(/0+$/, "");
  return trimmedFrac.length ? `${intPart}.${trimmedFrac}` : intPart;
}

function toUiGig(tuple: GigTuple): UiGig {
  const [
    id,
    buyer,
    seller,
    title,
    description,
    budget,
    deadline,
    status,
    bidCount,
  ] = tuple;

  return {
    id: Number(id),
    buyer,
    seller,
    title,
    description,
    stakeEth: formatStake(budget),
    deadline: new Date(Number(deadline) * 1000),
    status,
    bidCount: Number(bidCount),
  };
}

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    data: gigCountData,
    refetch: refetchGigCount,
    isLoading: isLoadingCount,
    error: gigCountError,
  } = useReadContract({
    address: GIG_REGISTRY_ADDRESS,
    abi: gigRegistryAbi,
    functionName: "getGigCount",
  });

  const gigCount = gigCountData ? Number(gigCountData) : 0;
  const latestGigId = gigCount > 0 ? BigInt(gigCount) : undefined;

  const {
    data: latestGigData,
    isLoading: isLoadingLatestGig,
    error: latestGigError,
  } = useReadContract({
    address: GIG_REGISTRY_ADDRESS,
    abi: gigRegistryAbi,
    functionName: "getGig",
    args: latestGigId ? [latestGigId] : undefined,
    query: {
      enabled: !!latestGigId,
    },
  });

  const latestGig = latestGigData
    ? toUiGig(latestGigData as GigTuple)
    : undefined;

  const {
    writeContract,
    data: txHash,
    error: writeError,
    isPending,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const [role, setRole] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [stake, setStake] = React.useState("0.01");
  const [durationHours, setDurationHours] = React.useState("24");
  const [revealClicked, setRevealClicked] = React.useState(false);

  async function handleCreateProfile(event: React.FormEvent) {
    event.preventDefault();
    if (!role || !bio) return;

    const hours = Number(durationHours) || 24;
    const nowSeconds = Math.floor(Date.now() / 1000);
    const deadline = BigInt(nowSeconds + hours * 3600);

    try {
      writeContract({
        address: GIG_REGISTRY_ADDRESS,
        abi: gigRegistryAbi,
        functionName: "createGig",
        args: [role, bio, deadline],
        value: parseEther(stake || "0"),
      });
    } catch (err) {
      // error is surfaced via writeError
      console.error(err);
    }
  }

  React.useEffect(() => {
    if (isConfirmed) {
      void refetchGigCount();
      setRole("");
      setBio("");
      // keep stake/duration as-is for convenience
    }
  }, [isConfirmed, refetchGigCount]);

  return (
    <div className="p-6 max-w-[800px] mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Laburo Directory (Alpha)</h1>
        <p className="text-muted-foreground">
          Staked talent directory on Scroll. Talent stakes ETH to signal skin in
          the game. Recruiters (and their agents) pay per lead via x402 to
          unlock contact info.
        </p>
      </header>

      <section className="border border-border p-4 mb-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Wallet</h2>
        <p>Network: Scroll Sepolia</p>
        <p>Status: {account.status}</p>
        <p>Address: {account.address ?? "Not connected"}</p>

        {account.status === "connected" ? (
          <Button
            variant="outline"
            onClick={() => disconnect()}
            className="mt-2"
          >
            Disconnect
          </Button>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={status === "pending"}
                variant="outline"
              >
                {connector.name}
              </Button>
            ))}
          </div>
        )}
        <div className="mt-2">
          <span>Connection status: {status}</span>
          {error && (
            <div className="text-destructive mt-1">{error.message}</div>
          )}
        </div>
      </section>

      <section className="border border-border p-4 mb-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">List your staked profile</h2>
        <p className="mb-4 text-muted-foreground">
          List your profile by staking ETH. This is not a payment to a platform,
          it is a signal: if your profile is clearly fake in later versions of
          the protocol, stake can be partially slashed.
        </p>

        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">
              Role / Skillset
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Rust Engineer, ZK exp"
                className="w-full mt-1 p-2 border border-input rounded-md bg-background"
              />
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Bio / Experience
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="5y exp, worked on DeFi + ZK rollups..."
                rows={4}
                className="w-full mt-1 p-2 border border-input rounded-md bg-background"
              />
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Stake Amount (ETH)
              <input
                type="number"
                min="0"
                step="0.001"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full mt-1 p-2 border border-input rounded-md bg-background"
              />
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Listing Duration (hours)
              <input
                type="number"
                min="1"
                step="1"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="w-full mt-1 p-2 border border-input rounded-md bg-background"
              />
            </label>
          </div>

          <Button
            type="submit"
            disabled={
              account.status !== "connected" || isPending || isConfirming
            }
          >
            {isPending || isConfirming
              ? "Submitting..."
              : "Stake & List Profile"}
          </Button>

          <div className="mt-2">
            {writeError && (
              <div className="text-destructive">{writeError.message}</div>
            )}
            {txError && (
              <div className="text-destructive">{txError.message}</div>
            )}
            {txHash && (
              <div>
                Tx hash:{" "}
                <code className="text-xs bg-muted p-1 rounded">
                  {String(txHash)}
                </code>
              </div>
            )}
            {isConfirmed && (
              <div className="text-green-600 dark:text-green-400">
                Profile listed on-chain. Refreshing directory...
              </div>
            )}
          </div>
        </form>
      </section>

      <section className="border border-border p-4 mb-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          Staked talent directory (from Scroll)
        </h2>
        {isLoadingCount && (
          <p className="text-muted-foreground">Loading profiles...</p>
        )}
        {gigCountError && (
          <p className="text-destructive">
            Error loading profiles: {gigCountError.message}
          </p>
        )}
        <p className="mb-2">Total profiles on-chain: {gigCount}</p>

        {gigCount === 0 && (
          <p className="text-muted-foreground">
            No profiles yet. Be the first to stake and list.
          </p>
        )}

        {latestGigId && latestGig && (
          <div className="border border-border p-4 mt-3 rounded-lg bg-card text-card-foreground">
            <h3 className="text-lg font-bold">
              {latestGig.title || "Untitled profile"}
            </h3>
            <p className="mt-1">{latestGig.description}</p>
            <p className="mt-2 text-sm font-medium">
              🛡️ Staked: {latestGig.stakeEth} ETH (on Scroll Sepolia, contract
              escrow)
            </p>
            <p className="text-sm">
              Status:{" "}
              {(() => {
                switch (latestGig.status) {
                  case 0:
                    return "Open / Listed";
                  case 1:
                    return "Assigned";
                  case 2:
                    return "Completed";
                  default:
                    return `Unknown (${latestGig.status})`;
                }
              })()}
            </p>
            <p className="text-sm">
              Deadline (listing TTL placeholder):{" "}
              {latestGig.deadline.toString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Bid count (unused in this MVP): {latestGig.bidCount}
            </p>

            <div className="mt-2">
              {!revealClicked ? (
                <>
                  <p className="mb-2">
                    Contact: <strong>[LOCKED]</strong> — 402 Payment Required
                    via x402/Crossmint (mocked).
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setRevealClicked(true);
                      // in the real flow this would trigger x402 + Crossmint
                      window.alert(
                        "402 Payment Required — this is where the Crossmint x402 pay-to-reveal flow will live."
                      );
                    }}
                  >
                    Reveal Contact
                  </Button>
                </>
              ) : (
                <>
                  <p>
                    Contact (mocked): <strong>alice@example.com</strong> /{" "}
                    <strong>@alice_dev</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    In the real app this would be loaded from Arkiv after a
                    successful x402 payment.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {latestGigId && isLoadingLatestGig && (
          <p className="text-muted-foreground">Loading latest profile…</p>
        )}
        {latestGigId && latestGigError && (
          <p className="text-destructive">
            Error loading latest profile: {latestGigError.message}
          </p>
        )}
      </section>

      <div className="mb-6">
        <Button>Click me</Button>
      </div>

      <AuthButton />
    </div>
  );
}

export default App;
