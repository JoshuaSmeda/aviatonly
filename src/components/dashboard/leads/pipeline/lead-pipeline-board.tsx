"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import {
  markLeadContactedAction,
  transitionLeadStatusAction,
} from "@/app/(dashboard)/dashboard/seller/leads/actions";
import LeadPipelineColumnView from "@/components/dashboard/leads/pipeline/lead-pipeline-column";
import {
  filterPipelineBoard,
  moveLeadInPipelineBoard,
} from "@/components/dashboard/leads/pipeline/lead-pipeline-utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  canTransitionLeadStatus,
  getLeadStatusMeta,
  LeadStatus,
} from "@/lib/aviatonly/domain";
import type { LeadPipelineBoard } from "@/lib/aviatonly/server/lead-pipeline";

interface LeadPipelineBoardViewProps {
  board: LeadPipelineBoard;
  searchQuery?: string;
}

const LeadPipelineBoardView = ({ board, searchQuery = "" }: LeadPipelineBoardViewProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);
  const [columns, setColumns] = useState(board.columns);

  useEffect(() => {
    setColumns(board.columns);
  }, [board]);

  const filteredBoard = useMemo(
    () => filterPipelineBoard({ columns, totalActive: board.totalActive }, searchQuery),
    [board.totalActive, columns, searchQuery],
  );

  const handleMarkContacted = useCallback(
    (leadId: string) => {
      setPendingLeadId(leadId);
      startTransition(async () => {
        const result = await markLeadContactedAction(leadId);
        setPendingLeadId(null);
        if (!result.ok) {
          toast.error(result.error ?? "Could not mark lead as contacted.");
          return;
        }
        toast.success("Lead marked as contacted.");
        router.refresh();
      });
    },
    [router],
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (
        !destination ||
        (source.droppableId === destination.droppableId && source.index === destination.index)
      ) {
        return;
      }

      const fromStatus = source.droppableId as LeadStatus;
      const toStatus = destination.droppableId as LeadStatus;

      if (!canTransitionLeadStatus(fromStatus, toStatus)) {
        toast.error(`Cannot move lead from ${getLeadStatusMeta(fromStatus).label} to ${getLeadStatusMeta(toStatus).label}.`);
        return;
      }

      const previousColumns = columns;
      const nextColumns = moveLeadInPipelineBoard(
        columns,
        draggableId,
        fromStatus,
        toStatus,
        source.index,
        destination.index,
      );

      setColumns(nextColumns);
      setPendingLeadId(draggableId);

      startTransition(async () => {
        const actionResult = await transitionLeadStatusAction({
          leadId: draggableId,
          toStatus,
          message: `Moved to ${getLeadStatusMeta(toStatus).label} from pipeline board.`,
        });

        setPendingLeadId(null);

        if (!actionResult.ok) {
          setColumns(previousColumns);
          toast.error(actionResult.error ?? "Could not update lead stage.");
          return;
        }

        toast.success(`Lead moved to ${getLeadStatusMeta(toStatus).label}.`);
        router.refresh();
      });
    },
    [columns, router],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {filteredBoard.columns.map((column) => (
            <LeadPipelineColumnView
              key={column.status}
              column={column}
              pendingLeadId={isPending ? pendingLeadId : null}
              onMarkContacted={handleMarkContacted}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DragDropContext>
  );
};

export default LeadPipelineBoardView;
