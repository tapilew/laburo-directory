/* eslint-disable react/jsx-no-bind */
"use client";

import React from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { GIG_REGISTRY_ADDRESS, gigRegistryAbi } from "@/abi";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/features/hero";
import { PaymentModal } from "@/components/features/payment-modal";
import { TalentList } from "@/components/features/talent-list";
import { TopUpModal } from "@/components/features/topup-modal";
import type { UiGig } from "@/lib/talent";

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

function formatStake(wei: bigint): string {
  if (wei === BigInt(0)) return "0";
  const ethString = (Number(wei) / 1e18).toString();
  const [intPart, fracPart = ""] = ethString.split(".");
  const trimmedFrac = fracPart.slice(0, 4).replace(/0+$/, "");
  return trimmedFrac.length ? `${intPart}.${trimmedFrac}` : intPart;
}

function toUiGig(tuple: GigTuple): UiGig {
  const [id, , , title, description, budget, deadline, status, bidCount] =
    tuple;

  return {
    id: Number(id),
    title,
    description,
    stakeEth: formatStake(budget),
    deadline: new Date(Number(deadline) * 1000),
    status,
    bidCount: Number(bidCount),
  };
}

function App() {
  const { address, status: walletStatus } = useAccount();
  const walletAddress = address;

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
    writeContractAsync,
    data: hash,
    isPending: isSubmitting,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const [role, setRole] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [stake, setStake] = React.useState("0.01");
  const [durationHours, setDurationHours] = React.useState("24");
  const [isContactUnlocked, setIsContactUnlocked] = React.useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = React.useState(false);

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
  } = useBalance({
    address: walletAddress,
    query: {
      enabled: !!walletAddress,
    },
  });

  const requiredStakeWei = React.useMemo(
    () => parseEther(stake || "0"),
    [stake]
  );

  const hasInsufficientFunds =
    !!balanceData && balanceData.value < requiredStakeWei;

  async function handleCreateProfile(event: React.FormEvent) {
    event.preventDefault();
    if (!role || !bio) return;

    if (!walletAddress) {
      console.error("Wallet is not connected");
      return;
    }

    if (hasInsufficientFunds) {
      console.error("Insufficient funds");
      return;
    }

    const hours = Number(durationHours) || 24;
    const nowSeconds = Math.floor(Date.now() / 1000);
    const deadline = BigInt(nowSeconds + hours * 3600);
    const stakeValue = requiredStakeWei;

    try {
      await writeContractAsync({
        address: GIG_REGISTRY_ADDRESS,
        abi: gigRegistryAbi,
        functionName: "createGig",
        args: [role, bio, deadline],
        value: stakeValue,
      });
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    if (isConfirmed) {
      void refetchGigCount();
      setRole("");
      setBio("");
    }
  }, [isConfirmed, refetchGigCount]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const friendlyError =
    writeError || txError
      ? "Something went wrong while listing your profile. Please try again."
      : null;

  const listProfileDisabled =
    walletStatus !== "connected" ||
    !walletAddress ||
    isSubmitting ||
    isConfirming ||
    hasInsufficientFunds;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight">
              Laburo Directory
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Staked talent on Scroll
            </span>
          </div>
          <nav className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
            <button
              type="button"
              onClick={() => scrollToSection("talent-directory")}
              className="hover:text-foreground"
            >
              Find talent
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("list-profile")}
              className="hover:text-foreground"
            >
              List profile
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-medium text-secondary-foreground sm:inline">
              Powered by Scroll
            </span>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-5 sm:py-7">
        <Hero
          onBrowseTalentClick={() => scrollToSection("talent-directory")}
          onListProfileClick={() => scrollToSection("list-profile")}
        />

        <section className="rounded-lg border border-border bg-card/60 p-4 text-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold sm:text-base">
                Your wallet on Scroll
              </h2>
              <p className="text-xs text-muted-foreground">
                Connect a wallet to stake ETH on Scroll and unlock talent
                profiles.
              </p>
            </div>
            <div className="flex flex-col items-start gap-1 text-xs sm:items-end">
              <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[0.7rem] text-secondary-foreground">
                Network: Scroll (testnet)
              </span>
              <span className="text-muted-foreground">
                Status:{" "}
                <span className="font-medium">
                  {walletStatus === "connected"
                    ? "Connected"
                    : walletStatus === "connecting"
                    ? "Connecting"
                    : "Not connected"}
                </span>
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="break-all text-muted-foreground">
              <span className="font-medium text-foreground">Address: </span>
              {walletAddress ?? "Not connected"}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                Balance:{" "}
                {isBalanceLoading
                  ? "Loading..."
                  : balanceData
                  ? `${formatStake(balanceData.value)} ETH`
                  : "—"}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsTopUpOpen(true)}
              >
                Top up
              </Button>
            </div>
          </div>

          {hasInsufficientFunds && (
            <p className="mt-2 text-xs text-destructive">
              You don&apos;t have enough ETH on Scroll for this stake amount and
              gas. Top up or lower the stake.
            </p>
          )}
        </section>

        <section
          id="list-profile"
          className="rounded-lg border border-border bg-card/60 p-4"
        >
          <h2 className="text-base font-semibold sm:text-lg">
            List your staked profile
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Publish a profile backed by ETH on Scroll. You keep full custody;
            stake simply acts as a signal that you&apos;re serious.
          </p>

          <form
            onSubmit={handleCreateProfile}
            className="mt-4 space-y-4 text-sm"
          >
            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Role / skillset
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Solidity engineer, full-stack, growth, PM..."
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Bio / experience
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="5+ years leading engineering teams, built DeFi protocols on Scroll and Ethereum..."
                rows={4}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground">
                  Stake amount (ETH)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <p className="mt-1 text-[0.7rem] text-muted-foreground">
                  You can always withdraw your stake after the engagement.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground">
                  Listing duration (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <p className="mt-1 text-[0.7rem] text-muted-foreground">
                  How long your profile stays highlighted in the directory.
                </p>
              </div>
            </div>

            <Button type="submit" disabled={listProfileDisabled}>
              {isSubmitting || isConfirming
                ? "Submitting…"
                : "Stake & list profile"}
            </Button>

            <div className="mt-2 space-y-1 text-xs">
              {friendlyError && (
                <p className="text-destructive">{friendlyError}</p>
              )}
              {hash && (
                <p className="text-muted-foreground">
                  Transaction sent on Scroll:{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[0.7rem]">
                    {String(hash)}
                  </code>
                </p>
              )}
              {isConfirmed && (
                <p className="text-emerald-500">
                  Profile listed on Scroll. Your profile will appear in the
                  directory shortly.
                </p>
              )}
            </div>
          </form>
        </section>

        <TalentList
          totalCount={gigCount}
          latestGig={latestGig}
          isLoading={isLoadingCount || isLoadingLatestGig}
          error={
            gigCountError || latestGigError
              ? "Unable to load directory."
              : undefined
          }
          isContactUnlocked={isContactUnlocked}
          onUnlockContact={() => setIsPaymentOpen(true)}
        />
      </main>

      <PaymentModal
        open={isPaymentOpen}
        onOpenChange={(open) => {
          setIsPaymentOpen(open);
        }}
        amountEth={latestGig?.stakeEth ?? "0.01"}
        onCompleted={() => {
          setIsContactUnlocked(true);
        }}
      />

      <TopUpModal open={isTopUpOpen} onOpenChange={setIsTopUpOpen} />
    </div>
  );
}

export default App;
