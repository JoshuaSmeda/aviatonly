"use client";

import { Draggable, Droppable, type DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Inbox } from "lucide-react";
import LeadPipelineCard from "@/components/dashboard/leads/pipeline/lead-pipeline-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { LeadPipelineColumn } from "@/lib/aviatonly/server/lead-pipeline";

interface LeadPipelineColumnViewProps {
  column: LeadPipelineColumn;
  pendingLeadId?: string | null;
  onMarkContacted?: (leadId: string) => void;
}

const LeadPipelineColumnView = ({
  column,
  pendingLeadId,
  onMarkContacted,
}: LeadPipelineColumnViewProps) => {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <Card className="gap-0 py-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border px-3 py-3">
          <CardTitle className="text-sm font-semibold">{column.label}</CardTitle>
          <Badge variant="secondary">{column.items.length}</Badge>
        </CardHeader>
      </Card>

      <Droppable droppableId={column.status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex min-h-32 flex-col gap-3 rounded-lg border border-dashed p-2 transition-colors ${
              snapshot.isDraggingOver ? "border-primary/50 bg-muted/40" : "border-border bg-muted/20"
            }`}
          >
            {column.items.length === 0 ? (
              <Empty className="border-0 py-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Inbox />
                  </EmptyMedia>
                  <EmptyTitle className="text-sm">No leads</EmptyTitle>
                  <EmptyDescription className="text-xs">
                    Drag a deal here when ready.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              column.items.map((lead, index) => (
                <Draggable key={lead.id} draggableId={lead.id} index={index}>
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className={dragSnapshot.isDragging ? "opacity-90" : undefined}
                    >
                      <LeadPipelineCard
                        lead={lead}
                        isDragging={dragSnapshot.isDragging}
                        isPending={pendingLeadId === lead.id}
                        onMarkContacted={onMarkContacted}
                        dragHandleProps={
                          dragProvided.dragHandleProps as DraggableProvidedDragHandleProps | undefined
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default LeadPipelineColumnView;
