import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface AircraftEmptyStateProps {
  onReset: () => void;
}

export function AircraftEmptyState({ onReset }: AircraftEmptyStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Plane />
        </EmptyMedia>
        <EmptyTitle>No aircraft match your filters</EmptyTitle>
        <EmptyDescription>
          Try removing a few filters or broadening your search criteria to see more curated listings.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={onReset}>Reset filters</Button>
          <Button variant="outline" onClick={onReset}>
            View all aircraft
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
