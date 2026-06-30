"use client";

import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  HandCoins,
  LayoutGrid,
  Plane,
  Radio,
  RotateCcw,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { FilterPill, FilterPillGroup } from "@/components/buy/filter-pill";
import {
  AIRFIELD_OPTIONS,
  AVIONICS_FLAG_OPTIONS,
  MAINTENANCE_FLAG_OPTIONS,
  MAKE_OPTIONS,
  PROVINCE_OPTIONS,
} from "@/lib/aviatonly/marketplace/filters";
import type { AircraftMarketplaceFilters } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import {
  formatPriceFilterAmount,
  getAirfieldLabel,
  getCategoryFilterLabel,
  getMakeLabel,
  getProvinceLabel,
  getTtafFilterLabel,
  isPriceFilterActive,
  PRICE_FILTER_MAX,
  PRICE_FILTER_MIN,
  PRICE_FILTER_STEP,
} from "@/lib/aviatonly/marketplace/filter-labels";
import { cn } from "@/lib/utils";

interface AircraftFilterSidebarProps {
  filters: AircraftMarketplaceFilters;
  onChange: (filters: AircraftMarketplaceFilters) => void;
  onReset: () => void;
  variant?: "sidebar" | "sheet";
}

const SALE_TYPE_OPTIONS: Array<{
  value: AircraftMarketplaceFilters["saleType"];
  label: string;
  icon: LucideIcon;
}> = [
  { value: "ALL", label: "All", icon: LayoutGrid },
  { value: "FIXED_PRICE", label: "Fixed price", icon: Tag },
  { value: "MAKE_OFFER", label: "Make offer", icon: HandCoins },
  { value: "PRICE_ON_APPLICATION", label: "POA", icon: ClipboardCheck },
];

const CATEGORY_OPTIONS: Array<{
  value: AircraftMarketplaceFilters["category"];
  label: string;
}> = [
  { value: "ALL", label: "All categories" },
  { value: "SINGLE_ENGINE_PISTON", label: "Single engine piston" },
  { value: "MULTI_ENGINE_PISTON", label: "Multi engine piston" },
  { value: "TURBOPROP", label: "Turboprop" },
  { value: "JET", label: "Jet" },
  { value: "HELICOPTER", label: "Helicopter" },
  { value: "LIGHT_SPORT", label: "Light sport" },
  { value: "EXPERIMENTAL_NTCA", label: "Experimental" },
];

const TTAF_OPTIONS: Array<{
  value: AircraftMarketplaceFilters["ttafRange"];
  label: string;
}> = [
  { value: "ANY", label: "Any total time" },
  { value: "UNDER_500", label: "Under 500 hours" },
  { value: "500_1500", label: "500 – 1,500 hours" },
  { value: "1500_3000", label: "1,500 – 3,000 hours" },
  { value: "3000_6000", label: "3,000 – 6,000 hours" },
  { value: "OVER_6000", label: "Over 6,000 hours" },
];

function toggleFlag(flags: string[], value: string): string[] {
  return flags.includes(value) ? flags.filter((item) => item !== value) : [...flags, value];
}

function countActiveFilters(filters: AircraftMarketplaceFilters): number {
  let count = 0;
  if (filters.province !== "ALL") count++;
  if (filters.airfield !== "ALL") count++;
  if (filters.saleType !== "ALL") count++;
  if (isPriceFilterActive(filters)) count++;
  if (filters.category !== "ALL") count++;
  if (filters.make !== "ALL") count++;
  if (filters.ttafRange !== "ANY") count++;
  count += filters.maintenanceFlags.length;
  count += filters.avionicsFlags.length;
  return count;
}

function getPriceSliderValues(filters: AircraftMarketplaceFilters): [number, number] {
  const min = filters.minPrice ? Number(filters.minPrice) : PRICE_FILTER_MIN;
  const max = filters.maxPrice ? Number(filters.maxPrice) : PRICE_FILTER_MAX;
  return [min, max];
}

export function AircraftFilterSidebar({
  filters,
  onChange,
  onReset,
  variant = "sidebar",
}: AircraftFilterSidebarProps) {
  const activeCount = countActiveFilters(filters);
  const [priceMin, priceMax] = getPriceSliderValues(filters);

  const update = (partial: Partial<AircraftMarketplaceFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const content = (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Province</FieldLegend>
        <Field>
          <Select
            value={filters.province}
            onValueChange={(value) => update({ province: value ?? "ALL" })}
          >
            <SelectTrigger className="w-full bg-background">
              <span>{getProvinceLabel(filters.province)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">All provinces</SelectItem>
                {PROVINCE_OPTIONS.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Airfield</FieldLegend>
        <Field>
          <Select
            value={filters.airfield}
            onValueChange={(value) => update({ airfield: value ?? "ALL" })}
          >
            <SelectTrigger className="w-full bg-background">
              <span>{getAirfieldLabel(filters.airfield)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">All airfields</SelectItem>
                {AIRFIELD_OPTIONS.map((airfield) => (
                  <SelectItem key={airfield} value={airfield}>
                    {airfield}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldSet>

      <Separator />

      <FieldSet>
        <FieldLegend>Sale type</FieldLegend>
        <FilterPillGroup>
          {SALE_TYPE_OPTIONS.map((option) => (
            <FilterPill
              key={option.value}
              label={option.label}
              icon={option.icon}
              selected={filters.saleType === option.value}
              onClick={() => update({ saleType: option.value })}
            />
          ))}
        </FilterPillGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Price range</FieldLegend>
        <Field>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatPriceFilterAmount(priceMin)}</span>
            <span>{formatPriceFilterAmount(priceMax)}</span>
          </div>
          <Slider
            min={PRICE_FILTER_MIN}
            max={PRICE_FILTER_MAX}
            step={PRICE_FILTER_STEP}
            value={[priceMin, priceMax]}
            onValueChange={(values) => {
              const [min, max] = values as number[];
              const isFullRange = min <= PRICE_FILTER_MIN && max >= PRICE_FILTER_MAX;
              update({
                priceRange: isFullRange ? "ALL" : "CUSTOM",
                minPrice: isFullRange ? "" : String(min),
                maxPrice: isFullRange ? "" : String(max),
              });
            }}
          />
        </Field>
      </FieldSet>

      <Separator />

      <FieldSet>
        <FieldLegend>Category</FieldLegend>
        <Field>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              update({ category: (value ?? "ALL") as AircraftMarketplaceFilters["category"] })
            }
          >
            <SelectTrigger className="w-full bg-background">
              <span>{getCategoryFilterLabel(filters.category)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Make</FieldLegend>
        <Field>
          <Select value={filters.make} onValueChange={(value) => update({ make: value ?? "ALL" })}>
            <SelectTrigger className="w-full bg-background">
              <span>{getMakeLabel(filters.make)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">All makes</SelectItem>
                {MAKE_OPTIONS.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Total time airframe</FieldLegend>
        <Field>
          <Select
            value={filters.ttafRange}
            onValueChange={(value) =>
              update({ ttafRange: (value ?? "ANY") as AircraftMarketplaceFilters["ttafRange"] })
            }
          >
            <SelectTrigger className="w-full bg-background">
              <span>{getTtafFilterLabel(filters.ttafRange)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TTAF_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldSet>

      <Separator />

      <FieldSet>
        <FieldLegend>Maintenance</FieldLegend>
        <FilterPillGroup>
          {MAINTENANCE_FLAG_OPTIONS.map((option) => (
            <FilterPill
              key={option.value}
              label={option.label}
              icon={ShieldCheck}
              selected={filters.maintenanceFlags.includes(option.value)}
              onClick={() =>
                update({
                  maintenanceFlags: toggleFlag(filters.maintenanceFlags, option.value),
                })
              }
            />
          ))}
        </FilterPillGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Avionics</FieldLegend>
        <FilterPillGroup>
          {AVIONICS_FLAG_OPTIONS.map((option) => (
            <FilterPill
              key={option.value}
              label={option.label}
              icon={Radio}
              selected={filters.avionicsFlags.includes(option.value)}
              onClick={() =>
                update({
                  avionicsFlags: toggleFlag(filters.avionicsFlags, option.value),
                })
              }
            />
          ))}
        </FilterPillGroup>
      </FieldSet>
    </FieldGroup>
  );

  if (variant === "sheet") {
    return (
      <div className="flex flex-col gap-4">
        {content}
        <Separator />
        <Button variant="outline" onClick={onReset} className="w-full">
          <RotateCcw data-icon="inline-start" />
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <aside className={cn("flex w-full flex-col")}>
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Filter</span>
          {activeCount > 0 ? (
            <Badge variant="secondary" className="size-5 justify-center rounded-full p-0 text-xs">
              {activeCount}
            </Badge>
          ) : null}
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={activeCount === 0}>
          Clear all
        </Button>
      </div>

      <div className="px-4 py-3">{content}</div>
    </aside>
  );
}
