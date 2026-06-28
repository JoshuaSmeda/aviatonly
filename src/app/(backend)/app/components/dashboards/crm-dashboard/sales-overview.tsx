"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "Jan", closeddeals: 55, pipelinerevenue: 55 },
  { month: "Feb", closeddeals: 100, pipelinerevenue: 100 },
  { month: "Mar", closeddeals: 90, pipelinerevenue: 90 },
  { month: "Apr", closeddeals: 70, pipelinerevenue: 70 },
  { month: "May", closeddeals: 100, pipelinerevenue: 100 },
  { month: "Jun", closeddeals: 80, pipelinerevenue: 80 },
  { month: "Jul", closeddeals: 95, pipelinerevenue: 95 },
  { month: "Aug", closeddeals: 69, pipelinerevenue: 69 },
  { month: "Sep", closeddeals: 60, pipelinerevenue: 60 },
  { month: "Oct", closeddeals: 130, pipelinerevenue: 130 },
  { month: "Nov", closeddeals: 55, pipelinerevenue: 55 },
  { month: "Dec", closeddeals: 85, pipelinerevenue: 85 },
];

const chartConfig = {
  closeddeals: {
    label: "Closed Deals",
    color: "var(--color-primary)",
  },
  pipelinerevenue: {
    label: "Pipeline Revenue",
    color: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
} satisfies ChartConfig;

export default function SalesOverviewChart() {
  const Countries = [
    {
      id: 1,
      title: "Closed Deals",
      color: "bg-primary",
    },
    {
      id: 2,
      title: "Pipeline Revenue",
      color: "color-mix(in oklab, var(--primary) 20%, transparent)",
    }
  ];

  return (
    <Card className="w-full py-6 gap-6">
      <CardHeader className="flex sm:flex-row flex-col justify-between sm:items-center items-start gap-3 px-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-medium text-card-foreground">
              $640,000
            </h3>
            <Badge
              className={cn("bg-teal-400/10 text-teal-400 shadow-none")}
            >
              +18%
            </Badge>
            <span className="text-xs text-muted-foreground">
              vs last month
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {Countries.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className={cn("w-1.5 h-1.5 rounded-full bg-primary/20", item.color)} />
              <p className="text-sm text-muted-foreground">{item.title}</p>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="rgba(144, 164, 174, 0.3)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={12}
              tickFormatter={(value) => `${value / 10}k`}
              domain={[0, 100]}
              ticks={[0, 50, 100, 150, 200, 250, 300]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="closeddeals"
              stackId="a"
              fill="var(--color-closeddeals)"
              radius={[6, 6, 6, 6]}
              barSize={20}
            />
            <Bar
              dataKey="pipelinerevenue"
              stackId="a"
              fill="var(--color-pipelinerevenue)"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
