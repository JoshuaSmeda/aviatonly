import type { AuctionStatus, ListingStatus } from "@/lib/aviatonly/domain";
import type { PrivateAdminAuctionState } from "@/lib/aviatonly/domain/auction-types";

export type AuctionTableRow = {
  id: string;
  listingId: string;
  registration: string;
  aircraftTitle: string;
  status: AuctionStatus;
  startsAt: string;
  effectiveEndsAt: string;
  currentHighBidAmount: number | null;
  bidCount: number;
  reserveMet: boolean;
  detailHref: string;
  listingHref: string;
};

export type AuctionRegistrationView = {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: string;
  statusLabel: string;
  createdAt: string;
  timeAgo: string;
  paddleNumber: number | null;
  verificationStatus: string;
};

export type AuctionBidView = {
  id: string;
  amount: number;
  status: string;
  statusLabel: string;
  bidderLabel: string;
  createdAt: string;
  timeAgo: string;
  rejectedReason: string | null;
  sequence: number;
};

export type AuctionEventView = {
  id: string;
  type: string;
  label: string;
  message: string | null;
  actorName: string | null;
  createdAt: string;
  timeAgo: string;
};

export type AuctionWorkspaceView = {
  auctionId: string;
  state: PrivateAdminAuctionState;
  listing: {
    id: string;
    registration: string;
    title: string;
    location: string;
    status: ListingStatus;
    sellerName: string;
    href: string;
    publicHref: string;
    setupHref: string;
  };
  cancelReason: string | null;
  cancelledAt: string | null;
  registrations: AuctionRegistrationView[];
  bids: AuctionBidView[];
  events: AuctionEventView[];
};

export type ListingAuctionSetupView = {
  listing: {
    id: string;
    registration: string;
    title: string;
    status: ListingStatus;
    saleType: string;
    startingBid: number | null;
    reservePrice: number | null;
    bidIncrement: number | null;
    href: string;
  };
  activeAuction: {
    id: string;
    status: AuctionStatus;
    detailHref: string;
  } | null;
  canCreate: boolean;
  createBlockReason: string | null;
};
