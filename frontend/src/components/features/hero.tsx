"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  onListProfileClick?: () => void;
  onBrowseTalentClick?: () => void;
  stats?: {
    profileCount: number;
    totalStaked: string;
    minStake: string;
  };
}

export function Hero(props: HeroProps) {
  const { onListProfileClick, onBrowseTalentClick, stats } = props;

  return (
    <section className="relative py-12 sm:py-16 lg:py-24 animate-fade-in-up">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

      <div className="relative space-y-8">
        {/* Live badge */}
        <div className="animate-fade-in stagger-1">
          <Badge
            variant="muted"
            dot
            dotColor="success"
            className="border-[var(--color-border)]"
          >
            LIVE ON SCROLL
          </Badge>
        </div>

        {/* Main headline - asymmetric layout */}
        <div className="max-w-4xl animate-fade-in-up stagger-2">
          <h1 className="text-display-lg sm:text-display-xl font-display text-[var(--color-fg-primary)]">
            HIRE STAKED
            <br />
            <span className="text-[var(--color-accent)]">TALENT</span>
          </h1>
        </div>

        {/* Subheadline */}
        <div className="max-w-xl animate-fade-in-up stagger-3">
          <p className="text-body-lg text-[var(--color-fg-secondary)]">
            Professionals lock ETH as skin in the game. You unlock warm,
            high-intent leads with a simple on-chain payment.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-4">
          <Button
            size="lg"
            onClick={onBrowseTalentClick}
            className="w-full sm:w-auto"
          >
            FIND TALENT
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={onListProfileClick}
            className="w-full sm:w-auto"
          >
            LIST MY PROFILE
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 animate-fade-in-up stagger-5">
          <StatBox
            value={stats?.profileCount ?? "—"}
            label="PROFILES STAKED"
            isNumber={typeof stats?.profileCount === "number"}
          />
          <StatBox
            value={stats?.totalStaked ?? "—"}
            label="TOTAL STAKE"
            suffix=" ETH"
          />
          <StatBox
            value={stats?.minStake ?? "0.01"}
            label="MIN STAKE"
            suffix=" ETH"
          />
        </div>
      </div>
    </section>
  );
}

interface StatBoxProps {
  value: string | number;
  label: string;
  suffix?: string;
  isNumber?: boolean;
}

function StatBox({ value, label, suffix = "", isNumber = false }: StatBoxProps) {
  const displayValue = isNumber && typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 sm:p-5 transition-all duration-200 hover:border-[var(--color-border-hover)]">
      <div className="font-display text-display-sm text-[var(--color-accent)]">
        {displayValue}
        {suffix && <span className="text-[var(--color-fg-secondary)]">{suffix}</span>}
      </div>
      <div className="text-label text-[var(--color-fg-muted)] mt-1">
        {label}
      </div>
    </div>
  );
}
