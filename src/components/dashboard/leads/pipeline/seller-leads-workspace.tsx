"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LeadsDataTable from "@/components/dashboard/leads/leads-data-table";
import LeadPipelineBoardView from "@/components/dashboard/leads/pipeline/lead-pipeline-board";
import LeadPipelineToolbar, {
  type LeadPipelineView,
} from "@/components/dashboard/leads/pipeline/lead-pipeline-toolbar";
import type { LeadPipelineBoard } from "@/lib/aviatonly/server/lead-pipeline";
import type { LeadTableRow } from "@/lib/aviatonly/mock/types";

interface SellerLeadsWorkspaceProps {
  board: LeadPipelineBoard;
  rows: LeadTableRow[];
  initialView: LeadPipelineView;
  emptyDescription: string;
}

const SellerLeadsWorkspace = ({
  board,
  rows,
  initialView,
  emptyDescription,
}: SellerLeadsWorkspaceProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [view, setView] = useState<LeadPipelineView>(initialView);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewChange = useCallback(
    (nextView: LeadPipelineView) => {
      setView(nextView);
      const params = new URLSearchParams();
      if (nextView === "list") {
        params.set("view", "list");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  return (
    <div className="flex flex-col gap-4">
      <LeadPipelineToolbar
        view={view}
        onViewChange={handleViewChange}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        totalActive={board.totalActive}
      />

      {view === "board" ? (
        board.totalActive === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyDescription}</p>
        ) : (
          <LeadPipelineBoardView board={board} searchQuery={searchQuery} />
        )
      ) : (
        <LeadsDataTable
          rows={rows}
          emptyDescription={emptyDescription}
          showInitialEnquiryColumn={false}
          searchQuery={searchQuery}
          showSearchControls={false}
        />
      )}
    </div>
  );
};

export default SellerLeadsWorkspace;
