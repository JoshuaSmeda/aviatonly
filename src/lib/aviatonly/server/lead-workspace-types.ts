import type {
  BuyerVerificationStatus,
  LeadActivityType,
  LeadPriority,
  LeadSource,
  LeadStatus,
  LeadType,
  ListingStatus,
} from "@/lib/aviatonly/domain";

export interface LeadActivityViewItem {
  id: string;
  type: LeadActivityType;
  label: string;
  message: string | null;
  actorName: string | null;
  createdAt: string;
  timeAgo: string;
}

export interface LeadPriorEnquiryItem {
  id: string;
  registration: string;
  aircraftTitle: string;
  status: LeadStatus;
  createdAt: string;
  detailHref: string;
}

export interface LeadWorkspaceView {
  id: string;
  listingId: string;
  status: LeadStatus;
  type: LeadType;
  priority: LeadPriority;
  source: LeadSource;
  message: string;
  buyerVerification: BuyerVerificationStatus;
  internalNotes: string | null;
  nextFollowUpAt: string | null;
  lastContactedAt: string | null;
  closedReason: string | null;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  seller: {
    id: string;
    name: string;
    email: string;
  };
  assignee: {
    id: string;
    name: string;
  } | null;
  listing: {
    id: string;
    registration: string;
    title: string;
    status: ListingStatus;
    location: string;
    href: string;
  };
  priorEnquiries: LeadPriorEnquiryItem[];
  activities: LeadActivityViewItem[];
}
