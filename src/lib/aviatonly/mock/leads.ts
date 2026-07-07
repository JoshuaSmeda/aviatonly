import { LeadStatus } from "@/lib/aviatonly/domain";
import type { MockLead } from "./types";

/** Demo lead data — cleared for a fresh database start. */
export const MOCK_LEADS: MockLead[] = [];

export function getMockLeadsForListing(listingId: string): MockLead[] {
  return MOCK_LEADS.filter((l) => l.listingId === listingId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function countLeadsForListing(listingId: string): number {
  return MOCK_LEADS.filter(
    (l) => l.listingId === listingId && l.status !== LeadStatus.CLOSED && l.status !== LeadStatus.UNQUALIFIED,
  ).length;
}

export function getMockLeadsForSeller(sellerId: string): MockLead[] {
  return MOCK_LEADS.filter((l) => l.sellerId === sellerId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getMockLeadById(id: string): MockLead | undefined {
  return MOCK_LEADS.find((l) => l.id === id);
}
