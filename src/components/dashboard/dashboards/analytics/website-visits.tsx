"use client";
import { useContext, useState } from "react";
import { CustomizerContext } from "@/app/context/customizer-context";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export default function WebsiteVisits() {
  const dropdownItems = ["2026", "2025"];
  const [selectedYear, setSelectedYear] = useState(dropdownItems[0]);

  const seriesData: Record<string, { name: string; data: number[] }[]> = {
    "2026": [
      {
        name: "Team A",
        data: [15, 30, 24, 20, 35, 10, 40, 30, 18, 50, 17, 47],
      },
      {
        name: "Team B",
        data: [37, 65, 60, 50, 70, 35, 80, 70, 40, 85, 38, 67],
      },
    ],
    "2025": [
      {
        name: "Team A",
        data: [47, 17, 50, 19, 35, 40, 12, 44, 10, 44, 37, 19],
      },
      {
        name: "Team B",
        data: [67, 38, 85, 45, 70, 80, 38, 73, 40, 77, 50, 43],
      },
    ],
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentSeries = seriesData[selectedYear];

  const chartData = months.map((month, index) => ({
    month,
    TeamA: currentSeries[0].data[index] / 10, // divide by 10
    TeamB: currentSeries[1].data[index] / 10, // divide by 10
  }));




  const chartConfig = {
    TeamA: {
      label: "Team A",
      color: "var(--color-chart-3)",
    },
    TeamB: {
      label: "Team B",
      color: "var(--color-chart-2)",
    },
  } satisfies ChartConfig;

  const Countries = [
    {
      id: 1,
      title: "Team A",
      color: "bg-chart-3",
    },
    {
      id: 2,
      title: "Team B",
      color: "bg-chart-2",
    },
  ];

  return (
    <Card className="gap-5">
      <CardHeader className="flex flex-wrap justify-between">
        <div className="flex gap-1 flex-col">
          <CardTitle className="text-lg font-medium">Website Visits</CardTitle>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl leading-tight font-semibold">8,150</h3>
            <Badge
              className={cn(
                "bg-chart-2/10  text-chart-2 ",
              )}
            >
              +18%
            </Badge>
            <span className="text-xs text-muted-foreground">
              than last year
            </span>
          </div>
        </div>
        <div>
          <CardAction>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                {Countries.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span
                      className={cn("w-2.5 h-2.5 rounded-full", item.color)}
                    ></span>
                    <p className="text-sm text-foreground">{item.title}</p>
                  </div>
                ))}
              </div>
              <div>
                <Select
                  value={selectedYear}
                  onValueChange={(value) => value && setSelectedYear(value)}
                >
                  <SelectTrigger className="w-fit cursor-pointer text-muted-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownItems.map((item, index) => (
                      <SelectItem className="cursor-pointer" key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardAction>
        </div>

      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="w-full overflow-x-auto">

            <div className="min-w-[600px]">
              <ChartContainer config={chartConfig} className="h-65! w-full pt-4 ">
                <BarChart accessibilityLayer data={chartData} margin={{ left: -20 }} barGap={-20}
                >
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--muted-foreground)" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    interval={0}

                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}

                    tickFormatter={(value) => `${value}k`}
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />

                  <Bar
                    dataKey="TeamB"
                    fill="var(--color-chart-2)"

                    barSize={20}

                    radius={[8, 8, 0, 0]}
                  />


                  <Bar
                    dataKey="TeamA"
                    fill="var(--color-chart-3)"
                    barSize={20}

                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>


    </Card >
  );
}
