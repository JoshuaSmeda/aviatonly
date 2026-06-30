"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  MapPin,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminRecordInspectionOutcomeAction,
  adminScheduleListingInspectionAction,
} from "@/app/(dashboard)/dashboard/admin/listings/actions";
import ListingStatusBadge from "@/components/dashboard/shared/listing-status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getListingStatusMeta, ListingStatus } from "@/lib/aviatonly/domain";
import type { MockAircraftListing } from "@/lib/aviatonly/mock/types";

interface ListingInspectionPanelProps {
  listing: MockAircraftListing;
  canManageReview?: boolean;
}

function InspectionIdleState({ title }: { title: string }) {
  return (
    <Empty className="border border-dashed py-16">
      <EmptyHeader className="max-w-md">
        <EmptyMedia variant="icon">
          <ShieldCheck />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>Nothing to do here right now.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function formatSchedule(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function InspectionStatusCard({ listing }: { listing: MockAircraftListing }) {
  const statusMeta = getListingStatusMeta(listing.status);

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">Inspection status</span>
        <ListingStatusBadge status={listing.status} />
      </div>
      <p className="mt-3 text-sm">{statusMeta.description}</p>
    </div>
  );
}

function InspectionDetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 text-sm">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0">
        <dt className="text-muted-foreground">{label}</dt>
        <dd className="font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}

function InspectionScheduleCard({ listing }: { listing: MockAircraftListing }) {
  const scheduled = formatSchedule(listing.inspectionScheduledAt);
  const completed = formatSchedule(listing.inspectionCompletedAt);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Inspection details</CardTitle>
          {listing.status === ListingStatus.INSPECTION_PENDING ? (
            <Badge variant="outline">Scheduled</Badge>
          ) : null}
          {listing.status === ListingStatus.INSPECTION_PASSED ? (
            <Badge>Passed</Badge>
          ) : null}
          {listing.status === ListingStatus.INSPECTION_FAILED ? (
            <Badge variant="destructive">Failed</Badge>
          ) : null}
        </div>
        <CardDescription>Independent AMO or platform physical verification.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          {listing.inspectionProvider ? (
            <InspectionDetailRow
              icon={Building2}
              label="AMO / inspector"
              value={listing.inspectionProvider}
            />
          ) : null}
          {listing.inspectionLocation ? (
            <InspectionDetailRow
              icon={MapPin}
              label="Location"
              value={listing.inspectionLocation}
            />
          ) : null}
          {scheduled ? (
            <InspectionDetailRow icon={Calendar} label="Scheduled" value={scheduled} />
          ) : null}
          {completed ? (
            <InspectionDetailRow icon={CheckCircle2} label="Completed" value={completed} />
          ) : null}
        </dl>
        {listing.inspectionNotes ? (
          <>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">{listing.inspectionNotes}</p>
          </>
        ) : null}
        {listing.inspectionSummary ? (
          <>
            <Separator className="my-4" />
            <p className="text-sm">
              <span className="text-muted-foreground">Outcome · </span>
              <span className="font-medium text-foreground">{listing.inspectionSummary}</span>
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

function InspectionScheduleForm({
  listingId,
  provider,
  setProvider,
  location,
  setLocation,
  scheduledAt,
  setScheduledAt,
  notes,
  setNotes,
  isPending,
  onSubmit,
  submitLabel,
}: {
  listingId: string;
  provider: string;
  setProvider: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  scheduledAt: string;
  setScheduledAt: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  isPending: boolean;
  onSubmit: () => void;
  submitLabel: string;
}) {
  const idPrefix = `inspection-${listingId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitLabel}</CardTitle>
        <CardDescription>
          Book an independent AMO or platform visit. The seller sees the date, location, and your
          notes on this tab.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${idPrefix}-provider`}>AMO / inspector</Label>
            <Input
              id={`${idPrefix}-provider`}
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. AeroTech AMO"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${idPrefix}-location`}>Location</Label>
            <Input
              id={`${idPrefix}-location`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. FAGM — Rand Airport"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-scheduled-at`}>Date & time</Label>
          <Input
            id={`${idPrefix}-scheduled-at`}
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-notes`}>Notes for seller (optional)</Label>
          <Textarea
            id={`${idPrefix}-notes`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Logbooks required, contact on site, aircraft must be hangared…"
          />
        </div>
        <Button disabled={isPending} onClick={onSubmit} className="w-fit">
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          {submitLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

function ListingInspectionAdminPanel({ listing }: { listing: MockAircraftListing }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [provider, setProvider] = useState(listing.inspectionProvider ?? "");
  const [location, setLocation] = useState(listing.inspectionLocation ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    listing.inspectionScheduledAt ? listing.inspectionScheduledAt.slice(0, 16) : "",
  );
  const [notes, setNotes] = useState(listing.inspectionNotes ?? "");
  const [outcomeSummary, setOutcomeSummary] = useState("");

  const overviewHref = `/dashboard/listings/${listing.id}?tab=overview`;

  const canSchedule = [
    ListingStatus.VALUATION_READY,
    ListingStatus.APPROVED_FOR_LISTING,
    ListingStatus.INSPECTION_PENDING,
  ].includes(listing.status);

  const schedule = () => {
    startTransition(async () => {
      const result = await adminScheduleListingInspectionAction({
        listingId: listing.id,
        provider,
        location,
        scheduledAt,
        notes: notes.trim() || undefined,
      });
      if (!result.ok) {
        toast.error(result.error ?? "Could not schedule inspection.");
        return;
      }
      toast.success("Inspection scheduled.");
      router.refresh();
    });
  };

  const recordOutcome = (passed: boolean) => {
    startTransition(async () => {
      const result = await adminRecordInspectionOutcomeAction({
        listingId: listing.id,
        passed,
        summary: outcomeSummary,
      });
      if (!result.ok) {
        toast.error(result.error ?? "Could not record outcome.");
        return;
      }
      toast.success(passed ? "Inspection marked as passed." : "Inspection marked as failed.");
      router.refresh();
    });
  };

  if (listing.status === ListingStatus.INSPECTION_FAILED) {
    return (
      <div className="flex flex-col gap-6">
        <InspectionStatusCard listing={listing} />
        <Card className="border-destructive/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="size-5 text-destructive" aria-hidden />
              <CardTitle>Inspection failed</CardTitle>
            </div>
            <CardDescription>
              {listing.inspectionSummary ?? "Follow up with the seller before re-scheduling."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (
    listing.status === ListingStatus.APPROVED_FOR_LISTING &&
    !listing.inspectionScheduledAt
  ) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InspectionStatusCard listing={listing} />
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Your next step</p>
            <p className="mt-2 text-sm font-medium">
              Publish from Overview when ready, or schedule an optional AMO visit below.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              render={<Link href={overviewHref} />}
            >
              Open overview
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>

        <Empty className="border border-dashed py-12">
          <EmptyHeader className="max-w-lg">
            <EmptyMedia variant="icon">
              <ShieldCheck />
            </EmptyMedia>
            <EmptyTitle>Physical inspection not required</EmptyTitle>
            <EmptyDescription>
              This listing was approved without a recorded AMO visit. Schedule one only if AVIATONLY
              still wants independent verification before going live.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>

        {canSchedule ? (
          <InspectionScheduleForm
            listingId={listing.id}
            provider={provider}
            setProvider={setProvider}
            location={location}
            setLocation={setLocation}
            scheduledAt={scheduledAt}
            setScheduledAt={setScheduledAt}
            notes={notes}
            setNotes={setNotes}
            isPending={isPending}
            onSubmit={schedule}
            submitLabel="Schedule optional inspection"
          />
        ) : null}
      </div>
    );
  }

  if (listing.status === ListingStatus.INSPECTION_PENDING) {
    return (
      <div className="flex flex-col gap-6">
        <InspectionStatusCard listing={listing} />
        <InspectionScheduleCard listing={listing} />
        <Card>
          <CardHeader>
            <CardTitle>Record inspection outcome</CardTitle>
            <CardDescription>
              After the AMO visit, record pass or fail. A pass clears the listing for publication.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`inspection-outcome-${listing.id}`}>Outcome summary</Label>
              <Textarea
                id={`inspection-outcome-${listing.id}`}
                value={outcomeSummary}
                onChange={(e) => setOutcomeSummary(e.target.value)}
                rows={4}
                placeholder="MPI findings, airworthiness notes, defects flagged…"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled={isPending} onClick={() => recordOutcome(true)}>
                {isPending ? <Spinner data-icon="inline-start" /> : null}
                Mark passed
              </Button>
              <Button variant="destructive" disabled={isPending} onClick={() => recordOutcome(false)}>
                Mark failed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (listing.status === ListingStatus.INSPECTION_PASSED) {
    return (
      <div className="flex flex-col gap-6">
        <InspectionStatusCard listing={listing} />
        <InspectionScheduleCard listing={listing} />
        <Alert>
          <AlertTitle>Ready for publication</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>Inspection passed — publish from Overview when ready.</span>
            <Button size="sm" className="w-fit shrink-0" render={<Link href={overviewHref} />}>
              Open overview
              <ArrowRight data-icon="inline-end" />
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (canSchedule) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-primary">Your next step</p>
            <p className="text-base font-semibold">
              Schedule an AMO inspection, or approve for publication from the Valuation tab if
              physical verification is not needed.
            </p>
          </div>
        </div>
        <InspectionScheduleForm
          listingId={listing.id}
          provider={provider}
          setProvider={setProvider}
          location={location}
          setLocation={setLocation}
          scheduledAt={scheduledAt}
          setScheduledAt={setScheduledAt}
          notes={notes}
          setNotes={setNotes}
          isPending={isPending}
          onSubmit={schedule}
          submitLabel="Schedule inspection"
        />
      </div>
    );
  }

  return (
    <InspectionIdleState title="Inspection not available yet" />
  );
}

function ListingInspectionSellerPanel({ listing }: { listing: MockAircraftListing }) {
  if (
    listing.status === ListingStatus.APPROVED_FOR_LISTING &&
    !listing.inspectionScheduledAt
  ) {
    return <InspectionIdleState title="No physical inspection required" />;
  }

  if (listing.status === ListingStatus.INSPECTION_PENDING) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-primary">Your next step</p>
            <p className="text-base font-semibold">
              Attend the scheduled inspection with logbooks and the aircraft available at the
              location below.
            </p>
          </div>
        </div>
        <InspectionScheduleCard listing={listing} />
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <ClipboardList className="mr-1 size-3" aria-hidden />
            Bring logbooks
          </Badge>
          <Badge variant="secondary">
            <MapPin className="mr-1 size-3" aria-hidden />
            Aircraft on site
          </Badge>
        </div>
      </div>
    );
  }

  if (listing.status === ListingStatus.INSPECTION_PASSED) {
    return (
      <div className="flex flex-col gap-6">
        <InspectionScheduleCard listing={listing} />
        <InspectionIdleState title="Inspection passed" />
      </div>
    );
  }

  if (listing.status === ListingStatus.INSPECTION_FAILED) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="size-5 text-destructive" aria-hidden />
            <CardTitle>Inspection issues recorded</CardTitle>
          </div>
          <CardDescription>
            {listing.inspectionSummary ?? "AVIATONLY will contact you about next steps."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (listing.status === ListingStatus.VALUATION_READY) {
    return <InspectionIdleState title="Inspection not scheduled yet" />;
  }

  return <InspectionIdleState title="Inspection not required yet" />;
}

const ListingInspectionPanel = ({
  listing,
  canManageReview = false,
}: ListingInspectionPanelProps) => {
  if (canManageReview) {
    return <ListingInspectionAdminPanel listing={listing} />;
  }
  return <ListingInspectionSellerPanel listing={listing} />;
};

export default ListingInspectionPanel;
