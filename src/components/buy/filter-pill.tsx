"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterPillProps {
  label: string;
  selected?: boolean;
  icon?: LucideIcon;
  onClick: () => void;
}

export function FilterPill({ label, selected = false, icon: Icon, onClick }: FilterPillProps) {
  return (
    <button type="button" onClick={onClick} className="inline-flex">
      <Badge
        variant={selected ? "default" : "outline"}
        className={cn(
          "h-auto cursor-pointer gap-1.5 rounded-full px-2.5 py-1 text-xs font-normal transition-colors hover:opacity-90",
        )}
      >
        {Icon ? <Icon /> : null}
        {label}
      </Badge>
    </button>
  );
}

interface FilterPillGroupProps {
  children: ReactNode;
  className?: string;
}

export function FilterPillGroup({ children, className }: FilterPillGroupProps) {
  return <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>;
}
