import { Button } from "@/components/ui/button";

type HeroProps = {
  onListProfileClick?: () => void;
  onBrowseTalentClick?: () => void;
};

export function Hero(props: HeroProps) {
  const { onListProfileClick, onBrowseTalentClick } = props;

  return (
    <section className="py-6 sm:py-8 space-y-4">
      <div className="space-y-2">
        <p className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Powered by Scroll
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
          Hire staked, verified talent on Scroll.
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
          Professionals lock ETH as skin in the game. You unlock warm,
          high-intent leads with a simple on-chain payment.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <Button size="lg" className="w-full sm:w-auto" onClick={onBrowseTalentClick}>
          Find talent
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onListProfileClick}
        >
          List my profile
        </Button>
      </div>
    </section>
  );
}


