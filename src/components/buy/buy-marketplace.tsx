"use client";

import { useMemo, useState } from "react";
import { AircraftEmptyState } from "@/components/buy/aircraft-empty-state";
import { AircraftFilterSidebar } from "@/components/buy/aircraft-filter-sidebar";
import { AircraftListingGrid } from "@/components/buy/aircraft-listing-grid";
import { AircraftResultsToolbar } from "@/components/buy/aircraft-results-toolbar";
import { MobileFilterSheet } from "@/components/buy/mobile-filter-sheet";
import type { AircraftMarketplaceFilters, SortOption } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import {
  DEFAULT_FILTERS,
  filterListings,
  removeFilterChip,
} from "@/lib/aviatonly/marketplace/filters";
import { MOCK_AIRCRAFT_LISTINGS } from "@/lib/aviatonly/marketplace/mock-aircraft-listings";
import { sortListings } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";

export function BuyMarketplace() {
  const [filters, setFilters] = useState<AircraftMarketplaceFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("NEWEST");

  const filtered = useMemo(() => {
    const results = filterListings(MOCK_AIRCRAFT_LISTINGS, filters);
    return sortListings(results, sort);
  }, [filters, sort]);

  const updateFilters = (next: AircraftMarketplaceFilters) => {
    setFilters(next);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleSearchChange = (searchTerm: string) => {
    updateFilters({ ...filters, searchTerm });
  };

  const handleRemoveFilter = (key: keyof AircraftMarketplaceFilters | string) => {
    updateFilters(removeFilterChip(filters, key));
  };

  return (
    <div className="flex flex-col p-4 lg:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="sticky top-4 z-10 hidden max-h-[calc(100vh-6rem)] shrink-0 overflow-y-auto rounded-xl border bg-card shadow-sm lg:block lg:w-[300px] xl:w-[320px]">
          <AircraftFilterSidebar filters={filters} onChange={updateFilters} onReset={resetFilters} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b px-4 py-3 lg:hidden">
            <MobileFilterSheet
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
            />
          </div>

          <div className="flex flex-col gap-5 p-4 lg:p-5">
            <AircraftResultsToolbar
              sort={sort}
              filters={filters}
              searchTerm={filters.searchTerm}
              onSearchChange={handleSearchChange}
              onSortChange={setSort}
              onRemoveFilter={handleRemoveFilter}
            />

            {filtered.length === 0 ? (
              <AircraftEmptyState onReset={resetFilters} />
            ) : (
              <AircraftListingGrid listings={filtered} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
