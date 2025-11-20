import type { UiGig } from "@/lib/talent";
import { Button } from "@/components/ui/button";

type TalentCardProps = {
  gig: UiGig;
  onUnlockContact?: () => void;
  isContactUnlocked?: boolean;
};

function statusLabel(status: number): { label: string; tone: "green" | "amber" | "slate" } {
  switch (status) {
    case 0:
      return { label: "Available now", tone: "green" };
    case 1:
      return { label: "Busy / In contract", tone: "amber" };
    case 2:
      return { label: "Completed engagement", tone: "slate" };
    default:
      return { label: "Status unknown", tone: "slate" };
  }
}

export function TalentCard(props: TalentCardProps) {
  const { gig, onUnlockContact, isContactUnlocked } = props;
  const { label, tone } = statusLabel(gig.status);

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold leading-tight">
            {gig.title || "Staked profile"}
          </h3>
          <p className="mt-1 line-clamp-3 text-xs text-muted-foreground sm:text-sm">
            {gig.description}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-2 sm:mt-0">
          <span
            className={[
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              tone === "green" && "bg-emerald-500/15 text-emerald-500",
              tone === "amber" && "bg-amber-500/15 text-amber-500",
              tone === "slate" && "bg-slate-500/15 text-slate-400",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center rounded-full bg-secondary/70 px-2 py-0.5 text-[0.7rem] font-medium text-secondary-foreground">
          🛡️ Staked {gig.stakeEth} ETH on Scroll
        </span>
        <span className="hidden text-[0.7rem] sm:inline">
          Deadline: {gig.deadline.toLocaleDateString()}
        </span>
      </div>

      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.7rem] text-muted-foreground sm:text-xs">
          You only pay to unlock this profile&apos;s contact details. No monthly
          subscriptions, no noise.
        </p>
        {!isContactUnlocked ? (
          <Button
            size="sm"
            className="w-full sm:w-auto"
            variant="secondary"
            onClick={onUnlockContact}
          >
            Unlock contact
          </Button>
        ) : (
          <div className="w-full text-xs sm:text-sm">
            <p className="font-medium">Contact details</p>
            <p>alice@laburo.work · @alice_dev</p>
            <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
              Saved to your activity history after this payment.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}


