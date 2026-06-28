"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ProductAction {
  title: string;
  amount: string;
  growthPercentage: string;
  icon: LucideIcon;
  badgeColor: string;
  badgetxtcolor: string
}

export default function ProductCard({
  title,
  amount,
  growthPercentage,
  icon: Icon,
  badgeColor,

  badgetxtcolor
}: ProductAction) {
  return (
    <Card className="gap-5">
      <CardHeader >
        <CardTitle>
          <h4 className="text-base font-normal">{title}</h4>
        </CardTitle>
        <CardAction>
          <div className={`p-4 rounded-lg  outline`}>
            <Icon size={16} />
          </div>
        </CardAction>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold">{amount}</h3>
          <Badge
            className={cn(
              badgeColor,
              badgetxtcolor
            )}
          >
            {growthPercentage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>

        <Button
          variant={"outline"}
          className={"flex items-center gap-1.5 w-fit rounded-lg px-4 h-9 shadow-xs cursor-pointer"}
        >
          <span>See Report</span>
          <ArrowRight size={16} />
        </Button>
      </CardContent>
    </Card>
  );
}
