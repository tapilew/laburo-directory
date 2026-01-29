import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Check, Loader2, ExternalLink } from "lucide-react";

type PaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountEth: string;
  onCompleted: () => void;
};

type Step = "review" | "processing" | "success";

export function PaymentModal(props: PaymentModalProps) {
  const { open, onOpenChange, amountEth, onCompleted } = props;
  const [step, setStep] = React.useState<Step>("review");

  React.useEffect(() => {
    if (!open) {
      setStep("review");
    }
  }, [open]);

  if (!open) return null;

  const handleClose = () => onOpenChange(false);

  const handleConfirm = () => {
    setStep("processing");
    window.setTimeout(() => {
      setStep("success");
      onCompleted();
    }, 2000);
  };

  const ethAmount = amountEth || "0.01";
  const usdAmount = (parseFloat(ethAmount) * 2500).toFixed(2);

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
              UNLOCK CONTACT
            </h2>
            <p className="text-body-sm text-[var(--color-fg-muted)] mt-1">
              Pay to reveal this talent's contact details
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
        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <StepIndicator step={step} />
          </div>

          {step === "review" && (
            <div className="space-y-6">
              {/* Payment summary */}
              <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body text-[var(--color-fg-secondary)]">
                    Amount
                  </span>
                  <span className="font-display text-lg text-[var(--color-fg-primary)]">
                    {ethAmount} ETH
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-[var(--color-fg-muted)]">
                    Network fee (Scroll)
                  </span>
                  <span className="text-[var(--color-fg-secondary)]">
                    {'< $0.01'}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-label text-[var(--color-fg-secondary)]">
                    TOTAL
                  </span>
                  <div className="text-right">
                    <div className="font-display text-xl text-[var(--color-accent)]">
                      {ethAmount} ETH
                    </div>
                    <div className="text-body-sm text-[var(--color-fg-muted)]">
                      ≈ ${usdAmount} USD
                    </div>
                  </div>
                </div>
              </div>

              {/* Settlement info */}
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-[var(--color-fg-muted)]">Settlement</span>
                <Badge variant="success" size="pill">
                  INSTANT ON SCROLL
                </Badge>
              </div>

              {/* CTA */}
              <Button className="w-full" size="lg" onClick={handleConfirm}>
                CONFIRM & PAY
              </Button>

              <p className="text-body-sm text-[var(--color-fg-muted)] text-center">
                Funds are held in escrow until contact is unlocked
              </p>
            </div>
          )}

          {step === "processing" && (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent-subtle)]">
                <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
              </div>
              <div>
                <p className="text-heading-4 text-[var(--color-fg-primary)]">
                  PROCESSING PAYMENT
                </p>
                <p className="text-body text-[var(--color-fg-secondary)] mt-2">
                  Confirm the transaction in your wallet
                </p>
              </div>
              <div className="bg-[var(--color-bg-tertiary)] p-3 text-body-sm text-[var(--color-fg-muted)]">
                This usually settles in 2-3 seconds on Scroll
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-success-subtle)]">
                <Check className="w-8 h-8 text-[var(--color-success)]" />
              </div>
              <div>
                <p className="text-heading-4 text-[var(--color-fg-primary)]">
                  PAYMENT CONFIRMED
                </p>
                <p className="text-body text-[var(--color-fg-secondary)] mt-2">
                  Contact details are now unlocked
                </p>
              </div>

              {/* Transaction hash placeholder */}
              <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-3 text-left">
                <div className="text-label text-[var(--color-fg-muted)] mb-1">
                  TRANSACTION
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-code text-[var(--color-fg-secondary)] flex-1 truncate">
                    0x7f8a9b...2c3d4e
                  </code>
                  <button className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full"
                onClick={handleClose}
              >
                CLOSE
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { id: "review", label: "REVIEW" },
    { id: "processing", label: "PAY" },
    { id: "success", label: "CONFIRM" },
  ];

  const currentIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center w-full">
      {steps.map((s, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <React.Fragment key={s.id}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full transition-colors ${
                  isCompleted || isCurrent
                    ? "bg-[var(--color-accent)]"
                    : "bg-[var(--color-border)]"
                } ${isCurrent ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg-secondary)]" : ""}`}
              />
              <span
                className={`text-[10px] mt-1.5 tracking-wider ${
                  isCompleted || isCurrent
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-fg-muted)]"
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  isCompleted
                    ? "bg-[var(--color-accent)]"
                    : "bg-[var(--color-border)]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
