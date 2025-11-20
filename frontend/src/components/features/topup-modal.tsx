import { Button } from "@/components/ui/button";

type TopUpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TopUpModal(props: TopUpModalProps) {
  const { open, onOpenChange } = props;

  if (!open) return null;

  const handleClose = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Add funds to Scroll</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose how you want to top up your Scroll balance. We&apos;ll
              send you to a verified partner.
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

        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="font-medium">Card / Apple Pay</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Buy ETH directly on Scroll using Stripe, MoonPay or similar
              providers.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background p-3">
            <p className="font-medium">Bridge from another network</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use a bridge to move ETH from Ethereum, Base or other L2s into
              Scroll.
            </p>
          </div>

          <Button className="w-full mt-1" variant="outline" onClick={handleClose}>
            Continue with a partner
          </Button>

          <p className="text-[0.7rem] text-muted-foreground">
            This flow is for illustration. In production, you&apos;d be sent to
            your selected provider with the correct network pre-selected.
          </p>
        </div>
      </div>
    </div>
  );
}


