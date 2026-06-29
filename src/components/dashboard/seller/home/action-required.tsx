import Link from "next/link";
import { ArrowRight, CircleAlert } from "lucide-react";
import CardBox from "@/components/dashboard/shared/CardBox";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { ActionRequiredItem } from "@/lib/aviatonly/mock/types";
import { cn } from "@/lib/utils";

interface ActionRequiredProps {
  items: ActionRequiredItem[];
}

const ActionRequired = ({ items }: ActionRequiredProps) => {
  return (
    <CardBox>
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle className="flex items-center gap-2">
          Action required
          {items.length > 0 && <Badge variant="destructive">{items.length}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleAlert />
              </EmptyMedia>
              <EmptyTitle>You&apos;re all caught up</EmptyTitle>
              <EmptyDescription>No outstanding actions on your aircraft right now.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                      item.urgent
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <CircleAlert className="size-4" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </div>
                </div>
                <Button
                  variant={item.urgent ? "default" : "outline"}
                  size="sm"
                  className="shrink-0 self-start sm:self-auto"
                  render={<Link href={item.href} />}
                >
                  {item.ctaLabel}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </CardBox>
  );
};

export default ActionRequired;
