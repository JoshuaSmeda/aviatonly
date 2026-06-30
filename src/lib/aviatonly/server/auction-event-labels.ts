import { AuctionEventType } from "@prisma/client";

export const AUCTION_EVENT_TYPE_LABELS: Record<AuctionEventType, string> = {
  AUCTION_CREATED: "Auction created",
  AUCTION_CONFIGURED: "Settings updated",
  AUCTION_SCHEDULED: "Auction scheduled",
  AUCTION_OPENED: "Bidding opened",
  AUCTION_EXTENDED: "End time extended (anti-sniping)",
  AUCTION_CLOSING_STARTED: "Closing started",
  AUCTION_CLOSED: "Auction closed",
  AUCTION_CANCELLED: "Auction cancelled",
  AUCTION_END_TIME_OVERRIDDEN: "End time overridden",
  BID_PLACED: "Bid placed",
  BID_REJECTED: "Bid rejected",
  BID_VOIDED: "Bid voided",
  WINNER_CONFIRMED: "Winner confirmed",
  WINNER_DEFAULTED: "Winner defaulted",
  SECOND_CHANCE_OFFERED: "Second-chance offer",
  RESULT_VOIDED: "Result voided",
  ADMIN_NOTE: "Admin note",
};

export function getAuctionEventLabel(type: AuctionEventType): string {
  return AUCTION_EVENT_TYPE_LABELS[type] ?? type;
}
