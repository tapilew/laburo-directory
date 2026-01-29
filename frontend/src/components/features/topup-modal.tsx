import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, CreditCard, ArrowRightLeft, ExternalLink, AlertCircle } from "lucide-react";

type TopUpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TopUpModal(props: TopUpModalProps) {
  const { open, onOpenChange } = props;

  if (!open) return null;

  const handleClose = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-bg-primary)]/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-[var(--color-divider)]">
          <div>
            <h2 className="text-heading-3 text-[var(--color-fg-primary)]">
              ADD FUNDS
            </h2>
            <p className="text-body-sm text-[var(--color-fg-muted)] mt-1">
              Top up your Scroll balance to stake and unlock
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Option 1: Card/Apple Pay */}
          <div className="group bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-4 cursor-pointer transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <CreditCard className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-4 text-[var(--color-fg-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    Card / Apple Pay
                  </h3>
                  <ExternalLink className="w-4 h-4 text-[var(--color-fg-muted)]" />
                </div>
                <p className="text-body-sm text-[var(--color-fg-secondary)] mt-1">
                  Buy ETH directly on Scroll using Stripe, MoonPay or similar
                  providers
                </p>
              </div>
            </div>
          </div>

          {/* Option 2: Bridge */}
          <div className="group bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-4 cursor-pointer transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <ArrowRightLeft className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-heading-4 text-[var(--color-fg-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    Bridge from Another Network
                  </h3>
                  <ExternalLink className="w-4 h-4 text-[var(--color-fg-muted)]" />
                </div>
                <p className="text-body-sm text-[var(--color-fg-secondary)] mt-1">
                  Use a bridge to move ETH from Ethereum, Base or other L2s into
                  Scroll
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Info box */}
          <div className="flex items-start gap-3 p-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
            <AlertCircle className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
            <p className="text-body-sm text-[var(--color-fg-secondary)]">
              You'll be redirected to a verified partner. Make sure the
              Scroll network is pre-selected.
            </p>
          </div>

          {/* CTA */}
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleClose}
          >
            CONTINUE WITH PARTNER
          </Button>

          <p className="text-body-sm text-[var(--color-fg-muted)] text-center">
            This flow is for illustration. In production, you'd be sent to
            your selected provider.
          </p>
        </div>
      </div>
    </div>
  );
}
