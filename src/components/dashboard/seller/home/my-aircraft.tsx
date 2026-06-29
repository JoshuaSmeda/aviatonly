import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AircraftListingCard from "./aircraft-listing-card";
import type { SellerAircraftSummary } from "@/lib/aviatonly/mock/types";

interface MyAircraftProps {
  aircraft: SellerAircraftSummary[];
}

const MyAircraft = ({ aircraft }: MyAircraftProps) => {
  return (
    <section className="flex flex-col gap-4 py-0">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold">My aircraft</h5>
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
    </section>
  );
};

export default MyAircraft;
