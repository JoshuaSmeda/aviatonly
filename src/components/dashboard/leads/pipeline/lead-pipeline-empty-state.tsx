import Link from "next/link";
import { Kanban, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const LeadPipelineEmptyState = () => {
  return (
    <Empty className="border border-dashed py-16">
      <EmptyHeader className="max-w-md">
        <EmptyMedia variant="icon">
          <Kanban />
        </EmptyMedia>
        <EmptyTitle>No buyer enquiries yet</EmptyTitle>
        <EmptyDescription>
          When buyers enquire on your live aircraft listings, leads will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="max-w-md">
        <Button render={<Link href="/dashboard/listings" />}>
          <Plane data-icon="inline-start" />
          View my listings
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default LeadPipelineEmptyState;
