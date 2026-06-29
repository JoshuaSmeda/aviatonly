import type { MockAircraftListing } from "./types";

export function listingTitle(listing: MockAircraftListing): string {
  return `${listing.year} ${listing.make} ${listing.model}`.trim();
}

export function listingLocation(listing: MockAircraftListing): string {
  return `${listing.airfield}, ${listing.province}`;
}
