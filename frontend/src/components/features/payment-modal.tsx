import React from "react";
import { Button } from "@/components/ui/button";

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
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">
              Unlock contact via Scroll payment
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Funds are held in a lightweight x402-style escrow. You only pay to
              unlock this specific lead.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Close
          </button>
        </div>

        {step === "review" && (
          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">{amountEth || "0.01"} ETH</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Network fee (Scroll)</span>
                <span>{"< $0.01"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2 text-xs text-secondary-foreground">
              <span>Settlement</span>
              <span className="font-medium">Instant on Scroll</span>
            </div>

            <Button className="w-full" onClick={handleConfirm}>
              Confirm &amp; pay on Scroll
            </Button>
          </div>
        )}

        {step === "processing" && (
          <div className="mt-6 space-y-2 text-sm">
            <p className="font-medium">Processing payment…</p>
            <p className="text-xs text-muted-foreground">
              Confirm the transaction in your wallet. This usually settles in a
              couple of seconds on Scroll.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="mt-6 space-y-2 text-sm">
            <p className="font-medium">Payment confirmed on Scroll.</p>
            <p className="text-xs text-muted-foreground">
              Contact details are now unlocked for this profile. You can always
              come back to this lead from your activity history.
            </p>
            <Button
              className="mt-3 w-full"
              variant="outline"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


