"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartColumnIncreasing, CircleCheck, Star, TrendingDown, UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EcommerceActionsCards() {
  const EcommerceActions = [
    {
      title: "Total Customers",
      subtitle: "5,868",
      cardIcon: Users,
      badgeColor: "bg-teal-400/10 text-teal-400",
      statusValue: "+12%",
    },
    {
      title: "New Leads",
      subtitle: "1,245",
      cardIcon: UserPlus,
      badgeColor: "bg-teal-400/10 text-teal-400",
      statusValue: "+8%",
    },
    {
      title: "Deals Closed",
      subtitle: "326",
      cardIcon: CircleCheck,
      badgeColor: "bg-teal-400/10 text-teal-400",
      statusValue: "+12%",
    },
    {
      title: "Lost Deals",
      subtitle: "89",
      cardIcon: TrendingDown,
      badgeColor: "bg-red-600/10 text-red-600",
      statusValue: "-3%",
    },
  ];

  return (
    <Card className="p-0">
      <CardContent className="flex items-center w-full lg:flex-nowrap flex-wrap px-0">
        {EcommerceActions.map((item, index) => {
          return (
            <div
              className="lg:w-3/12 md:w-6/12 w-full border-0 border-b last:border-b-0 md:border-e md:even:border-e-0 md:nth-[n+3]:border-b-0 lg:border-b-0 lg:even:border-e lg:last:border-e-0"
              key={index}
            >
              <div className="p-6 flex items-start justify-between">
                <div className="flex flex-col gap-4">
                  <p className="text-base font-medium text-card-foreground">
                    {item.title}
                  </p>
                  <div>
                    <p className="text-2xl font-medium text-card-foreground">
                      {item.subtitle}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        Last 7 days
                      </p>
                      <Badge
                        className={cn(
                          "font-normal text-muted-foreground",
                          item.badgeColor,
                        )}
                      >
                        {item.statusValue}
                      </Badge>
                    </div>
                  </div>
                </div>
                {/* icon */}
                <div className="p-3 rounded-full outline">
                  <item.cardIcon size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
