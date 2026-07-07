"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Clock } from "lucide-react";
import {
  placeBidAction,
  registerForAuctionAction,
} from "@/app/(dashboard)/dashboard/buy/auction-actions";
import { submitListingEnquiryAction } from "@/app/(dashboard)/dashboard/buy/enquiry-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { AuctionCloseOutcome } from "@/lib/aviatonly/domain/auction-status";
import { AuctionRegistrationStatus } from "@/lib/aviatonly/domain/auction-enums";
import type {
  AircraftMarketplaceDetail,
  MarketplaceAuctionDetail,
  PublicAuctionState,
} from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import {
  formatAuctionBidCount,
  formatAuctionStartTime,
  formatAuctionTimeRemaining,
  getPublicReserveStatusLabel,
  mapAuctionStatusToCardPhase,
} from "@/lib/aviatonly/marketplace/auction-card-utils";
import {
  formatAircraftTitle,
  formatCurrency,
} from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Alert } from "../ui/alert";

interface AircraftAuctionPanelProps {
  listing: AircraftMarketplaceDetail;
  auctionDetail: MarketplaceAuctionDetail;
}

const detailCardClass = "overflow-hidden rounded-xl border border-border bg-card shadow-none";

const CLOSE_OUTCOME_LABELS: Record<AuctionCloseOutcome, string> = {
  [AuctionCloseOutcome.RESERVE_MET]: "Reserve met — highest bid accepted",
  [AuctionCloseOutcome.RESERVE_NOT_MET]: "Reserve not met",
  [AuctionCloseOutcome.NO_BIDS]: "No bids received",
  [AuctionCloseOutcome.CANCELLED]: "Auction cancelled",
  [AuctionCloseOutcome.VOIDED]: "Result voided",
};

function formatBuyerPremiumEstimate(hammer: number, buyerPremiumBps: number, currency: string) {
  const rate = buyerPremiumBps / 10_000;
  const premium = Math.round(hammer * rate);
  const total = hammer + premium;
  return {
    premium,
    total,
    label:
      buyerPremiumBps > 0
        ? `${formatCurrency(premium, currency as "ZAR")} buyer's premium (${(rate * 100).toFixed(2)}%)`
        : null,
    totalLabel: formatCurrency(total, currency as "ZAR"),
  };
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-foreground">{value}</span>
    </div>
  );
}

function LivePulseIndicator() {
  return (
    <span className="relative flex size-2 shrink-0" aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-primary" />
    </span>
  );
}

export function AircraftAuctionPanel({ listing, auctionDetail }: AircraftAuctionPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: isSessionPending } = useSession();
  const [auctionState, setAuctionState] = useState<PublicAuctionState>(auctionDetail.state);
  const [viewer, setViewer] = useState(auctionDetail.viewer);
  const [bidAmount, setBidAmount] = useState(String(auctionDetail.state.minimumNextBid));
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState(
    `Hi, I have a question about the auction for ${listing.registration}.`,
  );
  const [isRegistering, startRegisterTransition] = useTransition();
  const [isBidding, startBidTransition] = useTransition();
  const [isEnquiring, startEnquiryTransition] = useTransition();

  const signInHref = `/auth/auth1/login?callbackUrl=${encodeURIComponent(pathname)}`;
  const phase = mapAuctionStatusToCardPhase(
    auctionState.status,
    auctionState.biddingOpen,
    auctionState.closedAt,
  );
  const isLive = phase === "LIVE";
  const isScheduled = phase === "SCHEDULED";
  const isClosed = phase === "ENDED";
  const hammerAmount =
    auctionState.currentHighBidAmount != null && auctionState.currentHighBidAmount > 0
      ? auctionState.currentHighBidAmount
      : auctionState.startingBid;
  const premiumEstimate = formatBuyerPremiumEstimate(
    hammerAmount,
    auctionState.buyerPremiumBps,
    auctionState.currency,
  );
  const countdown = isLive ? formatAuctionTimeRemaining(auctionState.effectiveEndsAt) : null;
  const reserveSummary = {
    phase,
    openingBid: auctionState.startingBid,
    currentBid: auctionState.currentHighBidAmount,
    bidCount: auctionState.bidCount,
    startsAt: auctionState.startsAt,
    effectiveEndsAt: auctionState.effectiveEndsAt,
    showReserveStatus: auctionState.showReserveStatus,
    reserveMet: auctionState.reserveMet,
  };

  const refreshAuctionState = useCallback(async () => {
    try {
      const response = await fetch(`/api/auctions/${auctionState.auctionId}`);
      if (!response.ok) return;
      const nextState = (await response.json()) as PublicAuctionState;
      setAuctionState(nextState);
      setBidAmount(String(nextState.minimumNextBid));
    } catch {
      // Polling is best-effort in MVP.
    }
  }, [auctionState.auctionId]);

  useEffect(() => {
    if (!isLive) return undefined;
    const interval = window.setInterval(() => {
      void refreshAuctionState();
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [isLive, refreshAuctionState]);

  useEffect(() => {
    setBidAmount(String(auctionState.minimumNextBid));
  }, [auctionState.minimumNextBid]);

  function handleRegister() {
    if (!termsAccepted) {
      toast.error("Accept the auction terms to register.");
      return;
    }

    startRegisterTransition(async () => {
      const result = await registerForAuctionAction(auctionState.auctionId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setViewer((current) => ({
        ...current,
        isRegistered: true,
        canRegister: false,
        canBid: isLive,
        registrationStatus: AuctionRegistrationStatus.APPROVED,
        paddleNumber: result.data.paddleNumber,
      }));
      setRegisterOpen(false);
      setTermsAccepted(false);
      toast.success("You are registered to bid", {
        description: result.data.paddleNumber
          ? `Paddle number ${result.data.paddleNumber}`
          : undefined,
      });
      router.refresh();
    });
  }

  function handlePlaceBid() {
    const amount = Number.parseInt(bidAmount.replace(/\s/g, ""), 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid whole-number bid amount.");
      return;
    }

    startBidTransition(async () => {
      const result = await placeBidAction(auctionState.auctionId, amount);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      const { data } = result;
      setAuctionState(data.auction);
      setBidAmount(String(data.auction.minimumNextBid));

      if (!data.accepted) {
        toast.error(data.reason ?? "Bid was not accepted.");
        return;
      }

      toast.success(`Bid accepted: ${formatCurrency(amount, listing.currency)}`);
      setViewer((current) => ({
        ...current,
        isHighBidder: true,
        canBid: false,
        bidBlockedReason: "You are already the highest bidder.",
      }));
      router.refresh();
    });
  }

  function handleEnquiry() {
    startEnquiryTransition(async () => {
      const result = await submitListingEnquiryAction({
        listingId: listing.id,
        message: enquiryMessage,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Message sent to AVIATONLY", {
        action: {
          label: "View conversation",
          onClick: () => router.push(`/dashboard/messages/${result.leadId}`),
        },
      });
      setShowEnquiry(false);
    });
  }

  function renderPrimaryAction() {
    if (isSessionPending) {
      return <p className="text-sm text-muted-foreground">Checking sign-in status…</p>;
    }

    if (!session?.user) {
      return (
        <Button className="w-full" render={<Link href={signInHref} />}>
          Sign in to bid
        </Button>
      );
    }

    if (isClosed) {
      if (auctionState.closeOutcome === AuctionCloseOutcome.RESERVE_NOT_MET) {
        return (
          <Button className="w-full" variant="outline" onClick={() => setShowEnquiry(true)}>
            Enquire about this aircraft
          </Button>
        );
      }
      return null;
    }

    if (viewer.isRegistered && isLive && viewer.isHighBidder) {
      return (
        <p className="text-sm font-medium text-foreground">
          You are the highest bidder. You will be notified if you are outbid.
        </p>
      );
    }

    if (viewer.isRegistered && isLive && viewer.canBid) {
      return (
        <div className="flex flex-col gap-3">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bid-amount">Your bid (ZAR)</FieldLabel>
              <Input
                id="bid-amount"
                inputMode="numeric"
                value={bidAmount}
                onChange={(event) => setBidAmount(event.target.value)}
                disabled={isBidding}
              />
            </Field>
          </FieldGroup>
          <p className="text-xs text-muted-foreground">
            Minimum next bid: {formatCurrency(auctionState.minimumNextBid, listing.currency)}
          </p>
          <Button className="w-full" disabled={isBidding} onClick={handlePlaceBid}>
            {isBidding ? <Spinner data-icon="inline-start" /> : null}
            Place bid
          </Button>
        </div>
      );
    }

    if (viewer.isRegistered && isLive && !viewer.canBid) {
      return (
        <p className="text-sm text-muted-foreground">
          {viewer.bidBlockedReason ?? "Bidding is not available right now."}
        </p>
      );
    }

    if (viewer.isRegistered && isScheduled) {
      return (
        <p className="text-sm text-muted-foreground">
          You are registered. Bidding opens {formatAuctionStartTime(auctionState.startsAt)}.
        </p>
      );
    }

    if (viewer.canRegister) {
      return (
        <Button className="w-full" onClick={() => setRegisterOpen(true)}>
          Register to bid
        </Button>
      );
    }

    if (!viewer.isRegistered) {
      return (
        <p className="text-sm text-muted-foreground">
          {viewer.registerBlockedReason ?? "Registration is not available for this auction."}
        </p>
      );
    }

    return null;
  }

  return (
    <>
      <div className={cn(detailCardClass)}>
        <div className="flex flex-col gap-4 border-b border-border p-5 lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {isLive ? (
              <Alert>
              <Marker role="status" className="w-auto text-foreground">
                <MarkerIcon>
                  <Spinner className="text-current" />
                </MarkerIcon>
                <MarkerContent className="shimmer shimmer-duration-3000 text-xl font-bold">
                  Bidding is now open
                </MarkerContent>
              </Marker>
              </Alert>
            ) : (
              <Badge variant="secondary">
                {isScheduled ? "Auction scheduled" : "Auction ended"}
              </Badge>
            )}
            {auctionState.noReserve ? (
              <Badge variant="secondary">No reserve</Badge>
            ) : null}
            {auctionState.extensionCount > 0 ? (
              <Badge variant="outline">Extended ×{auctionState.extensionCount}</Badge>
            ) : null}
            {auctionState.showReserveStatus ? (
              <Badge variant={auctionState.reserveMet ? "default" : "outline"}>
                {getPublicReserveStatusLabel(reserveSummary)}
              </Badge>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatBlock
              label={
                auctionState.bidCount === 0
                  ? "Opening bid"
                  : auctionState.currentHighBidAmount != null &&
                    auctionState.currentHighBidAmount > 0
                    ? "Current bid"
                    : "Opening bid"
              }
              value={formatCurrency(hammerAmount, listing.currency)}
            />
            <StatBlock
              label={auctionState.bidCount === 0 ? "First bid from" : "Next minimum bid"}
              value={formatCurrency(auctionState.minimumNextBid, listing.currency)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{formatAuctionBidCount(auctionState.bidCount)}</span>
            {isLive && countdown ? (
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                <Clock />
                {countdown}
              </span>
            ) : null}
            {isScheduled ? (
              <span>Starts {formatAuctionStartTime(auctionState.startsAt)}</span>
            ) : null}
            {isClosed && auctionState.closedAt ? (
              <span>Closed {formatAuctionStartTime(auctionState.closedAt)}</span>
            ) : null}
          </div>

          {premiumEstimate.label ? (
            <p className="text-xs text-muted-foreground">
              Estimated total incl. premium: {premiumEstimate.totalLabel} ({premiumEstimate.label})
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Hammer price plus any buyer&apos;s premium is subject to contract and AVIATONLY
            verification.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-5 lg:p-6">
          {viewer.isRegistered && viewer.paddleNumber ? (
            <p className="text-sm text-muted-foreground">
              Registered — paddle <span className="font-medium text-foreground">#{viewer.paddleNumber}</span>
            </p>
          ) : null}

          {isClosed && auctionState.closeOutcome ? (
            <p className="text-sm font-medium text-foreground">
              {CLOSE_OUTCOME_LABELS[auctionState.closeOutcome]}
            </p>
          ) : null}

          {renderPrimaryAction()}

          {!isClosed ? (
            <button
              type="button"
              className="text-left text-sm text-muted-foreground underline-offset-4 hover:underline"
              onClick={() => setShowEnquiry(true)}
            >
              Questions about this auction?
            </button>
          ) : null}
        </div>
      </div>

      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register to bid</DialogTitle>
            <DialogDescription>
              {listing.registration} — {formatAircraftTitle(listing)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            <p>
              By registering you agree to AVIATONLY auction terms: hammer price is binding subject
              to verification, buyer&apos;s premium may apply, and inspection status is as
              disclosed on the listing.
            </p>
            <label className="flex items-start gap-3">
              <Checkbox
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <span>I accept the auction terms and AVIATONLY buyer participation rules.</span>
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRegisterOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isRegistering || !termsAccepted} onClick={handleRegister}>
              {isRegistering ? <Spinner data-icon="inline-start" /> : null}
              Confirm registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEnquiry} onOpenChange={setShowEnquiry}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message AVIATONLY</DialogTitle>
            <DialogDescription>
              Your message is linked to this listing and handled through AVIATONLY ops.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="auction-enquiry-message">Message</FieldLabel>
              <Textarea
                id="auction-enquiry-message"
                rows={4}
                value={enquiryMessage}
                onChange={(event) => setEnquiryMessage(event.target.value)}
                disabled={isEnquiring}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnquiry(false)}>
              Cancel
            </Button>
            <Button disabled={isEnquiring} onClick={handleEnquiry}>
              {isEnquiring ? <Spinner data-icon="inline-start" /> : null}
              Send message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
