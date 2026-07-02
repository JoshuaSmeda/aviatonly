import {
  getLeadStatusMeta,
  PIPELINE_LEAD_STATUSES,
  type LeadStatus,
} from "./lead-status";

export interface PipelineColumnGroup<T extends { status: LeadStatus }> {
  status: LeadStatus;
  label: string;
  items: T[];
}

export interface PipelineBoard<T extends { status: LeadStatus }> {
  columns: PipelineColumnGroup<T>[];
  totalActive: number;
}

/** Groups leads into pipeline columns in canonical stage order. */
export function buildLeadPipelineBoard<T extends { status: LeadStatus }>(
  leads: readonly T[],
  columnStatuses: readonly LeadStatus[] = PIPELINE_LEAD_STATUSES,
): PipelineBoard<T> {
  const byStatus = new Map<LeadStatus, T[]>();

  for (const status of columnStatuses) {
    byStatus.set(status, []);
  }

  for (const lead of leads) {
    const bucket = byStatus.get(lead.status);
    if (bucket) {
      bucket.push(lead);
    }
  }

  const columns = columnStatuses.map((status) => ({
    status,
    label: getLeadStatusMeta(status).label,
    items: byStatus.get(status) ?? [],
  }));

  return {
    columns,
    totalActive: leads.length,
  };
}

export function isLeadFollowUpOverdue(
  nextFollowUpAt: Date | string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!nextFollowUpAt) return false;
  return new Date(nextFollowUpAt) < now;
}

/** Ensures seller-scoped queries cannot return another seller's leads. */
export function assertSellerScopedLead<T extends { sellerId: string }>(
  lead: T,
  sellerId: string,
): void {
  if (lead.sellerId !== sellerId) {
    throw new Error("Lead is outside the seller scope.");
  }
}
