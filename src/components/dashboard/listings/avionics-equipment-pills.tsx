import { Badge } from "@/components/ui/badge";
import { splitAvionicsItems } from "@/lib/aviatonly/domain/avionics-other";
import { cn } from "@/lib/utils";

interface AvionicsEquipmentPillsProps {
  equipment?: string[] | null;
  summary?: string | null;
  emptyLabel?: string;
  className?: string;
}

export function AvionicsEquipmentPills({
  equipment,
  summary,
  emptyLabel = "Not provided",
  className,
}: AvionicsEquipmentPillsProps) {
  const { standard, custom } = splitAvionicsItems(equipment, summary);
  const items = [...standard, ...custom];

  if (items.length === 0) {
    return <span className={cn("text-muted-foreground", className)}>{emptyLabel}</span>;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <Badge key={item} variant="secondary" className="h-auto whitespace-normal px-2.5 py-1">
          {item}
        </Badge>
      ))}
    </div>
  );
}
