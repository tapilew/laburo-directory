import type { UiGig } from "@/lib/talent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDivider } from "@/components/ui/card";
import { Lock, Unlock, Shield } from "lucide-react";

type TalentCardProps = {
  gig: UiGig;
  onUnlockContact?: () => void;
  isContactUnlocked?: boolean;
};

function statusBadge(status: number): {
  label: string;
  variant: "success" | "warning" | "muted";
} {
  switch (status) {
    case 0:
      return { label: "AVAILABLE", variant: "success" };
    case 1:
      return { label: "BUSY", variant: "warning" };
    case 2:
      return { label: "COMPLETED", variant: "muted" };
    default:
      return { label: "UNKNOWN", variant: "muted" };
  }
}

function formatDeadline(date: Date): { date: string; daysLeft: number } {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const formatted = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return { date: formatted.toUpperCase(), daysLeft };
}

export function TalentCard(props: TalentCardProps) {
  const { gig, onUnlockContact, isContactUnlocked } = props;
  const { label, variant } = statusBadge(gig.status);
  const deadline = formatDeadline(gig.deadline);

  // Parse skills from title or use defaults
  const skills = extractSkills(gig.title, gig.description);

  return (
    <Card className="p-5 sm:p-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <h3 className="text-heading-3 text-[var(--color-fg-primary)] flex-1">
          {gig.title || "Staked Profile"}
        </h3>
        <Badge variant={variant} size="pill">
          {label}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-body text-[var(--color-fg-secondary)] line-clamp-3 mb-4">
        {gig.description}
      </p>

      {/* Skills tags */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-label border border-[var(--color-border)] text-[var(--color-fg-secondary)] rounded-sm transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-fg-primary)]"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <CardDivider />

      {/* Bottom row - Stake info and action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        {/* Stake info */}
        <div className="flex gap-6 sm:gap-8">
          <div>
            <div className="text-label text-[var(--color-fg-muted)] mb-1">
              STAKE
            </div>
            <div className="font-display text-lg text-[var(--color-accent)]">
              {gig.stakeEth} ETH
            </div>
            <div className="text-body-sm text-[var(--color-fg-muted)]">
              ≈ ${formatUsdValue(gig.stakeEth)} USD
            </div>
          </div>

          <div>
            <div className="text-label text-[var(--color-fg-muted)] mb-1">
              DEADLINE
            </div>
            <div className="font-display text-lg text-[var(--color-fg-primary)]">
              {deadline.date}
            </div>
            <div
              className={`text-body-sm ${
                deadline.daysLeft <= 3
                  ? "text-[var(--color-warning)]"
                  : "text-[var(--color-fg-muted)]"
              }`}
            >
              {deadline.daysLeft > 0
                ? `${deadline.daysLeft} days left`
                : deadline.daysLeft === 0
                ? "Expires today"
                : "Expired"}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="sm:text-right">
          {!isContactUnlocked ? (
            <Button
              variant="outlineAccent"
              onClick={onUnlockContact}
              className="w-full sm:w-auto"
            >
              <Lock className="w-4 h-4 mr-2" />
              UNLOCK
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--color-success)]">
                <Unlock className="w-4 h-4" />
                <span className="text-label">UNLOCKED</span>
              </div>
              <div className="text-body-sm text-[var(--color-fg-secondary)]">
                <p className="font-medium text-[var(--color-fg-primary)]">
                  alice@laburo.work
                </p>
                <p>@alice_dev</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stake indicator */}
      <div className="mt-4 pt-4 border-t border-[var(--color-divider)] flex items-center gap-2 text-body-sm text-[var(--color-fg-muted)]">
        <Shield className="w-4 h-4 text-[var(--color-accent)]" />
        <span>Secured by {gig.stakeEth} ETH stake on Scroll</span>
      </div>
    </Card>
  );
}

// Helper to extract skills from title and description
function extractSkills(title: string, description: string): string[] {
  const commonSkills = [
    "SOLIDITY",
    "RUST",
    "REACT",
    "TYPESCRIPT",
    "PYTHON",
    "GO",
    "ZK",
    "CIRCOM",
    "ETHEREUM",
    "DEFI",
    "NFT",
    "DAO",
    "FULL-STACK",
    "SMART CONTRACTS",
    "SECURITY",
    "DEVOPS",
  ];

  const text = (title + " " + description).toUpperCase();
  const found = commonSkills.filter((skill) => text.includes(skill));

  // Return found skills or default to general categories
  return found.length > 0 ? found.slice(0, 4) : ["WEB3", "BLOCKCHAIN"];
}

// Helper to format USD value (mock conversion)
function formatUsdValue(ethAmount: string): string {
  const eth = parseFloat(ethAmount) || 0;
  const usd = eth * 2500; // Mock ETH price
  return usd.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
