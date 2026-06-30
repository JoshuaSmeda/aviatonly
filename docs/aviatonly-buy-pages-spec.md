# AVIATONLY Buy Pages Spec

# AVIATONLY Buy Pages Specification

The AVIATONLY `/buy` section is the public aircraft marketplace.

It should be inspired by premium real-estate marketplace UX, but adapted for aircraft sales. Do not make it feel like a generic classifieds page.

The `/buy` section should communicate:

- Premium aviation marketplace
- Curated aircraft listings
- Trust and verification
- Clear aircraft data
- High-quality imagery
- Easy filtering
- Buyer confidence
- Strong enquiry/offer flow

## Reference Layout Pattern

Use a layout inspired by premium real-estate marketplace filter and detail pages.

The list page pattern:

- Filter panel on the left
- Listing results on the right
- Clear "Filter" heading
- Reset action
- Filter groups
- Apply action
- Result count
- Listing cards
- Pagination

The detail page pattern:

- Breadcrumb/status path at top
- Top actions such as share/save
- Large image gallery
- Listing title, price, and location
- Key metric summary
- Seller/broker/contact panel
- Highlights section
- Description section
- Estimated market value section

Adapt real-estate concepts into aviation-specific equivalents:

- Property Type -> Aircraft Category / Aircraft Type
- Rooms/Beds -> Seats / Engine Count / Range / Hours
- Amenities -> Avionics / IFR / Autopilot / ADS-B / Hangared / Logbooks
- Price Range -> Aircraft Asking Price / Auction Reserve / POA
- Location -> Airfield / Province / Country
- Agent Card -> Seller / Broker / AVIATONLY contact panel
- Zestimate / Market Estimate -> AVIATONLY Valuation / Market Estimate

## Routes

Implement:

- `/buy`
- `/buy/[listingSlug]`

Optional later:

- `/buy/auction`
- `/buy/fixed-price`
- `/buy/saved`
- `/buy/compare`

Use mock data first unless the database is already wired.

## `/buy` Page Purpose

Primary user goals:

1. Browse available aircraft.
2. Filter by aircraft type, price, location, make, model, hours, and avionics.
3. Quickly understand each aircraft.
4. Open a listing detail page.
5. Save, share, enquire, or make an offer.

## `/buy` Page Layout

Desktop:

```txt
/buy
────────────────────────────────────────────
Hero / page header
"Find your next aircraft"
Search input
Optional short trust message

Main content grid
├── Left filter sidebar
└── Right results area
    ├── results toolbar
    ├── aircraft cards grid/list
    └── pagination
```

Recommended desktop grid:

- Left filter panel: 280px to 340px wide
- Results area: flexible
- Gap: 24px

Mobile:

- Filters collapse into a drawer/sheet.
- Results appear in one-column cards.
- Sticky mobile filter button near top or bottom.

## `/buy` Header

Include:

- Title: `Find your next aircraft`
- Subtitle: `Browse curated aircraft listings reviewed by AVIATONLY.`
- Search input placeholder: `Search by registration, make, model, or airfield`
- Optional quick stats:
  - Verified listings
  - Aircraft under review
  - Fixed-price and auction options

Do not overpromise verification unless the listing status supports it.

## Filter Sidebar

The filter panel should be a card or sticky sidebar.

Header:

- `Filter`
- `Reset`

Primary action:

- `Apply Filters`

Filter groups:

### Search

Field: `searchTerm`

Placeholder: `Registration, make, model, airfield`

### Location

Fields:

- `country`
- `province`
- `airfield`

Examples:

- South Africa
- Western Cape
- Gauteng
- Morningstar
- Wonderboom
- Lanseria
- Stellenbosch

### Sale Type

Options:

- All
- Fixed Price
- Auction
- Make Offer
- Price on Application

### Price Range

Options:

- All prices
- Under R500k
- R500k - R1m
- R1m - R2.5m
- R2.5m - R5m
- More than R5m
- Custom

Custom fields:

- `minPrice`
- `maxPrice`

Default currency: ZAR.

### Aircraft Category

Options:

- All
- Single Engine Piston
- Multi Engine Piston
- Turboprop
- Jet
- Helicopter
- Light Sport Aircraft
- Experimental / NTCA
- Glider
- Microlight

### Registration Type

Options:

- All
- ZS
- ZU
- Foreign Registered

### Make

Popular chips:

- Cessna
- Piper
- Beechcraft
- Cirrus
- Sling
- Vans
- Mooney
- Diamond
- Tecnam
- Robinson
- Bell

### Seats

Options:

- Any
- 1 - 2
- 3 - 4
- 5 - 6
- 7+

### Engine Count

Options:

- Any
- Single
- Twin
- Multi

### Total Time Airframe

Options:

- Any
- Under 500 hours
- 500 - 1,500 hours
- 1,500 - 3,000 hours
- 3,000 - 6,000 hours
- More than 6,000 hours

### Maintenance / Condition

Options:

- Currently airworthy
- MPI current
- Logbooks complete
- Hangared
- No known damage history
- Inspection available

### Avionics / Equipment

Options:

- IFR equipped
- Autopilot
- ADS-B
- Glass cockpit
- Garmin panel
- Mode S transponder
- GPS/NAV/COM
- Engine monitor
- ELT

### Listing Status

Buyer-facing statuses:

- Available
- New Listing
- Under Offer
- Auction Live
- Auction Scheduled
- Sold

Do not expose internal statuses like `UNDER_REVIEW`, `NEEDS_CHANGES`, `APPROVED_FOR_LISTING`, or `DOCUMENT_REJECTED` on public pages.

## Results Toolbar

Above the listing cards, show:

- Result count
- Active filters summary
- Sort dropdown
- View toggle if implemented

Example:

`Showing 1 - 9 of 24 aircraft`

Sort options:

- Newest listed
- Price: Low to High
- Price: High to Low
- Total time: Low to High
- Year: Newest First
- Recently updated
- Auction ending soon

Active filter chips:

- Western Cape
- Single Engine Piston
- Under R2.5m
- IFR Equipped

Each chip should be removable.

## Aircraft Listing Card

Cards should be premium and information-dense, but not cluttered.

Each card should include:

- Main aircraft image
- Sale badge: Fixed Price, Auction, Make Offer, POA
- Public status badge: Available, New, Under Offer, Auction Live
- Optional verified/curated badge
- Registration number
- Year, make, model, variant
- Location / airfield
- Price
- Key aircraft stats
- Short feature row
- Save/share action
- CTA to view detail

Recommended card data:

- `imageUrl`
- `registration`
- `year`
- `make`
- `model`
- `variant`
- `location`
- `airfield`
- `province`
- `country`
- `price`
- `currency`
- `saleType`
- `publicStatus`
- `totalTimeAirframe`
- `engineHours`
- `seats`
- `engineCount`
- `aircraftCategory`
- `avionicsSummary`
- `maintenanceSummary`
- `isVerified`
- `isAuction`
- `auctionEndsAt`
- `slug`

Example card:

```txt
[Aircraft Image]                         [Fixed Price] [Verified]

ZS-ABC
1978 Cessna 172N Skyhawk

Morningstar Airfield, Western Cape

R1,250,000

2,840 TTAF · 180 SMOH · 4 Seats · IFR

Garmin avionics · MPI current · Hangared

[View aircraft]
```

## Card Visual Rules

Use:

- Rounded cards
- Large image area
- Slight border
- Clean spacing
- Status badges
- Muted metadata
- Strong price display
- Clear CTA

Avoid:

- Too many icons
- Real-estate language
- Rooms/beds/baths terminology
- Star ratings unless AVIATONLY has a real rating model

Do not show arbitrary fake ratings like `4.8` unless ratings are a real product concept.

## Pagination

Show:

- `Showing Result: 1 - 9 of 24`
- Previous
- Page numbers
- Next

For MVP, static/mock pagination is acceptable.

## Empty State

If no aircraft match filters, show:

Title: `No aircraft match your filters`

Description: `Try removing a few filters or broadening your search criteria.`

Actions:

- Reset filters
- View all aircraft

Do not use generic `No data found`.

## `/buy/[listingSlug]` Detail Page Purpose

Primary user goals:

1. Review aircraft visually.
2. Understand technical aircraft data.
3. Trust the listing.
4. Contact seller/AVIATONLY.
5. Make an offer or register interest.
6. Request documents if allowed.
7. Save/share the listing.

## Detail Page Layout

Suggested structure:

```txt
/buy/[listingSlug]
────────────────────────────────────────────
Breadcrumb / status line
Top action bar

Image gallery

Main content grid
├── Left/main content
│   ├── Title, price, location
│   ├── Key aircraft stats
│   ├── Highlights
│   ├── Description
│   ├── Airframe
│   ├── Engine
│   ├── Propeller
│   ├── Avionics
│   ├── Maintenance
│   ├── Documents summary
│   ├── Inspection / verification summary
│   ├── Market estimate
│   └── Similar aircraft
│
└── Right sticky enquiry panel
    ├── Seller / AVIATONLY contact
    ├── Enquiry form
    ├── Make offer CTA
    ├── Request documents CTA
    └── Save/share actions
```

## Detail Page Top Bar

Use breadcrumb/status style.

Examples:

- `Buy / Single Engine Piston / Cessna / ZS-ABC`
- `For Sale / Western Cape / Morningstar / ZS-ABC`

Top actions:

- Save
- Share
- Report listing

Do not show admin actions like Edit/Hide on the public buyer page.

## Image Gallery

Desktop:

- Large primary image on left
- 4 smaller images on right in a grid
- Overlay: `View all photos`, `12 photos`

Mobile:

- Carousel/swipeable gallery
- Photo count indicator

Gallery photo types should be aircraft-specific:

- Exterior front 45°
- Exterior rear 45°
- Side profile
- Cockpit panel
- Interior
- Engine bay
- Propeller
- Avionics
- Logbook sample only if explicitly allowed

Do not expose private documents as gallery images.

## Detail Header

Show:

- Sale type label: Aircraft for sale, Auction aircraft, Price on application
- Price
- Registration
- Year make model variant
- Location / airfield
- Public status badge

Example:

```txt
Aircraft for sale

R1,250,000

ZS-ABC — 1978 Cessna 172N Skyhawk
Morningstar Airfield, Western Cape, South Africa
```

## Key Aircraft Stats

Use aviation-specific stats:

- Total Time Airframe
- Engine Time / SMOH
- Seats
- Engine Count
- Year
- Registration Type
- Category
- Airworthiness Status

Example:

```txt
2,840
TTAF

180
SMOH

4
Seats

Single
Engine

1978
Year

ZS
Registration
```

## Buyer CTA / Enquiry Panel

Use a right-side sticky contact panel on desktop.

Panel content:

- Seller type: Private seller, Broker, AVIATONLY managed listing
- Contact name or AVIATONLY contact
- Phone/email only if intentionally public
- Enquiry form
- Message textarea prefilled with aircraft-specific text
- Primary CTA
- Secondary CTAs

Default message:

`Hi, I would like to know more about this aircraft listing.`

Fields:

- name
- email
- phone
- message

Buttons:

- Send enquiry
- Make an offer
- Request documents
- Save aircraft

For auction listings:

- Register to bid
- View auction terms
- Watch auction

## Highlights Section

Use aircraft-specific highlight chips.

Examples:

- MPI current
- Hangared
- Complete logbooks
- Garmin avionics
- IFR equipped
- Low engine time
- Fresh annual
- No known damage history
- ADS-B equipped
- Autopilot
- Excellent paint
- Excellent interior
- South African registered
- VAT included
- Inspection available

## Description Section

Use seller/admin-approved listing description.

Structure:

- Overview paragraph
- Ownership/usage notes
- Condition notes
- Reason for sale, if available
- Included extras
- Exclusions

Avoid unverified claims.

If a field is seller-provided, make that clear where needed.

## Technical Details Sections

Use structured cards/sections.

### Airframe

Fields:

- Total Time Airframe
- Year of manufacture
- Serial number
- Category
- Registration type
- Damage history
- Accident history
- Corrosion notes
- Paint condition
- Interior condition

### Engine

Support one or multiple engines.

Fields:

- Position
- Manufacturer
- Model
- Serial number
- Engine hours
- Time since overhaul
- Time since new
- Overhaul date
- Known issues

### Propeller

Fields:

- Manufacturer
- Model
- Serial number
- Blade count
- Propeller type
- Propeller hours
- Time since overhaul
- Known damage notes

### Avionics

Fields:

- Primary avionics suite
- Com radios
- Nav radios
- Transponder
- ADS-B
- GPS
- Autopilot
- EFIS / glass cockpit
- Engine monitor
- ELT
- Intercom
- Other equipment

### Maintenance

Fields:

- Last MPI date
- Next MPI due date
- MPI hours remaining
- Maintenance organisation / AMO
- Logbooks complete
- Airframe logs available
- Engine logs available
- Propeller logs available
- AD/SB compliance known
- Aircraft currently airworthy
- Authority to Fly / Certificate of Airworthiness expiry
- Known defects

## Documents Summary

Show only public summary of document availability. Do not expose files directly.

Example:

```txt
Documents available

Certificate of Registration: Available on request
Authority to Fly / CoA: Reviewed by AVIATONLY
Maintenance records: Available to verified buyers
Logbook summary: Available to verified buyers
```

CTA: `Request document access`

Document access should create a buyer request, not immediately expose sensitive files.

## Inspection / Verification Summary

Show trust-related checks without overclaiming.

Possible statuses:

- Not inspected by AVIATONLY
- Seller-provided documents under review
- Documents reviewed by AVIATONLY
- Inspection available
- Independent inspection completed

Example:

```txt
AVIATONLY review status

Documents reviewed
Photos verified
Inspection available on request
```

Only show these if the underlying listing status supports them.

## Market Estimate Section

Use:

- AVIATONLY Market Estimate
- Estimated value range
- Recommended asking price
- Comparable aircraft notes

Example:

```txt
AVIATONLY Market Estimate

Estimated range:
R1.15m - R1.35m

Recommended market position:
Fairly priced

Notes:
Based on aircraft type, hours, avionics, maintenance status, and comparable listings.
```

If valuation is not available:

```txt
Market estimate not available yet.
AVIATONLY can provide a valuation once the aircraft has been reviewed.
```

## Auction Detail Variant

If `saleType` is `AUCTION`, adapt the detail page.

Show:

- Current bid
- Reserve status if public: Reserve not met, Reserve met
- Auction ends in
- Bid count
- Register to bid CTA
- Auction terms
- Buyer premium/fees if applicable

Do not mix fixed-price CTA and auction CTA without clear hierarchy.

## Similar Aircraft Section

At bottom, show 3 to 4 similar aircraft cards.

Based on:

- same category
- similar price
- similar make/model
- same region
- similar engine type

Use the same `AircraftListingCard` component.

## Components To Create

Create or update these components:

- `BuyPageHeader`
- `AircraftFilterSidebar`
- `AircraftResultsToolbar`
- `ActiveFilterChips`
- `AircraftListingGrid`
- `AircraftListingCard`
- `AircraftPagination`
- `AircraftEmptyState`
- `AircraftDetailBreadcrumb`
- `AircraftDetailActions`
- `AircraftImageGallery`
- `AircraftDetailHeader`
- `AircraftKeyStats`
- `AircraftHighlights`
- `AircraftDescription`
- `AircraftTechnicalDetails`
- `AircraftDocumentsSummary`
- `AircraftVerificationSummary`
- `AircraftMarketEstimate`
- `AircraftEnquiryPanel`
- `SimilarAircraftSection`

## Suggested File Structure

```txt
app/
  buy/
    page.tsx
    [listingSlug]/
      page.tsx

components/
  buy/
    buy-page-header.tsx
    aircraft-filter-sidebar.tsx
    aircraft-results-toolbar.tsx
    active-filter-chips.tsx
    aircraft-listing-grid.tsx
    aircraft-listing-card.tsx
    aircraft-pagination.tsx
    aircraft-empty-state.tsx
    aircraft-detail-breadcrumb.tsx
    aircraft-detail-actions.tsx
    aircraft-image-gallery.tsx
    aircraft-detail-header.tsx
    aircraft-key-stats.tsx
    aircraft-highlights.tsx
    aircraft-description.tsx
    aircraft-technical-details.tsx
    aircraft-documents-summary.tsx
    aircraft-verification-summary.tsx
    aircraft-market-estimate.tsx
    aircraft-enquiry-panel.tsx
    similar-aircraft-section.tsx

lib/
  aviatonly/
    marketplace/
      filters.ts
      mock-aircraft-listings.ts
      aircraft-marketplace-types.ts
      aircraft-marketplace-utils.ts
```

## Data Types

Create marketplace-specific types.

```ts
export type AircraftSaleType =
  | "FIXED_PRICE"
  | "AUCTION"
  | "MAKE_OFFER"
  | "PRICE_ON_APPLICATION";

export type PublicAircraftStatus =
  | "AVAILABLE"
  | "NEW_LISTING"
  | "UNDER_OFFER"
  | "AUCTION_LIVE"
  | "AUCTION_SCHEDULED"
  | "SOLD";

export type AircraftCategory =
  | "SINGLE_ENGINE_PISTON"
  | "MULTI_ENGINE_PISTON"
  | "TURBOPROP"
  | "JET"
  | "HELICOPTER"
  | "LIGHT_SPORT"
  | "EXPERIMENTAL_NTCA"
  | "GLIDER"
  | "MICROLIGHT";

export type AircraftListingImage = {
  id: string;
  url: string;
  alt: string;
  slotKey?: string;
  isPrimary?: boolean;
};

export type AircraftMarketplaceListing = {
  id: string;
  slug: string;
  registration: string;
  year: number;
  make: string;
  model: string;
  variant?: string;
  category: AircraftCategory;
  saleType: AircraftSaleType;
  publicStatus: PublicAircraftStatus;
  price?: number;
  currency: "ZAR" | "USD" | "EUR";
  priceLabel?: string;
  location: {
    airfield?: string;
    province?: string;
    country: string;
  };
  totalTimeAirframe?: number;
  engineTime?: number;
  engineTimeLabel?: string;
  seats?: number;
  engineCount?: number;
  registrationType?: "ZS" | "ZU" | "FOREIGN";
  avionicsSummary?: string;
  maintenanceSummary?: string;
  highlights: string[];
  images: AircraftListingImage[];
  isVerified?: boolean;
  isFeatured?: boolean;
  auction?: {
    currentBid?: number;
    reserveMet?: boolean;
    endsAt?: string;
    bidCount?: number;
  };
};
```

## Filtering Behaviour

Filtering should be implemented in a clean utility file first.

Use:

- search term
- location
- sale type
- price range
- aircraft category
- registration type
- make
- seats
- engine count
- total time range
- maintenance flags
- avionics flags

For MVP, client-side filtering against mock data is acceptable.

Later, replace with server-side filtering/search params.

## URL Search Params

Eventually support URL-driven filters.

Example:

```txt
/buy?category=SINGLE_ENGINE_PISTON&province=Western+Cape&maxPrice=2500000&avionics=IFR
```

For MVP, prepare the structure but do not overbuild.

## Responsive Rules

Desktop:

- Sidebar filters visible.
- Results grid 2 or 3 columns depending on width.
- Detail page has main content plus sticky enquiry panel.

Tablet:

- Filter sidebar may collapse.
- Results grid 2 columns.
- Detail page enquiry panel moves below gallery/header or remains sidebar if space allows.

Mobile:

- Filter drawer/sheet.
- Results grid 1 column.
- Detail gallery becomes carousel.
- Enquiry panel becomes sticky bottom CTA or appears below key details.

## Do Not Build Yet

Do not build these unless explicitly requested:

- Real payment processing
- Real auction bidding
- Real escrow
- SACAA transfer automation
- Buyer verification workflow
- Live chat
- Real document access approval
- AI valuation
- Real map integration

Model the UI so these can be added later.

## Acceptance Criteria

The `/buy` page is acceptable when:

- It has a premium marketplace header.
- It has aviation-specific filters.
- It renders aircraft listing cards.
- It has result count, sorting, active filters, and pagination.
- It has proper empty state.
- It works on desktop and mobile.
- It does not use real-estate terminology.
- It does not expose internal listing statuses.

The `/buy/[listingSlug]` page is acceptable when:

- It has a gallery.
- It has price, registration, make/model/year, and location.
- It has aircraft-specific key stats.
- It has highlights.
- It has technical aircraft sections.
- It has a seller/AVIATONLY enquiry panel.
- It has a documents summary without exposing private documents.
- It has verification/inspection summary.
- It has market estimate section.
- It has similar aircraft.
- It does not show admin actions.
