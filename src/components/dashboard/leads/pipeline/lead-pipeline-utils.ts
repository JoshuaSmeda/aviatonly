import type { LeadStatus } from "@/lib/aviatonly/domain";
import type { LeadPipelineBoard, LeadPipelineColumn } from "@/lib/aviatonly/server/lead-pipeline";
import type { LeadPipelineCard } from "@/lib/aviatonly/server/leads";

export function moveLeadInPipelineBoard(
  columns: LeadPipelineColumn[],
  leadId: string,
  sourceStatus: LeadStatus,
  destinationStatus: LeadStatus,
  sourceIndex: number,
  destinationIndex: number,
): LeadPipelineColumn[] {
  const next = columns.map((column) => ({
    ...column,
    items: [...column.items],
  }));

  const sourceColumn = next.find((column) => column.status === sourceStatus);
  const destinationColumn = next.find((column) => column.status === destinationStatus);

  if (!sourceColumn || !destinationColumn) {
    return columns;
  }

  const [lead] = sourceColumn.items.splice(sourceIndex, 1);
  if (!lead || lead.id !== leadId) {
    return columns;
  }

  const movedLead: LeadPipelineCard = { ...lead, status: destinationStatus };
  destinationColumn.items.splice(destinationIndex, 0, movedLead);

  return next;
}

export function filterPipelineBoard(
  board: LeadPipelineBoard,
  query: string,
): LeadPipelineBoard {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return board;

  const columns = board.columns.map((column) => ({
    ...column,
    items: column.items.filter((lead) =>
      [
        lead.buyerName,
        lead.buyerEmail,
        lead.registration,
        lead.aircraftTitle,
        lead.message,
        lead.lastMessagePreview,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalized)),
    ),
  }));

  return {
    columns,
    totalActive: columns.reduce((count, column) => count + column.items.length, 0),
  };
}
