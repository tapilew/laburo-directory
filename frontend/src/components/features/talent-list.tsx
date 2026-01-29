import type { UiGig } from "@/lib/talent";
import { TalentCard } from "./talent-card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, Users, Wallet, Diamond, Filter } from "lucide-react";

type TalentListProps = {
  totalCount: number;
  latestGig?: UiGig;
  isLoading: boolean;
  error?: string;
  isContactUnlocked: boolean;
  onUnlockContact: () => void;
  walletConnected?: boolean;
  onConnectWallet?: () => void;
};

export function TalentList(props: TalentListProps) {
  const {
    totalCount,
    latestGig,
    isLoading,
    error,
    isContactUnlocked,
    onUnlockContact,
    walletConnected,
    onConnectWallet,
  } = props;

  return (
    <section id="talent-directory" className="space-y-6">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b border-[var(--color-divider)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-heading-2 text-[var(--color-fg-primary)]">
              STAKED TALENT DIRECTORY
            </h2>
            <Badge variant="muted" className="hidden sm:inline-flex">
              {totalCount.toLocaleString()} PROFILES
            </Badge>
          </div>
          <p className="text-body text-[var(--color-fg-secondary)]">
            Every profile has ETH at stake. Browse with confidence.
          </p>
        </div>
        <Badge variant="muted" className="sm:hidden self-start">
          {totalCount.toLocaleString()} PROFILES
        </Badge>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <div className="flex gap-2 flex-1">
          <Button variant="secondary" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            ALL
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            AVAILABLE
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            HIGHEST STAKE
          </Button>
        </div>
        <div className="text-body-sm text-[var(--color-fg-muted)] flex items-center">
          Showing {totalCount === 0 ? 0 : 1} of {totalCount.toLocaleString()}
        </div>
      </div>

      {/* Content states */}
      {isLoading && (
        <div className="space-y-4">
          <SkeletonCard />
        </div>
      )}

      {error && (
        <div className="bg-[var(--color-error-subtle)] border border-[var(--color-error)] p-6 text-center">
          <p className="text-body text-[var(--color-error)] mb-2">
            Unable to load talent directory
          </p>
          <p className="text-body-sm text-[var(--color-fg-muted)]">
            {error}
          </p>
        </div>
      )}

      {!isLoading && !error && !walletConnected && (
        <EmptyState
          icon={<Wallet className="w-12 h-12" />}
          title="CONNECT TO BROWSE"
          description="Connect your wallet to view staked talent profiles and unlock contact details."
          action={
            <Button onClick={onConnectWallet}>CONNECT WALLET</Button>
          }
        />
      )}

      {!isLoading && !error && walletConnected && totalCount === 0 && (
        <EmptyState
          icon={<Diamond className="w-12 h-12" />}
          title="NO PROFILES YET"
          description="Be the first to stake your profile and signal your availability to recruiters."
          action={
            <Button variant="secondary">LIST MY PROFILE</Button>
          }
        />
      )}

      {!isLoading && !error && walletConnected && totalCount > 0 && latestGig && (
        <div className="space-y-4">
          <TalentCard
            gig={latestGig}
            isContactUnlocked={isContactUnlocked}
            onUnlockContact={onUnlockContact}
          />
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && walletConnected && totalCount > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-divider)]">
          <span className="text-body-sm text-[var(--color-fg-muted)]">
            Showing 1 of {totalCount.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>
              PREV
            </Button>
            <Button variant="primary" size="sm" className="min-w-[40px]">
              1
            </Button>
            <Button variant="secondary" size="sm" disabled>
              NEXT
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border border-[var(--color-border)] border-dashed">
      <div className="text-[var(--color-fg-muted)] mb-4">{icon}</div>
      <h3 className="text-heading-3 text-[var(--color-fg-primary)] mb-2">
        {title}
      </h3>
      <p className="text-body text-[var(--color-fg-secondary)] text-center max-w-md mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}
