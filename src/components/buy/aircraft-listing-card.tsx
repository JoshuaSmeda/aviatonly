import Image from "next/image";
import Link from "next/link";
import { Clock, Gavel, Gauge, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AircraftMarketplaceListing } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import {
  formatAircraftTitle,
  formatLocation,
  formatPriceDisplay,
  getListingDetailHref,
} from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import {
  formatAuctionBidAmount,
  formatAuctionBidCount,
  formatAuctionStartTime,
  formatAuctionTimeRemaining,
  getAuctionBidAmountLabel,
  getAuctionCardCta,
  getPublicAuctionStatusLabel,
  getPublicReserveStatusLabel,
  isAuctionMarketplaceListing,
} from "@/lib/aviatonly/marketplace/auction-card-utils";
import { cn } from "@/lib/utils";

interface AircraftListingCardProps {
  listing: AircraftMarketplaceListing;
  className?: string;
}

function StatPill({
  icon: Icon,
  label,
}: {
  icon: typeof Gauge;
  label: string;
}) {
  return (
    <Badge
      variant="outline"
      className="h-auto gap-1 rounded-full px-2 py-0.5 text-[11px] font-normal"
    >
      <Icon />
      {label}
    </Badge>
  );
}

function FixedPriceCardFooter({ listing, href }: { listing: AircraftMarketplaceListing; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 border-t pt-2 transition-colors hover:text-primary"
    >
      <p className="text-base font-semibold">{formatPriceDisplay(listing)}</p>
      <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
        {listing.registration}
      </span>
    </Link>
  );
}

function AuctionCardFooter({
  listing,
}: {
  listing: AircraftMarketplaceListing & {
    auction: NonNullable<AircraftMarketplaceListing["auction"]>;
  };
}) {
  const { auction } = listing;
  const cta = getAuctionCardCta(listing);
  const timeRemaining =
    auction.phase === "LIVE"
      ? formatAuctionTimeRemaining(auction.effectiveEndsAt)
      : null;

  return (
    <div className="flex flex-col gap-2 border-t pt-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{getAuctionBidAmountLabel(listing)}</p>
          <p className="text-base font-semibold">{formatAuctionBidAmount(listing)}</p>
        </div>
        <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
          {listing.registration}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
        <span>{formatAuctionBidCount(auction.bidCount)}</span>
        {auction.phase === "LIVE" && timeRemaining ? (
          <>
            <span aria-hidden>·</span>
            <span className="font-medium text-foreground">{timeRemaining}</span>
          </>
        ) : null}
        {auction.phase === "SCHEDULED" ? (
          <>
            <span aria-hidden>·</span>
            <span>Starts {formatAuctionStartTime(auction.startsAt)}</span>
          </>
        ) : null}
        {auction.phase === "ENDED" ? (
          <>
            <span aria-hidden>·</span>
            <span>Auction ended</span>
          </>
        ) : null}
      </div>

      <p className="text-[11px] text-muted-foreground">{getPublicReserveStatusLabel(auction)}</p>

      <Button size="sm" className="w-full" render={<Link href={cta.href} />}>
        {cta.label}
      </Button>
    </div>
  );
}

export function AircraftListingCard({ listing, className }: AircraftListingCardProps) {
  const primaryImage = listing.images.find((image) => image.isPrimary) ?? listing.images[0];
  const href = getListingDetailHref(listing.slug);
  const engineLabel = listing.engineTimeLabel ?? "SMOH";
  const isAuction = isAuctionMarketplaceListing(listing);
  const auctionStatusLabel = isAuction
    ? getPublicAuctionStatusLabel(listing.auction.phase)
    : null;

  return (
    <Card className={cn("flex h-full flex-col gap-0 overflow-hidden py-0 shadow-none ring-1 ring-border", className)}>
      <Link href={href} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 20vw"
            />
          ) : null}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
            {isAuction ? (
              <Badge className="gap-1 bg-primary text-primary-foreground">
                <Gavel className="size-3" />
                Auction
              </Badge>
            ) : null}
            {auctionStatusLabel ? (
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                {auctionStatusLabel}
              </Badge>
            ) : null}
            {listing.isVerified ? (
              <Badge variant="outline" className="border-background/80 bg-background/90 backdrop-blur-sm">
                Verified
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 p-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="truncate text-sm font-semibold group-hover:text-primary">
              {formatAircraftTitle(listing)}
            </h3>
            <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground [&_svg]:size-[1em] [&_svg]:shrink-0">
              <MapPin />
              {formatLocation(listing)}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {listing.seats != null ? (
              <StatPill icon={Users} label={`${listing.seats} Seats`} />
            ) : null}
            {listing.totalTimeAirframe != null ? (
              <StatPill
                icon={Gauge}
                label={`${listing.totalTimeAirframe.toLocaleString("en-ZA")} TTAF`}
              />
            ) : null}
            {listing.engineTime != null ? (
              <StatPill
                icon={Clock}
                label={`${listing.engineTime.toLocaleString("en-ZA")} ${engineLabel}`}
              />
            ) : null}
          </div>
        </div>
      </Link>

      <div className="mt-auto px-3 pb-3">
        {isAuction ? (
          <AuctionCardFooter listing={listing} />
        ) : (
          <FixedPriceCardFooter listing={listing} href={href} />
        )}
      </div>
    </Card>
  );
}
