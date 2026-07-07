"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LeadsDataTable from "@/components/dashboard/leads/leads-data-table";
import LeadPipelineBoardView from "@/components/dashboard/leads/pipeline/lead-pipeline-board";
import LeadPipelineEmptyState from "@/components/dashboard/leads/pipeline/lead-pipeline-empty-state";
import LeadPipelineToolbar, {
  type LeadPipelineView,
} from "@/components/dashboard/leads/pipeline/lead-pipeline-toolbar";
import type { LeadPipelineBoard } from "@/lib/aviatonly/server/lead-pipeline";
import type { LeadTableRow } from "@/lib/aviatonly/mock/types";

interface SellerLeadsWorkspaceProps {
  board: LeadPipelineBoard;
  rows: LeadTableRow[];
  initialView: LeadPipelineView;
}

const SellerLeadsWorkspace = ({
  board,
  rows,
  initialView,
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

  const isEmpty = board.totalActive === 0;

  return (
    <div className="flex flex-col gap-4">
      {!isEmpty ? (
        <LeadPipelineToolbar
          view={view}
          onViewChange={handleViewChange}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          totalActive={board.totalActive}
        />
      ) : null}

      {isEmpty ? (
        <LeadPipelineEmptyState />
      ) : view === "board" ? (
        <LeadPipelineBoardView board={board} searchQuery={searchQuery} />
      ) : (
        <LeadsDataTable
          rows={rows}
          emptyDescription="Try adjusting your search or filters."
          showInitialEnquiryColumn={false}
          searchQuery={searchQuery}
          showSearchControls={false}
        />
      )}
    </div>
  );
};

export default SellerLeadsWorkspace;
