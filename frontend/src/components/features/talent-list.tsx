import type { UiGig } from "@/lib/talent";
import { TalentCard } from "./talent-card";

type TalentListProps = {
  totalCount: number;
  latestGig?: UiGig;
  isLoading: boolean;
  error?: string;
  isContactUnlocked: boolean;
  onUnlockContact: () => void;
};

export function TalentList(props: TalentListProps) {
  const {
    totalCount,
    latestGig,
    isLoading,
    error,
    isContactUnlocked,
    onUnlockContact,
  } = props;

  return (
    <section
      id="talent-directory"
      className="space-y-3 rounded-lg border border-border bg-card/40 p-4"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold sm:text-lg">
            Staked talent directory
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Every profile has ETH at stake on Scroll. Start with the freshest
            listings.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {totalCount === 0
            ? "No profiles yet — be the first to list."
            : totalCount === 1
            ? "1 profile listed on-chain"
            : `${totalCount} profiles listed on-chain`}
        </p>
      </div>

      {isLoading && (
        <p className="text-xs text-muted-foreground">Loading profiles…</p>
      )}

      {error && (
        <p className="text-xs text-destructive">
          We couldn&apos;t load profiles right now. Please try again in a
          minute.
        </p>
      )}

      {!isLoading && !error && latestGig && (
        <div className="mt-2 grid grid-cols-1 gap-3">
          <TalentCard
            gig={latestGig}
            isContactUnlocked={isContactUnlocked}
            onUnlockContact={onUnlockContact}
          />
        </div>
      )}
    </section>
  );
}


