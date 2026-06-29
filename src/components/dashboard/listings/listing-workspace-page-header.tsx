import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ListingWorkspacePageHeaderProps {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
}

const ListingWorkspacePageHeader = ({
  backHref,
  backLabel,
  eyebrow,
  title,
}: ListingWorkspacePageHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
        <Button variant="outline" size="sm" render={<Link href={backHref} />}>
          <ChevronLeft data-icon="inline-start" />
          {backLabel}
        </Button>
        <Separator orientation="vertical" className="hidden h-9 sm:block" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-muted-foreground">{eyebrow}</p>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingWorkspacePageHeader;
