"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AircraftFilterSidebar } from "@/components/buy/aircraft-filter-sidebar";
import type { AircraftMarketplaceFilters } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";

interface MobileFilterSheetProps {
  filters: AircraftMarketplaceFilters;
  onChange: (filters: AircraftMarketplaceFilters) => void;
  onReset: () => void;
}

export function MobileFilterSheet({ filters, onChange, onReset }: MobileFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" className="flex-1">
            <SlidersHorizontal data-icon="inline-start" />
            Filter
          </Button>
        }
      />
      <SheetContent side="left" className="w-full max-w-sm gap-0 p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Filter aircraft</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-5 py-4">
          <AircraftFilterSidebar
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            variant="sheet"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
