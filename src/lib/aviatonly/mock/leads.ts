import { LeadStatus, LeadType } from "@/lib/aviatonly/domain";
import type { MockLead } from "./types";
import { DEMO_SELLER_ID } from "./users";

const T = "2026-06-28T14:00:00.000Z";

export const MOCK_LEADS: MockLead[] = [
  // ZS-DEF — Cirrus SR22 (live fixed price)
  {
    id: "lead-1",
    listingId: "zs-def",
    buyerId: "user-buyer-marcus",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.GENERAL_ENQUIRY,
    message: "Interested in a pre-buy inspection window. Is hangarage at FACT included?",
    status: LeadStatus.QUALIFIED,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-20T10:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-2",
    listingId: "zs-def",
    buyerId: "user-buyer-sarah",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.DOCUMENT_ACCESS,
    message: "Requesting engine logbook access before making an offer.",
    status: LeadStatus.VIEWING_REQUESTED,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-25T08:30:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-3",
    listingId: "zs-def",
    buyerId: "user-buyer-peter",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.DEMO_FLIGHT,
    message: "Would a demo flight be possible before committing to a pre-buy? I hold a PPL with 320 hrs.",
    status: LeadStatus.CONTACTED,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-26T11:15:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-4",
    listingId: "zs-def",
    buyerId: "user-buyer-james",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.FINANCE_ENQUIRY,
    message: "Exploring finance options — what deposit would AVIATONLY typically require on this aircraft?",
    status: LeadStatus.NEW,
    verificationStatus: "PENDING",
    createdAt: "2026-06-28T09:00:00.000Z",
    updatedAt: T,
  },
  // ZU-XYZ — Sling 2 (valuation ready / auction setup)
  {
    id: "lead-5",
    listingId: "zu-xyz",
    buyerId: "user-buyer-james",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.GENERAL_ENQUIRY,
    message: "What is the hangarage situation at Tedderfield?",
    status: LeadStatus.NEW,
    verificationStatus: "PENDING",
    createdAt: "2026-06-27T16:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-6",
    listingId: "zu-xyz",
    buyerId: "user-buyer-marcus",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.GENERAL_ENQUIRY,
    message: "Interested in the avionics suite — ADS-B out confirmed on the G3X?",
    status: LeadStatus.QUALIFIED,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-22T13:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-7",
    listingId: "zu-xyz",
    buyerId: "user-buyer-sarah",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.VIEWING_REQUEST,
    message: "Available for a viewing at FATA this Saturday morning?",
    status: LeadStatus.VIEWING_REQUESTED,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-24T07:30:00.000Z",
    updatedAt: T,
  },
  // ZS-ABC — Cessna 172N (needs changes — early interest)
  {
    id: "lead-8",
    listingId: "zs-abc",
    buyerId: "user-buyer-marcus",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.GENERAL_ENQUIRY,
    message: "Can you confirm TTAF and last engine overhaul date?",
    status: LeadStatus.CONTACTED,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-24T11:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-9",
    listingId: "zs-abc",
    buyerId: "user-buyer-sarah",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.VIEWING_REQUEST,
    message: "Is the aircraft available for a viewing next week at Lanseria?",
    status: LeadStatus.NEW,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-26T09:00:00.000Z",
    updatedAt: T,
  },
  {
    id: "lead-10",
    listingId: "zs-abc",
    buyerId: "user-buyer-peter",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.GENERAL_ENQUIRY,
    message: "Looking for a training aircraft — is this suitable for IFR training with current avionics?",
    status: LeadStatus.UNQUALIFIED,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-18T14:00:00.000Z",
    updatedAt: "2026-06-21T10:00:00.000Z",
  },
  // ZU-PQR — BushCat (under contract — lead converted)
  {
    id: "lead-11",
    listingId: "zu-pqr",
    buyerId: "user-buyer-sarah",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.DOCUMENT_ACCESS,
    message: "Reviewed airframe logbook summary — ready to proceed with a formal offer.",
    status: LeadStatus.OFFER_MADE,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-15T08:00:00.000Z",
    updatedAt: "2026-06-20T12:00:00.000Z",
  },
  {
    id: "lead-12",
    listingId: "zu-pqr",
    buyerId: "user-buyer-marcus",
    sellerId: DEMO_SELLER_ID,
    type: LeadType.GENERAL_ENQUIRY,
    message: "Interested but need to confirm strip length at home base first.",
    status: LeadStatus.CLOSED,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-10T09:00:00.000Z",
    updatedAt: "2026-06-14T16:00:00.000Z",
  },
  // ZS-MNO — Elaine's Bonanza (submitted, admin queue)
  {
    id: "lead-13",
    listingId: "zs-mno",
    buyerId: "user-buyer-peter",
    sellerId: "user-seller-elaine",
    type: LeadType.GENERAL_ENQUIRY,
    message: "Saw the listing preview — please notify me when this goes live.",
    status: LeadStatus.NEW,
    verificationStatus: "VERIFIED",
    createdAt: "2026-06-28T17:00:00.000Z",
    updatedAt: "2026-06-28T17:00:00.000Z",
  },
];

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
