"use client";

import { Search, ShieldCheck, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { getMarketplaceStats } from "@/lib/aviatonly/marketplace/mock-aircraft-listings";

interface BuyPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function BuyPageHeader({ searchTerm, onSearchChange }: BuyPageHeaderProps) {
  const stats = getMarketplaceStats();

  return (
    <div className="border-b bg-muted/30 px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex flex-col gap-6">
        <InputGroup className="h-11 max-w-3xl bg-background shadow-sm">
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search registration, make, model, or airfield"
            className="text-base"
          />
        </InputGroup>
      </div>
    </div>
  );
}
