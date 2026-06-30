"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AircraftMarketplaceFilters } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { getActiveFilterChips } from "@/lib/aviatonly/marketplace/filters";

interface ActiveFilterChipsProps {
  filters: AircraftMarketplaceFilters;
  onRemove: (key: keyof AircraftMarketplaceFilters | string) => void;
}

export function ActiveFilterChips({ filters, onRemove }: ActiveFilterChipsProps) {
  const chips = getActiveFilterChips(filters);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Badge key={String(chip.key) + chip.label} variant="secondary" className="gap-1 pr-1">
          {chip.label}
          <Button
            variant="ghost"
            size="icon"
            className="size-5"
            onClick={() => onRemove(chip.key)}
            aria-label={`Remove ${chip.label} filter`}
          >
            <X />
          </Button>
        </Badge>
      ))}
    </div>
  );
}
