"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  ClipboardCheck,
  Eye,
  FileText,
  Gauge,
  HandCoins,
  Handshake,
  Images,
  LayoutDashboard,
  type LucideIcon,
  Plane,
  ShieldCheck,
} from "lucide-react";
import WorkflowPlaceholder from "@/components/dashboard/shared/workflow-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getDealStatusMeta,
  getDocumentStatusMeta,
  getPhotoStatusMeta,
  getReviewTaskStatusMeta,
} from "@/lib/aviatonly/domain";
import {
  buildListingWorkspaceOverview,
  formatTimeAgo,
  formatZar,
  getListingEventLabel,
  getMockAirframe,
  getMockAvionics,
  getMockDealForListing,
  getMockDocumentsForListing,
  getMockEngines,
  getMockEventsForListing,
  getMockMaintenance,
  getMockPhotosForListing,
  getMockPropellers,
  getOpenReviewTasksForListing,
  listingLocation,
} from "@/lib/aviatonly/mock";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";
import ListingWorkspaceActivityTimeline from "./listing-workspace-activity-timeline";
import ListingLeadsOffersPanel from "./listing-leads-offers-panel";
import ListingWorkspaceOverviewTab from "./listing-workspace-overview";

const WORKSPACE_TABS = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "aircraft-data", label: "Aircraft Data", icon: Plane },
  { value: "media", label: "Media", icon: Images },
  { value: "documents", label: "Documents", icon: FileText },
  { value: "review-tasks", label: "Review Tasks", icon: ClipboardCheck },
  { value: "valuation", label: "Valuation", icon: Gauge },
  { value: "inspection", label: "Inspection", icon: ShieldCheck },
  { value: "preview", label: "Listing Preview", icon: Eye },
  { value: "leads-offers", label: "Leads & Offers", icon: HandCoins },
  { value: "deal-room", label: "Deal Room", icon: Handshake },
  { value: "activity", label: "Activity", icon: Activity },
] as const satisfies ReadonlyArray<{ value: string; label: string; icon: LucideIcon }>;

type WorkspaceTabValue = (typeof WORKSPACE_TABS)[number]["value"];

const VALID_TABS = new Set<string>(WORKSPACE_TABS.map((t) => t.value));

function resolveTab(tab: string | null): WorkspaceTabValue {
  if (tab && VALID_TABS.has(tab)) {
    return tab as WorkspaceTabValue;
  }
  return "overview";
}

interface ListingWorkspaceTabsProps {
  listing: MockAircraftListing;
}

const ListingWorkspaceTabs = ({ listing }: ListingWorkspaceTabsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = resolveTab(searchParams.get("tab"));

  const overview = buildListingWorkspaceOverview(listing.id);
  if (!overview) {
    return null;
  }

  const airframe = getMockAirframe(listing.id);
  const engines = getMockEngines(listing.id);
  const propellers = getMockPropellers(listing.id);
  const avionics = getMockAvionics(listing.id);
  const maintenance = getMockMaintenance(listing.id);
  const photos = getMockPhotosForListing(listing.id);
  const documents = getMockDocumentsForListing(listing.id);
  const openTasks = getOpenReviewTasksForListing(listing.id);
  const deal = getMockDealForListing(listing.id);
  const events = getMockEventsForListing(listing.id);

  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={setTab} className="w-full items-start">
      <div className="overflow-x-auto">
        <TabsList variant="line" className="w-max">
          {WORKSPACE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" className="w-full flex-none pt-6">
        <ListingWorkspaceOverviewTab listing={listing} overview={overview} />
      </TabsContent>

      <TabsContent value="aircraft-data" className="w-full flex-none pt-6">
        <dl className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Registration</dt>
            <dd className="font-medium">{listing.registration}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Registration type</dt>
            <dd className="font-medium">{listing.registrationType}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Make / model</dt>
            <dd className="font-medium">{listing.make} {listing.model}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Year</dt>
            <dd className="font-medium">{listing.year}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Category</dt>
            <dd className="font-medium">{listing.category}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Location</dt>
            <dd className="font-medium">{listingLocation(listing)}</dd>
          </div>
          {airframe?.totalTimeAirframe != null && (
            <div>
              <dt className="text-muted-foreground">TTAF</dt>
              <dd className="font-medium">{airframe.totalTimeAirframe.toLocaleString()} hrs</dd>
            </div>
          )}
          {airframe?.damageHistory && (
            <div className="md:col-span-2">
              <dt className="text-muted-foreground">Damage history</dt>
              <dd className="font-medium">{airframe.damageHistory}</dd>
            </div>
          )}
          {engines[0] && (
            <div>
              <dt className="text-muted-foreground">Engine</dt>
              <dd className="font-medium">
                {engines[0].manufacturer} {engines[0].model} · {engines[0].engineHours} hrs
                {engines[0].timeSinceOverhaul != null && ` · TSO ${engines[0].timeSinceOverhaul} hrs`}
              </dd>
            </div>
          )}
          {propellers[0] && (
            <div>
              <dt className="text-muted-foreground">Propeller</dt>
              <dd className="font-medium">
                {propellers[0].manufacturer} {propellers[0].model}
                {propellers[0].propellerHours != null && ` · ${propellers[0].propellerHours} hrs`}
              </dd>
            </div>
          )}
          {avionics && (
            <div className="md:col-span-2">
              <dt className="text-muted-foreground">Avionics</dt>
              <dd className="font-medium">{avionics.equipment.join(", ")}</dd>
            </div>
          )}
          {maintenance && (
            <>
              <div>
                <dt className="text-muted-foreground">Maintenance status</dt>
                <dd className="font-medium">{maintenance.status}</dd>
              </div>
              {maintenance.lastMpiDate && (
                <div>
                  <dt className="text-muted-foreground">Last MPI</dt>
                  <dd className="font-medium">
                    {new Date(maintenance.lastMpiDate).toLocaleDateString("en-ZA")}
                  </dd>
                </div>
              )}
              {maintenance.notes && (
                <div className="md:col-span-2">
                  <dt className="text-muted-foreground">Maintenance notes</dt>
                  <dd className="font-medium">{maintenance.notes}</dd>
                </div>
              )}
            </>
          )}
        </dl>
      </TabsContent>

      <TabsContent value="media" className="w-full flex-none pt-6">
        {photos.length === 0 ? (
          <WorkflowPlaceholder
            icon={Images}
            title="No photos uploaded"
            description="Guided photo slots from intake will appear here with review status per angle."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {photos.map((photo) => (
              <li
                key={photo.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
              >
                <span>
                  {photo.slotKey.replace(/-/g, " ")} · {photo.fileName}
                </span>
                <Badge variant={getPhotoStatusMeta(photo.status).badgeVariant}>
                  {getPhotoStatusMeta(photo.status).label}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="documents" className="w-full flex-none pt-6">
        {documents.length === 0 ? (
          <WorkflowPlaceholder
            icon={FileText}
            title="No documents uploaded"
            description="Private document vault slots will appear here once uploaded during intake."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
              >
                <span>
                  {doc.documentType.replace(/-/g, " ")} · {doc.fileName}
                </span>
                <Badge variant={getDocumentStatusMeta(doc.reviewStatus).badgeVariant}>
                  {getDocumentStatusMeta(doc.reviewStatus).label}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="review-tasks" className="w-full flex-none pt-6">
        {openTasks.length === 0 ? (
          <WorkflowPlaceholder
            icon={ClipboardCheck}
            title="No open review tasks"
            description="AVIATONLY review tasks will appear here when action is required from you or operations."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {openTasks.map((task) => (
              <li key={task.id} className="rounded-lg border border-border p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{task.title}</span>
                  <div className="flex items-center gap-2">
                    {task.blockingPublication && (
                      <Badge variant="destructive">Blocks publication</Badge>
                    )}
                    <Badge variant="outline">{getReviewTaskStatusMeta(task.status).label}</Badge>
                  </div>
                </div>
                {task.description && (
                  <p className="mt-2 text-muted-foreground">{task.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="valuation" className="w-full flex-none pt-6">
        {listing.valuationEstimate ? (
          <div className="space-y-4">
            <p className="text-sm">
              Internal AVIATONLY valuation estimate:{" "}
              <span className="font-semibold">{formatZar(listing.valuationEstimate)}</span>
            </p>
            {listing.askingPrice && (
              <p className="text-sm text-muted-foreground">
                Seller asking price: {formatZar(listing.askingPrice)}
              </p>
            )}
            {listing.reservePrice && (
              <p className="text-sm text-muted-foreground">
                Auction reserve: {formatZar(listing.reservePrice)}
              </p>
            )}
          </div>
        ) : (
          <WorkflowPlaceholder
            icon={Gauge}
            title="Valuation not started"
            description="AVIATONLY will add an internal valuation estimate after initial data review."
          />
        )}
      </TabsContent>

      <TabsContent value="inspection" className="w-full flex-none pt-6">
        <WorkflowPlaceholder
          icon={ShieldCheck}
          title="Inspection not scheduled"
          description="Independent AMO or platform inspection will be scheduled when AVIATONLY requires verification before publication."
        />
      </TabsContent>

      <TabsContent value="preview" className="w-full flex-none pt-6">
        <WorkflowPlaceholder
          icon={Eye}
          title="Listing preview"
          description="This is a seller preview only. Your aircraft is not publicly visible until AVIATONLY approves and publishes the listing."
        />
      </TabsContent>

      <TabsContent value="leads-offers" className="w-full flex-none pt-6">
        <ListingLeadsOffersPanel listingId={listing.id} />
      </TabsContent>

      <TabsContent value="deal-room" className="w-full flex-none pt-6">
        {deal ? (
          <div className="space-y-4 rounded-lg border border-border p-5 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p>
                Agreed price: <span className="font-semibold">{formatZar(deal.agreedPrice)}</span>
              </p>
              <Badge variant={getDealStatusMeta(deal.status).badgeVariant}>
                {getDealStatusMeta(deal.status).label}
              </Badge>
            </div>
            <p className="text-muted-foreground">{deal.nextAction}</p>
            <p className="text-xs text-muted-foreground">
              Deal tracking only — payment and escrow integration is not yet connected.
            </p>
          </div>
        ) : (
          <WorkflowPlaceholder
            icon={Handshake}
            title="No active deal"
            description="A deal room opens once AVIATONLY accepts an offer or an auction closes successfully."
          />
        )}
      </TabsContent>

      <TabsContent value="activity" className="w-full flex-none pt-6">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No workflow events recorded yet.</p>
        ) : (
          <ListingWorkspaceActivityTimeline
            items={events.map((event) => ({
              id: event.id,
              type: getListingEventLabel(event.type),
              registration: listing.registration,
              message: event.message ?? "",
              timeAgo: formatTimeAgo(event.createdAt),
            }))}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ListingWorkspaceTabs;
