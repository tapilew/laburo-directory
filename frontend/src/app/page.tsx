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
    <div style={{ padding: "1.5rem", maxWidth: 800, margin: "0 auto" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1>Laburo Directory (Alpha)</h1>
        <p>
          Staked talent directory on Scroll. Talent stakes ETH to signal skin in
          the game. Recruiters (and their agents) pay per lead via x402 to
          unlock contact info.
        </p>
      </header>

      <section
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2>Wallet</h2>
        <p>Network: Scroll Sepolia</p>
        <p>Status: {account.status}</p>
        <p>Address: {account.address ?? "Not connected"}</p>

        {account.status === "connected" ? (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        ) : (
          <div style={{ marginTop: "0.5rem" }}>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                type="button"
                disabled={status === "pending"}
                style={{ marginRight: "0.5rem" }}
              >
                {connector.name}
              </button>
            ))}
          </div>
        )}
        <div style={{ marginTop: "0.5rem" }}>
          <span>Connection status: {status}</span>
          {error && (
            <div style={{ color: "red", marginTop: "0.25rem" }}>
              {error.message}
            </div>
          )}
        </div>
      </section>

      <section
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2>List your staked profile</h2>
        <p>
          List your profile by staking ETH. This is not a payment to a platform,
          it is a signal: if your profile is clearly fake in later versions of
          the protocol, stake can be partially slashed.
        </p>

        <form onSubmit={handleCreateProfile}>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Role / Skillset
              <br />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Rust Engineer, ZK exp"
                style={{ width: "100%" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Bio / Experience
              <br />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="5y exp, worked on DeFi + ZK rollups..."
                rows={4}
                style={{ width: "100%" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Stake Amount (ETH)
              <br />
              <input
                type="number"
                min="0"
                step="0.001"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
              />
            </label>
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Listing Duration (hours)
              <br />
              <input
                type="number"
                min="1"
                step="1"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={
              account.status !== "connected" || isPending || isConfirming
            }
          >
            {isPending || isConfirming
              ? "Submitting..."
              : "Stake & List Profile"}
          </button>

          <div style={{ marginTop: "0.5rem" }}>
            {writeError && (
              <div style={{ color: "red" }}>{writeError.message}</div>
            )}
            {txError && <div style={{ color: "red" }}>{txError.message}</div>}
            {txHash && (
              <div>
                Tx hash:{" "}
                <code style={{ fontSize: "0.8rem" }}>{String(txHash)}</code>
              </div>
            )}
            {isConfirmed && (
              <div style={{ color: "green" }}>
                Profile listed on-chain. Refreshing directory...
              </div>
            )}
          </div>
        </form>
      </section>

      <section
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2>Staked talent directory (from Scroll)</h2>
        {isLoadingCount && <p>Loading profiles...</p>}
        {gigCountError && (
          <p style={{ color: "red" }}>
            Error loading profiles: {gigCountError.message}
          </p>
        )}
        <p>Total profiles on-chain: {gigCount}</p>

        {gigCount === 0 && (
          <p>No profiles yet. Be the first to stake and list.</p>
        )}

        {latestGigId && latestGig && (
          <div
            style={{
              border: "1px solid #ccc",
              padding: "0.75rem",
              marginTop: "0.75rem",
            }}
          >
            <h3>{latestGig.title || "Untitled profile"}</h3>
            <p>{latestGig.description}</p>
            <p>
              🛡️ Staked: {latestGig.stakeEth} ETH (on Scroll Sepolia, contract
              escrow)
            </p>
            <p>
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
            <p>
              Deadline (listing TTL placeholder):{" "}
              {latestGig.deadline.toString()}
            </p>
            <p>Bid count (unused in this MVP): {latestGig.bidCount}</p>

            <div style={{ marginTop: "0.5rem" }}>
              {!revealClicked ? (
                <>
                  <p>
                    Contact: <strong>[LOCKED]</strong> — 402 Payment Required
                    via x402/Crossmint (mocked).
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRevealClicked(true);
                      // in the real flow this would trigger x402 + Crossmint
                      window.alert(
                        "402 Payment Required — this is where the Crossmint x402 pay-to-reveal flow will live."
                      );
                    }}
                  >
                    Reveal Contact
                  </button>
                </>
              ) : (
                <>
                  <p>
                    Contact (mocked): <strong>alice@example.com</strong> /{" "}
                    <strong>@alice_dev</strong>
                  </p>
                  <p style={{ fontSize: "0.85rem" }}>
                    In the real app this would be loaded from Arkiv after a
                    successful x402 payment.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {latestGigId && isLoadingLatestGig && <p>Loading latest profile…</p>}
        {latestGigId && latestGigError && (
          <p style={{ color: "red" }}>
            Error loading latest profile: {latestGigError.message}
          </p>
        )}
      </section>

      <Button>Click me</Button>
    </div>
  );
}

export default App;
