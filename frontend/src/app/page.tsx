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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardDivider } from "@/components/ui/card";
import { AuthButton } from "@/components/auth-button";
import { Wallet } from "@/components/wallet";
import { Hero } from "@/components/features/hero";
import { PaymentModal } from "@/components/features/payment-modal";
import { TalentList } from "@/components/features/talent-list";
import { TopUpModal } from "@/components/features/topup-modal";
import type { UiGig } from "@/lib/talent";
import { Separator } from "@/components/ui/separator";

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

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
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
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-semibold tracking-tight text-[var(--color-fg-primary)]">
              LABURO
            </span>
            <span className="hidden text-label text-[var(--color-fg-muted)] sm:inline">
              STAKED TALENT ON SCROLL
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-body-sm text-[var(--color-fg-secondary)] sm:flex">
            <button
              type="button"
              onClick={() => scrollToSection("talent-directory")}
              className="hover:text-[var(--color-fg-primary)] transition-colors"
            >
              FIND TALENT
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("list-profile")}
              className="hover:text-[var(--color-fg-primary)] transition-colors"
            >
              LIST PROFILE
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <Badge variant="muted" className="hidden sm:inline-flex">
              SCROLL TESTNET
            </Badge>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12 space-y-16">
        {/* Hero Section */}
        <Hero
          onBrowseTalentClick={() => scrollToSection("talent-directory")}
          onListProfileClick={() => scrollToSection("list-profile")}
          stats={{
            profileCount: gigCount,
            totalStaked: latestGig ? `${(gigCount * 0.5).toFixed(2)}` : "0",
            minStake: "0.01",
          }}
        />

        {/* Wallet Section */}
        <section>
          <Wallet onTopUp={() => setIsTopUpOpen(true)} />
        </section>

        {/* List Profile Section */}
        <section id="list-profile" className="scroll-mt-24">
          <Card className="p-0 overflow-hidden">
            {/* Section header */}
            <div className="p-6 border-b border-[var(--color-divider)]">
              <h2 className="text-heading-2 text-[var(--color-fg-primary)]">
                LIST YOUR STAKED PROFILE
              </h2>
              <p className="text-body text-[var(--color-fg-secondary)] mt-2">
                Publish a profile backed by ETH on Scroll. You keep full custody;
                stake simply acts as a signal that you're serious.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateProfile} className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  label="ROLE / SKILLSET"
                  placeholder="Solidity engineer, full-stack, growth, PM..."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <div className="sm:row-span-2">
                  <Textarea
                    label="BIO / EXPERIENCE"
                    placeholder="5+ years leading engineering teams, built DeFi protocols on Scroll and Ethereum..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="h-full min-h-[120px]"
                  />
                </div>
                <Input
                  label="STAKE AMOUNT (ETH)"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  helperText="You can always withdraw your stake after the engagement"
                />
                <Input
                  label="LISTING DURATION (HOURS)"
                  type="number"
                  min="1"
                  step="1"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  helperText="How long your profile stays highlighted in the directory"
                />
              </div>

              {hasInsufficientFunds && (
                <div className="flex items-start gap-3 p-4 bg-[var(--color-error-subtle)] border border-[var(--color-error)]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-error)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-body-sm text-[var(--color-error)]">
                    You don't have enough ETH on Scroll for this stake amount
                    and gas.{" "}
                    <button
                      type="button"
                      onClick={() => setIsTopUpOpen(true)}
                      className="underline hover:no-underline"
                    >
                      Top up
                    </button>{" "}
                    or lower the stake.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={listProfileDisabled}
                  loading={isSubmitting || isConfirming}
                >
                  STAKE & LIST PROFILE
                </Button>

                {hash && (
                  <span className="text-body-sm text-[var(--color-fg-muted)]">
                    TX: {" "}
                    <code className="text-code bg-[var(--color-bg-tertiary)] px-2 py-1">
                      {hash.slice(0, 10)}...{hash.slice(-6)}
                    </code>
                  </span>
                )}
              </div>

              {friendlyError && (
                <p className="text-body-sm text-[var(--color-error)]">
                  {friendlyError}
                </p>
              )}

              {isConfirmed && (
                <div className="flex items-center gap-2 text-[var(--color-success)]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="text-body-sm">
                    Profile listed on Scroll. Your profile will appear in the
                    directory shortly.
                  </span>
                </div>
              )}
            </form>
          </Card>
        </section>

        {/* Talent Directory Section */}
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
          walletConnected={walletStatus === "connected"}
          onConnectWallet={() => {}}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] mt-16">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-semibold text-[var(--color-fg-primary)]">
                LABURO
              </span>
              <span className="text-body-sm text-[var(--color-fg-muted)]">
                Staked talent marketplace on Scroll
              </span>
            </div>
            <div className="flex items-center gap-4 text-body-sm text-[var(--color-fg-muted)]">
              <a
                href="#"
                className="hover:text-[var(--color-fg-primary)] transition-colors"
              >
                Docs
              </a>
              <a
                href="#"
                className="hover:text-[var(--color-fg-primary)] transition-colors"
              >
                GitHub
              </a>
              <a
                href="#"
                className="hover:text-[var(--color-fg-primary)] transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
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
