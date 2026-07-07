import Link from "next/link";
import { Plane, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const MyAircraftEmptyState = () => {
  return (
    <Empty className="border border-dashed py-20">
      <EmptyHeader className="max-w-md">
        <EmptyMedia variant="icon">
          <Plane />
        </EmptyMedia>
        <EmptyTitle>No aircraft yet</EmptyTitle>
        <EmptyDescription>
          Submit your first aircraft through guided intake. AVIATONLY reviews specs,
          photos, and documents before anything goes live — then track enquiries,
          offers, and deal progress here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="max-w-md">
        <Button render={<Link href="/dashboard/seller/upload" />}>
          <Plus data-icon="inline-start" />
          Start onboarding
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default MyAircraftEmptyState;
