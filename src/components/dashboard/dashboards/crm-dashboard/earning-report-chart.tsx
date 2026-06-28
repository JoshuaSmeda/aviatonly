"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartData = [
  { browser: "Website", visitors: 24, fill: "var(--color-chart-1)" },
  { browser: "Marketplace", visitors: 20, fill: "var(--color-chart-2)" },
  { browser: "Affiliate", visitors: 60, fill: "var(--color-primary)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  Website: {
    label: "Website",
    color: "var(--color-chart-1)",
  },
  Marketplace: {
    label: "Marketplace",
    color: "var(--color-chart-2)",
  },
  Affiliate: {
    label: "Affiliate",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export default function EarningReportChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  const CustomerSegmentation = [
    {
      id: 1,
      customer: "Website",
      tagColor: "text-teal-400",
      borderColor: "bg-chart-1",
      badgeColor: "bg-teal-400/10",
      earning: 4385,
      growthPercentage: "+4.7%",
    },
    {
      id: 2,
      customer: "Marketplace",
      tagColor: "text-teal-400",
      borderColor: "bg-chart-2",
      badgeColor: "bg-teal-400/10",
      earning: 4590,
      growthPercentage: "+2.1%",
    },
    {
      id: 3,
      customer: "Affiliate",
      tagColor: "text-teal-400",
      borderColor: "bg-primary",
      badgeColor: "bg-teal-400/10",
      earning: 18356,
      growthPercentage: "-1.7%",
    },
  ];

  return (
    <Card className="h-full w-full py-6 gap-2">
      <CardHeader className="px-6">
        <CardTitle>
          <h4 className="text-lg font-medium">Revenue Sources</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 flex-1 px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={75}
              strokeWidth={50}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 10}
                          className="fill-muted-foreground text-sm"
                        >
                          Total
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 15}
                          className="fill-foreground text-xl font-medium"
                        >
                          $27,850
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-col gap-3">
          {CustomerSegmentation.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(item.borderColor, "w-1 h-4 rounded-full")}
                ></div>
                <h6 className={cn("text-sm font-medium leading-tight")}>
                  {item.customer}
                </h6>
              </div>
              <div className="flex items-center gap-1">
                <h6 className="text-sm font-medium">${item.earning}</h6>
                <Badge
                  className={cn(
                    item.badgeColor,
                    `${item.tagColor}`,
                    "shadow-none",
                  )}
                >
                  {item.growthPercentage}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
