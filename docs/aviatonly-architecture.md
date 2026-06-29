# AVIATONLY Architecture Notes

## Product Shape

AVIATONLY should be treated as a curated aircraft marketplace and transaction workflow platform, not as a generic classified ads site.

The core workflow is:

```text
Aircraft Intake Wizard
→ Listing Workspace
→ Internal Review / Valuation / Inspection
→ Publish as Fixed Price or Auction
→ Lead / Offer / Bid Management
→ Deal Room / Escrow Tracker
→ Ownership Transfer Workflow
```

The aircraft listing is a workflow object. It should have explicit states, audit history, media/document review, seller tasks, buyer activity, and admin operations.

## Core Status Flow

```text
DRAFT
→ SUBMITTED
→ UNDER_REVIEW
→ NEEDS_CHANGES
→ SUBMITTED
→ VALUATION_READY
→ INSPECTION_PENDING
→ APPROVED_FOR_LISTING
→ LIVE_FIXED_PRICE / LIVE_AUCTION
→ UNDER_OFFER
→ UNDER_CONTRACT
→ TRANSFER_PENDING
→ SOLD
```

## Listing Creation

The aircraft wizard is an intake flow, not a direct publish flow.

Recommended steps:

1. Start / Listing Type
2. Aircraft Identity
3. Ownership and Seller Details
4. Airframe Details
5. Engine Details
6. Propeller Details
7. Avionics and Equipment
8. Maintenance Status
9. Guided Photo Upload
10. Document Vault
11. Sale Setup
12. Review and Submit

The final CTA should be `Submit for AVIATONLY Review`, not `Publish Listing`.

## Listing Workspace

After a seller creates or submits an aircraft, they should land in a listing workspace:

```text
/dashboard/listings/[listingId]
```

Recommended tabs:

- Overview
- Aircraft Data
- Media
- Documents
- Review Tasks
- Valuation
- Inspection
- Listing Preview
- Leads & Offers
- Deal Room
- Activity
- Settings

The listing workspace is not the public listing page. It is the operational workspace for the seller/admin/broker to move the aircraft through the listing and sale process.

## Dashboard Shape

The dashboard home should be action-led.

It should answer:

1. What aircraft am I selling or buying?
2. What stage is each aircraft in?
3. What is AVIATONLY waiting for?
4. What do I need to do next?
5. Are there buyers, leads, offers, or bids?
6. Is a deal progressing?

Recommended seller dashboard sections:

- Action Required
- My Aircraft
- Buyer Activity
- Deal Progress
- Recent Activity

Recommended admin dashboard sections:

- Review Queue
- Listings
- Documents
- Valuations
- Inspections
- Leads
- Offers
- Deals
- Auctions
- Reports
- Settings

## Data Model Guidance

Avoid a single massive aircraft listing table with many nullable fields.

Use child/domain records:

- AircraftListing
- AircraftAirframe
- AircraftEngine
- AircraftPropeller
- AircraftAvionics
- AircraftMaintenance
- AircraftPhoto
- AircraftDocument
- ListingReviewTask
- ListingStatusHistory
- ListingEvent
- Lead
- Offer
- Deal
- Inspection
- Valuation
- Auction

## Guided Photo Upload

Aircraft photos should use a guided checklist rather than a generic upload box.

Recommended slots include:

- Exterior front 45°
- Exterior rear 45°
- Left side profile
- Right side profile
- Nose / front view
- Tail / empennage
- Wings leading edge
- Wings trailing edge
- Undercarriage / landing gear
- Tyres and brakes
- Propeller close-up
- Propeller leading edges
- Engine cowling open
- Engine bay
- Firewall area
- Oil filter / hoses
- Exhaust
- Cockpit panel powered on
- Avionics close-up
- Hobbs / tach
- Seats
- Seatbelt tags
- Interior rear/cabin
- Baggage area
- Logbook sample page
- Data plate

## Document Vault

Documents are private by default.

Sensitive documents such as logbooks, ownership documents, registration certificates, finance settlement documents, and VAT documents must not be public by default.

Document visibility options:

- PRIVATE_INTERNAL
- AVAILABLE_ON_REQUEST
- SHARED_WITH_VERIFIED_BUYER
- PUBLIC_SUMMARY_ONLY

## MVP Scope

Build first:

- Seller dashboard home
- My Aircraft page
- Create draft listing flow
- Listing workspace route
- Intake wizard route structure
- Listing status badges
- Completeness indicator
- Review task list component
- Guided photo upload placeholder component
- Document vault placeholder component
- Admin review queue placeholder

Do not build first:

- Full escrow automation
- Live auction engine
- Payment flows
- SACAA transfer automation
- Insurance integrations
- Financing integrations

Model future concepts clearly, but avoid overbuilding them in the first pass.
