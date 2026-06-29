"use client";

import {
  AlertTriangle,
  HandCoins,
  Plane,
  Radio,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { isLiveStatus } from "@/lib/aviatonly/domain";
import { buildActionRequiredItems, buildSellerAircraftSummaries } from "@/lib/aviatonly/mock";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

const SummaryStats = () => {
  const aircraft = buildSellerAircraftSummaries();
  const actionItems = buildActionRequiredItems();

  const stats: Stat[] = [
    {
      label: "My aircraft",
      value: aircraft.length,
      description: "In your portfolio",
      icon: Plane,
    },
    {
      label: "Live listings",
      value: aircraft.filter((a) => isLiveStatus(a.status)).length,
      description: "Published now",
      icon: Radio,
    },
    {
      label: "Total leads",
      value: aircraft.reduce((sum, a) => sum + a.leads, 0),
      description: "Buyer enquiries",
      icon: Users,
    },
    {
      label: "Offers pending",
      value: aircraft.reduce((sum, a) => sum + a.offers, 0),
      description: "Awaiting response",
      icon: HandCoins,
    },
    {
      label: "Action required",
      value: actionItems.length,
      description: "Needs your attention",
      icon: AlertTriangle,
    },
  ];

  return (
    <Card className="p-0">
      <CardContent className="flex w-full flex-wrap items-center px-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "w-full border-0 border-b border-border last:border-b-0",
              "md:w-6/12 md:border-e md:even:border-e-0 md:[&:nth-child(5)]:border-e-0 md:[&:nth-child(n+5)]:border-b-0",
              "xl:w-1/5 xl:border-b-0 xl:border-e xl:last:border-e-0",
            )}
          >
            <div className="flex items-start justify-between p-6">
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-card-foreground">{stat.label}</p>
                <div>
                  <p className="text-2xl font-medium tabular-nums text-card-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
              <div className="rounded-full p-3 outline">
                <stat.icon size={16} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SummaryStats;
