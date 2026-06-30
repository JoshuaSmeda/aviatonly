"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  ClipboardCheck,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDealStatusMeta, PhotoStatus } from "@/lib/aviatonly/domain";
import {
  formatTimeAgo,
  formatZar,
  getListingEventLabel,
} from "@/lib/aviatonly/mock";
import { parseListingEventTaskSummaries } from "@/lib/aviatonly/domain/listing-event-tasks";
import type { ListingWorkspaceData } from "@/lib/aviatonly/server/listing-workspace";
import ListingWorkspaceActivityTimeline from "./listing-workspace-activity-timeline";
import ListingLeadsOffersPanel from "./listing-leads-offers-panel";
import ListingWorkspaceOverviewTab from "./listing-workspace-overview";
import ListingAircraftDataReviewTab from "./listing-aircraft-data-review-tab";
import ListingMediaReviewTab from "./listing-media-review-tab";
import ListingDocumentsReviewTab from "./listing-documents-review-tab";
import ListingValuationPanel from "./listing-valuation-panel";
import ListingInspectionPanel from "./listing-inspection-panel";
import ListingReviewTasksAdminPanel from "./listing-review-tasks-admin-panel";
import ListingSellerReviewTasksPanel from "./listing-seller-review-tasks-panel";

const WORKSPACE_TABS = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "aircraft-data", label: "Aircraft Data", icon: Plane },
  { value: "media", label: "Media", icon: Images },
  { value: "documents", label: "Documents", icon: FileText },
  { value: "review-tasks", label: "Review Tasks", icon: ClipboardCheck },
  { value: "valuation", label: "Valuation", icon: Gauge },
  { value: "inspection", label: "Inspection", icon: ShieldCheck },
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
  workspace: ListingWorkspaceData;
  canManageReview?: boolean;
}

const ListingWorkspaceTabs = ({
  workspace,
  canManageReview = false,
}: ListingWorkspaceTabsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = resolveTab(searchParams.get("tab"));

  const {
    listing,
    overview,
    openTasks,
    deal,
    events,
  } = workspace;

  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={setTab} className="w-full items-start">
      <div className="overflow-x-auto overflow-y-hidden">
        <TabsList variant="line" className="w-max flex-nowrap">
          {WORKSPACE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" className="w-full flex-none pt-6">
        <ListingWorkspaceOverviewTab
          listing={listing}
          overview={overview}
          canManageReview={canManageReview}
          approvedPhotoCount={
            workspace.photos.filter((photo) => photo.status === PhotoStatus.APPROVED).length
          }
        />
      </TabsContent>

      <TabsContent value="aircraft-data" className="w-full flex-none pt-6">
        <ListingAircraftDataReviewTab
          workspace={workspace}
          canManageReview={canManageReview}
        />
      </TabsContent>

      <TabsContent value="media" className="w-full flex-none pt-6">
        <ListingMediaReviewTab workspace={workspace} canManageReview={canManageReview} />
      </TabsContent>

      <TabsContent value="documents" className="w-full flex-none pt-6">
        <ListingDocumentsReviewTab workspace={workspace} canManageReview={canManageReview} />
      </TabsContent>

      <TabsContent value="review-tasks" className="w-full flex-none pt-6">
        {canManageReview ? (
          <ListingReviewTasksAdminPanel workspace={workspace} />
        ) : (
          <ListingSellerReviewTasksPanel workspace={workspace} />
        )}
      </TabsContent>

      <TabsContent value="valuation" className="w-full flex-none pt-6">
        <ListingValuationPanel listing={listing} canManageReview={canManageReview} />
      </TabsContent>

      <TabsContent value="inspection" className="w-full flex-none pt-6">
        <ListingInspectionPanel listing={listing} canManageReview={canManageReview} />
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
              tasks: parseListingEventTaskSummaries(
                (event.metadata as Record<string, unknown> | null) ?? null,
              ),
            }))}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ListingWorkspaceTabs;
