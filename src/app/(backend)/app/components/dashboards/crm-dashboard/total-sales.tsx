"use client";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { House, Globe } from 'lucide-react';


export default function TotalSales() {
  const dropdownItems = ["2026", "2025"];
  const [selectedYear, setSelectedYear] = useState(dropdownItems[0]);

  const statsData: Record<
    string,
    {
      total: string;
      percent: string;
      online: string;
      onlinePercent: string;
      offline: string;
      offlinePercent: string;
      isOfflinePositive: boolean;
      series: { name: string; type: string; data: number[] }[];
    }
  > = {
    "2026": {
      total: "$12,450.00",
      percent: "+22%",
      online: "$8,450.00",
      onlinePercent: "+10%",
      offline: "$3,700.00",
      offlinePercent: "-5%",
      isOfflinePositive: false,
      series: [
        {
          name: "Online store",
          type: "column",
          data: [
            71, 71, 50, 72, 71, 82, 108, 108, 160, 160, 126, 108, 93, 79, 79,
            79, 100, 110, 130, 160, 137, 137, 110, 110, 74,
          ],
        },
        {
          name: "Offline store",
          type: "line",
          data: [
            71, 71, 50, 72, 71, 82, 108, 108, 160, 160, 126, 108, 93, 79, 79,
            79, 100, 110, 130, 160, 137, 137, 110, 110, 74,
          ],
        },
      ],
    },
    "2025": {
      total: "$10,240.00",
      percent: "+18%",
      online: "$7,120.00",
      onlinePercent: "+12%",
      offline: "$3,120.00",
      offlinePercent: "+5%",
      isOfflinePositive: true,
      series: [
        {
          name: "Online store",
          type: "column",
          data: [
            40, 50, 25, 55, 65, 70, 90, 85, 120, 110, 100, 95, 80, 70, 65, 60,
            55, 80, 95, 110, 120, 115, 90, 85, 70,
          ],
        },
        {
          name: "Offline store",
          type: "line",
          data: [
            40, 50, 25, 55, 65, 70, 90, 85, 120, 110, 100, 95, 80, 70, 65, 60,
            55, 80, 95, 110, 120, 115, 90, 85, 70,
          ],
        },
      ],
    },
  };


  const xCategories = [
    "Jan", "",
    "Feb", "",
    "Mar", "",
    "Apr", "",
    "May", "",
    "Jun", "",
    "Jul", "",
    "Aug", "",
    "Sep", "",
    "Oct", "",
    "Nov", "",
    "Dec"
  ];
  const currentData = statsData[selectedYear] || statsData["2026"];

  // Prepare Recharts data keeping same 25 points
  const chartData = xCategories.map((month, i) => ({
    month: month || "",
    online: currentData.series[0].data[i],
    offline: currentData.series[1].data[i],
  }));

  return (
    <Card className="p-6 gap-8">
      <CardHeader className=" flex items-center lg:flex-nowrap flex-wrap lg:gap-0 gap-2 justify-between p-0">
        <div className="flex flex-col gap-1">
          <p className="text-base font-normal text-muted-foreground">
            Total Sales
          </p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold text-foreground">
              {currentData.total}
            </h3>
            <Badge className="bg-chart-2/10  text-chart-2 font-normal">
              {currentData.percent}
            </Badge>
            <p className="text-xs font-normal text-muted-foreground">
              compared to last year
            </p>
          </div>
        </div>
        <CardAction>
          <Select
            value={selectedYear}
            onValueChange={(value) => value && setSelectedYear(value)}
          >
            <SelectTrigger className="w-fit h-9! shadow-xs cursor-pointer text-muted-foreground">
              <SelectValue className={"text-primary"}/>
            </SelectTrigger>
            <SelectContent>
              {dropdownItems.map((item, index) => (
                <SelectItem className="cursor-pointer" key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0 flex  flex-col gap-6">
        <div className="">
          <ChartContainer
            className="h-50! w-full"
            config={{
              online: {
                label: "Online store",
                color: "var(--color-primary)",
              },
              offline: {
                label: "Offline store",
                color: "var(--color-primary)",
              },
            }}
          >
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
              barCategoryGap="6%"

            >
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                interval={0}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <YAxis hide />
              <Bar
                dataKey="online"
                fill="var(--color-online)"
                fillOpacity={0.15}

              />
              <Line
                type="monotone"
                dataKey="offline"
                stroke="var(--color-online)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
