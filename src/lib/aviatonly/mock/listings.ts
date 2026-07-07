import type {
  MockAircraftAirframe,
  MockAircraftAvionics,
  MockAircraftEngine,
  MockAircraftListing,
  MockAircraftMaintenance,
  MockAircraftPropeller,
} from "./types";

/** Demo listing data — cleared for a fresh database start. */
export const MOCK_LISTINGS: MockAircraftListing[] = [];
export const MOCK_AIRFRAMES: MockAircraftAirframe[] = [];
export const MOCK_ENGINES: MockAircraftEngine[] = [];
export const MOCK_PROPELLERS: MockAircraftPropeller[] = [];
export const MOCK_AVIONICS: MockAircraftAvionics[] = [];
export const MOCK_MAINTENANCE: MockAircraftMaintenance[] = [];

export function getMockListingById(id: string): MockAircraftListing | undefined {
  return MOCK_LISTINGS.find(
    (l) => l.id === id || l.id === id.toLowerCase() || l.registration === id.toUpperCase(),
  );
}

export function getMockListingsForSeller(sellerId: string): MockAircraftListing[] {
  return MOCK_LISTINGS.filter((l) => l.sellerId === sellerId);
}

export function getMockAirframe(listingId: string): MockAircraftAirframe | undefined {
  return MOCK_AIRFRAMES.find((a) => a.listingId === listingId);
}

export function getMockEngines(listingId: string): MockAircraftEngine[] {
  return MOCK_ENGINES.filter((e) => e.listingId === listingId);
}

export function getMockPropellers(listingId: string): MockAircraftPropeller[] {
  return MOCK_PROPELLERS.filter((p) => p.listingId === listingId);
}

export function getMockAvionics(listingId: string): MockAircraftAvionics | undefined {
  return MOCK_AVIONICS.find((a) => a.listingId === listingId);
}

export function getMockMaintenance(listingId: string): MockAircraftMaintenance | undefined {
  return MOCK_MAINTENANCE.find((m) => m.listingId === listingId);
}

export { listingTitle, listingLocation } from "./listing-display";
