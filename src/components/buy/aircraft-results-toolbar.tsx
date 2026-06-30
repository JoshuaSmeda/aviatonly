"use client";

import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ActiveFilterChips } from "@/components/buy/active-filter-chips";
import type { AircraftMarketplaceFilters, SortOption } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { getSortLabel } from "@/lib/aviatonly/marketplace/filter-labels";
import { SORT_OPTIONS } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";

interface AircraftResultsToolbarProps {
  sort: SortOption;
  filters: AircraftMarketplaceFilters;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSortChange: (sort: SortOption) => void;
  onRemoveFilter: (key: keyof AircraftMarketplaceFilters | string) => void;
}

export function AircraftResultsToolbar({
  sort,
  filters,
  searchTerm,
  onSearchChange,
  onSortChange,
  onRemoveFilter,
}: AircraftResultsToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <InputGroup className="h-9 flex-1 bg-background">
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search registration, make, model, or airfield"
          />
        </InputGroup>

        <Select value={sort} onValueChange={(value) => value && onSortChange(value as SortOption)}>
          <SelectTrigger className="w-full bg-background lg:w-52">
            <span>{getSortLabel(sort)}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <ActiveFilterChips filters={filters} onRemove={onRemoveFilter} />
    </div>
  );
}
