import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import AircraftListingCard from "@/components/dashboard/seller/home/aircraft-listing-card";
import CardBox from "@/components/dashboard/shared/CardBox";
import { Button } from "@/components/ui/button";
import { buildSellerAircraftSummaries } from "@/lib/aviatonly/mock";
import { ADMIN_ROLES, SELLER_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "My Aircraft | AVIATONLY",
};

const MyAircraftPage = async () => {
  await requireAnyRole([...SELLER_ROLES, ...ADMIN_ROLES]);
  const aircraft = buildSellerAircraftSummaries();

  return (
    <>
      <BreadcrumbComp title="My Aircraft" />
      <CardBox className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {aircraft.length} aircraft in your AVIATONLY seller workspace.
            </p>
            <Button size="sm" render={<Link href="/dashboard/seller/upload" />}>
              <Plus data-icon="inline-start" />
              List an aircraft
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {aircraft.map((item) => (
              <AircraftListingCard key={item.id} aircraft={item} />
            ))}
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default MyAircraftPage;
