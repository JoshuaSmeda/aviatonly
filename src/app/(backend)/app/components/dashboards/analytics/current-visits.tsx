"use client";
import { v4 as uuidv4 } from "uuid";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export default function CurrentVisits() {
  const chartData = [
    { browser: "America", visitors: 800, fill: "var(--chart-1)" },
    { browser: "Asia", visitors: 2300, fill: "var(--chart-3)" },
    { browser: "Europe", visitors: 500, fill: "var(--chart-2)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    America: {
      label: "America",
      color: "var(--chart-1)",
    },
    Asia: {
      label: "Asia",
      color: "var(--chart-3)",
    },
    Europe: {
      label: "Europe",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;
  const CustomerSegmentation = [
    {
      id: uuidv4(),
      customer: "Asia",
      tagColor: "text-chart-2",
      borderColor: "bg-chart-3",
      badgeColor: "bg-chart-2/10",
      customerNumbers: 2300,
      growthPercentage: "+2.1%",
    },
    {
      id: uuidv4(),
      customer: "America",
      tagColor: "text-chart-2",
      borderColor: "bg-chart-1",
      badgeColor: "bg-chart-2/10 ",
      customerNumbers: 800,
      growthPercentage: "+4.7%",
    },

    {
      id: uuidv4(),
      customer: "Europe",
      tagColor: "text-rose-600",
      borderColor: "bg-chart-2",
      badgeColor: "bg-rose-600/10 ",
      customerNumbers: 500,
      growthPercentage: "-1.7%",
    },
  ];

  const totalVisitors = chartData.reduce((sum, item) => sum + item.visitors, 0);

  const [activeValue, setActiveValue] = useState<number | null>(null);

  return (
    <Card className="gap-8 ">
      <CardHeader>
        <CardTitle>
          <h4 className="text-lg font-medium">Customer Segmentation</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-8  ">
        <ChartContainer
          config={chartConfig}
          className="w-full max-h-[170px]"
        >
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius="68%"
                outerRadius="90%"
                startAngle={180}
                endAngle={-270}
                paddingAngle={3}
                onMouseEnter={(_, index) => {
                  setActiveValue(chartData[index].visitors);
                }}
                onMouseLeave={() => {
                  setActiveValue(null);
                }}
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
                            className="fill-muted-foreground text-xs"
                          >
                            Total
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 15}
                            className="fill-primary text-xl font-semibold"
                          >
                            {activeValue ?? totalVisitors}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-col gap-3">
          {CustomerSegmentation.map((item) => (
            <div key={item.id} className="flex items-center justify-between">

              <div className="flex gap-1.5 justify-center items-center text-sm font-medium">
                <span className={cn(item.borderColor, "w-1 h-4 rounded-full ")}></span>
                {item.customer}
              </div>
              <div className="flex items-center gap-2">
                <h6 className="text-sm font-medium">{item.customerNumbers}</h6>
                <Badge className={cn(item.badgeColor, item.tagColor)}>
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
