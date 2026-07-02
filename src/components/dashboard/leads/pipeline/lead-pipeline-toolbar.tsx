"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type LeadPipelineView = "board" | "list";

interface LeadPipelineToolbarProps {
  view: LeadPipelineView;
  onViewChange: (view: LeadPipelineView) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  totalActive: number;
}

const LeadPipelineToolbar = ({
  view,
  onViewChange,
  searchQuery,
  onSearchQueryChange,
  totalActive,
}: LeadPipelineToolbarProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <ToggleGroup
          type="single"
          variant="outline"
          value={view}
          onValueChange={(value) => {
            if (value === "board" || value === "list") {
              onViewChange(value);
            }
          }}
        >
          <ToggleGroupItem value="board" aria-label="Board view">
            <LayoutGrid data-icon="inline-start" />
            Board
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List data-icon="inline-start" />
            List
          </ToggleGroupItem>
        </ToggleGroup>

        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={view === "board" ? "Search pipeline…" : "Search buyer or enquiry…"}
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
          />
        </InputGroup>
      </div>

      <p className="text-sm text-muted-foreground">
        {totalActive} active lead{totalActive === 1 ? "" : "s"} on your listings
      </p>
    </div>
  );
};

export default LeadPipelineToolbar;
