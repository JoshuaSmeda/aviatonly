import type { BuyerActivityType, DealStatus, DocumentStatus, DocumentVisibility, EnginePosition, LeadStatus, LeadType, ListingStatus, OfferStatus, PhotoStatus, PropellerType, ReviewTaskStatus, SaleType, UserRole } from "@/lib/aviatonly/domain";

/** ISO timestamp string used across mock records. */
export type MockTimestamp = string;

export interface MockUser {
  id: string;
  email: string;
  name: string | null;
  roles: UserRole[];
  phone?: string;
  province?: string;
  verificationStatus?: "UNVERIFIED" | "PENDING" | "VERIFIED";
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockAircraftListing {
  id: string;
  registration: string;
  registrationType: "ZS" | "ZU";
  make: string;
  model: string;
  year: number;
  category: string;
  airfield: string;
  province: string;
  ownerName: string | null;
  sellerRole: string | null;
  authorisedToSell: boolean | null;
  saleType: SaleType;
  valuationEstimate: number | null;
  platformIndicativeValue: number | null;
  askingPrice: number | null;
  reservePrice: number | null;
  startingBid: number | null;
  bidIncrement: number | null;
  inspectionProvider: string | null;
  inspectionLocation: string | null;
  inspectionScheduledAt: string | null;
  inspectionNotes: string | null;
  inspectionCompletedAt: string | null;
  inspectionSummary: string | null;
  status: ListingStatus;
  completenessScore: number;
  sellerId: string;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockAircraftAirframe {
  id: string;
  listingId: string;
  serialNumber: string | null;
  totalTimeAirframe: number | null;
  damageHistory: string | null;
  notes: string | null;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockAircraftEngine {
  id: string;
  listingId: string;
  position: EnginePosition;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  horsepowerOrThrust: string | null;
  engineHours: number | null;
  timeSinceOverhaul: number | null;
  timeSinceNew: number | null;
  overhaulDate: MockTimestamp | null;
  overhaulFacility: string | null;
  calendarLifeRemaining: string | null;
  knownIssues: string | null;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockAircraftPropeller {
  id: string;
  listingId: string;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  bladeCount: number | null;
  propellerType: PropellerType | null;
  propellerHours: number | null;
  timeSinceOverhaul: number | null;
  overhaulDate: MockTimestamp | null;
  knownDamageNotes: string | null;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockAircraftAvionics {
  id: string;
  listingId: string;
  equipment: string[];
  summary: string | null;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockAircraftMaintenance {
  id: string;
  listingId: string;
  status: string | null;
  lastMpiDate: MockTimestamp | null;
  nextMpiDue: MockTimestamp | null;
  notes: string | null;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockAircraftPhoto {
  id: string;
  listingId: string;
  slotKey: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  storageKey: string | null;
  publicUrl: string | null;
  status: PhotoStatus;
  rejectionReason: string | null;
  uploadedById: string | null;
  reviewedById: string | null;
  uploadedAt: MockTimestamp;
  reviewedAt: MockTimestamp | null;
  sortOrder: number;
  isPublicGalleryImage: boolean;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockAircraftDocument {
  id: string;
  listingId: string;
  documentType: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  storageKey: string | null;
  reviewStatus: DocumentStatus;
  visibility: DocumentVisibility;
  rejectionReason: string | null;
  uploadedById: string | null;
  reviewedById: string | null;
  uploadedAt: MockTimestamp;
  reviewedAt: MockTimestamp | null;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockListingReviewTask {
  id: string;
  listingId: string;
  title: string;
  description: string | null;
  assignedToId: string | null;
  assignedRole: string | null;
  status: ReviewTaskStatus;
  dueDate: MockTimestamp | null;
  blockingPublication: boolean;
  releasedToSeller: boolean;
  sourceType: string | null;
  sourceKey: string | null;
  createdById: string | null;
  resolvedById: string | null;
  resolvedAt: MockTimestamp | null;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockListingFieldReview {
  id: string;
  listingId: string;
  fieldKey: string;
  label: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  rejectionPreset: string | null;
  reviewedById: string | null;
  reviewedAt: MockTimestamp | null;
}

export interface MockLead {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  type: LeadType;
  message: string;
  status: LeadStatus;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED";
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockOffer {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: "ZAR";
  message: string | null;
  status: OfferStatus;
  expiresAt: MockTimestamp | null;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockDeal {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  acceptedOfferId: string | null;
  agreedPrice: number;
  currency: "ZAR";
  depositAmount: number | null;
  commissionAmount: number | null;
  vatAmount: number | null;
  status: DealStatus;
  nextAction: string;
  createdAt: MockTimestamp;
  updatedAt: MockTimestamp;
}

export interface MockListingEvent {
  id: string;
  listingId: string;
  actorId: string | null;
  type: string;
  message: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: MockTimestamp;
}

/** Seller dashboard card summary — derived from listing + related mock data. */
export interface SellerAircraftSummary {
  id: string;
  registration: string;
  title: string;
  location: string;
  status: ListingStatus;
  completeness: number;
  missingItems: string[];
  leads: number;
  offers: number;
  nextAction: string;
  actionRequired: boolean;
}

export interface ActionRequiredItem {
  id: string;
  registration: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  urgent?: boolean;
}

export interface BuyerActivityFeedItem {
  id: string;
  type: BuyerActivityType;
  registration: string;
  message: string;
  timeAgo: string;
}

export interface DealProgressSummary {
  id: string;
  registration: string;
  title: string;
  status: DealStatus;
  buyer: string;
  agreedPrice: number;
  nextAction: string;
  listingId: string;
}

export interface ActivityFeedItem {
  id: string;
  type: string;
  registration: string;
  message: string;
  timeAgo: string;
  tasks?: Array<{ title: string; description: string | null }>;
}

export interface ReviewQueueRow {
  id: string;
  submittedAt: MockTimestamp;
  registration: string;
  aircraftTitle: string;
  sellerName: string;
  completeness: number;
  missingDocs: number;
  photoIssues: number;
  status: ListingStatus;
  assignedReviewer: string | null;
  canStartReview: boolean;
}

export interface WorkspacePrimaryCta {
  label: string;
  href: string;
}

export interface ListingWorkspaceNextStep {
  sectionLabel: string;
  message: string;
  actionRequired: boolean;
  primaryCta: WorkspacePrimaryCta | null;
}

/** Overview tab data for a single listing workspace. */
export interface ListingWorkspaceOverview {
  listingId: string;
  nextStep: ListingWorkspaceNextStep;
  blockingTasks: MockListingReviewTask[];
  recentActivity: ActivityFeedItem[];
  missingItems: string[];
  leadCount: number;
  offerCount: number;
  photoCount: number;
  documentCount: number;
  hasActiveDeal: boolean;
}

export interface LeadTableRow {
  id: string;
  listingId: string;
  registration: string;
  aircraftTitle: string;
  sellerName: string;
  buyerName: string;
  buyerEmail: string;
  buyerVerification: "UNVERIFIED" | "PENDING" | "VERIFIED";
  type: LeadType;
  status: LeadStatus;
  message: string;
  createdAt: MockTimestamp;
  listingHref: string;
}

export interface OfferTableRow {
  id: string;
  listingId: string;
  registration: string;
  aircraftTitle: string;
  sellerName: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  status: OfferStatus;
  message: string | null;
  expiresAt: MockTimestamp | null;
  createdAt: MockTimestamp;
  listingHref: string;
}
