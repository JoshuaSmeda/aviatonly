import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { AircraftMarketplaceDetail } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";

interface AircraftDetailBreadcrumbProps {
  listing: AircraftMarketplaceDetail;
}

export function AircraftDetailBreadcrumb({ listing }: AircraftDetailBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard/buy"
        aria-label="Back to browse aircraft"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background shadow-xs transition-colors hover:bg-muted [&_svg]:size-4"
      >
        <ChevronLeft />
      </Link>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/buy">Aircraft For Sale</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{listing.registration}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
