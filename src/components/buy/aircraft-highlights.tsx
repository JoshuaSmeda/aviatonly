import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AircraftHighlightsProps {
  highlights: string[];
  className?: string;
}

const detailCardClass =
  "overflow-hidden rounded-xl border border-border bg-card p-5 shadow-none lg:p-6";

export function AircraftHighlights({ highlights, className }: AircraftHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <div className={cn(detailCardClass, "flex h-full flex-col", className)}>
      <h2 className="mb-4 text-xl font-bold text-foreground">What&apos;s special</h2>
      <div className="flex flex-wrap gap-2">
        {highlights.map((highlight) => (
          <Badge
            key={highlight}
            variant="secondary"
            className="rounded-full bg-muted px-3 py-1.5 text-sm font-normal text-foreground"
          >
            {highlight}
          </Badge>
        ))}
      </div>
    </div>
  );
}
